"""
ViralForge AI — Views
API endpoints for auth, generation, projects, and regeneration.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

import requests as http_requests

from .models import Project
from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ProjectSerializer,
    ProjectListSerializer,
)

from .services import (
    generate_reel_content_with_thumbnails,
    client as gemini_client
)

from .thumbnail_service import generate_thumbnails


# ─────────────────────────────────────────────────────────────
# AUTH
# ─────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()

    permission_classes = (AllowAny,)

    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):

    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    """
    Accepts a Google ID token (credential) from the frontend,
    verifies it with Google, creates or fetches the Django user,
    and returns Django JWT access + refresh tokens.

    POST /api/auth/google/
    Body: { "credential": "<google_id_token>" }
    """
    credential = request.data.get('credential')
    if not credential:
        return Response(
            {'error': 'Google credential is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verify with Google's tokeninfo endpoint
    try:
        google_response = http_requests.get(
            'https://oauth2.googleapis.com/tokeninfo',
            params={'id_token': credential},
            timeout=10
        )
        if google_response.status_code != 200:
            return Response(
                {'error': 'Invalid Google token. Please try again.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        google_data = google_response.json()
        email = google_data.get('email')
        name = google_data.get('name', '')

        if not email:
            return Response(
                {'error': 'Could not retrieve email from Google.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception:
        return Response(
            {'error': 'Failed to verify Google token. Check your network.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Get or create Django user
    user, created = User.objects.get_or_create(
        username=email,
        defaults={
            'email': email,
            'first_name': name,
        }
    )
    if created:
        # Set unusable password — Google users log in via OAuth only
        user.set_unusable_password()
        user.save()

    # Issue Django JWT tokens
    refresh = RefreshToken.for_user(user)

    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'name': user.first_name or user.username,
        'email': user.email,
    })


# ─────────────────────────────────────────────────────────────
# USER CREDITS
# ─────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_credits(request):
    # get_or_create ensures no crash if profile is missing (e.g. old users or race conditions)
    profile, _ = request.user.userprofile.__class__.objects.get_or_create(
        user=request.user,
        defaults={'credits': 10000, 'total_generations': 0}
    )

    return Response({
        "credits": profile.credits,
        "max_credits": 10000,
        "total_generations": profile.total_generations,
    })


# ─────────────────────────────────────────────────────────────
# GENERATE CONTENT
# ─────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_content(request):

    GENERATION_COST = 10

    try:

        data = request.data

        profile, _ = request.user.userprofile.__class__.objects.get_or_create(
            user=request.user,
            defaults={'credits': 10000, 'total_generations': 0}
        )

        # ── Credit Validation ─────────────────

        if profile.credits < GENERATION_COST:

            return Response({

                "error": "Not enough credits"

            }, status=400)

        # ── Deduct Credits ────────────────────

        profile.credits -= GENERATION_COST

        profile.total_generations += 1

        profile.save()

        # ── AI Generation ─────────────────────

        ai_result = generate_reel_content_with_thumbnails(
            data
        )

        # ── Save Project ──────────────────────

        project = Project.objects.create(

            user=request.user,

            title=data.get('title'),

            audience=data.get('audience'),

            tone=data.get('tone'),

            platform=data.get('platform'),

            hook=ai_result.get('hook'),

            alternative_hooks=
                ai_result.get(
                    'alternative_hooks',
                    []
                ),

            script=ai_result.get('script'),

            hashtags=ai_result.get('hashtags'),

            caption=ai_result.get('caption'),

            viral_score=
                ai_result.get('viral_score'),

            thumbnail_titles=
                ai_result.get(
                    'thumbnail_titles',
                    []
                ),

            thumbnail_images=
                ai_result.get(
                    'thumbnail_images',
                    []
                ),
        )

        return Response({

            "success": True,

            "project_id": project.id,

            "data": ProjectSerializer(project).data,

            "credits_remaining":
                profile.credits,

            "total_generations":
                profile.total_generations

        })

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=500)


# ─────────────────────────────────────────────────────────────
# PROJECTS
# ─────────────────────────────────────────────────────────────

class ProjectListView(generics.ListAPIView):

    serializer_class = ProjectListSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Project.objects.filter(
            user=self.request.user
        )


class ProjectDetailView(generics.RetrieveAPIView):

    serializer_class = ProjectSerializer

    permission_classes = [IsAuthenticated]

    queryset = Project.objects.all()


# ─────────────────────────────────────────────────────────────
# FAVORITES
# ─────────────────────────────────────────────────────────────

class FavoriteListView(generics.ListAPIView):
    """Returns only projects marked as favorite."""
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(
            user=self.request.user,
            is_favorite=True
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, pk):
    """Toggles is_favorite field for a project."""
    project = get_object_or_404(
        Project,
        pk=pk,
        user=request.user
    )
    project.is_favorite = not project.is_favorite
    project.save(update_fields=['is_favorite', 'updated_at'])

    return Response({
        "id": project.id,
        "is_favorite": project.is_favorite,
        "success": True
    })


# ─────────────────────────────────────────────────────────────
# REGENERATE FULL PROJECT
# ─────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_project(request, project_id):

    REGENERATION_COST = 10

    try:

        project = get_object_or_404(
            Project,
            pk=project_id,
            user=request.user
        )

        profile, _ = request.user.userprofile.__class__.objects.get_or_create(
            user=request.user,
            defaults={'credits': 10000, 'total_generations': 0}
        )

        # ── Credit Check ──────────────────────

        if profile.credits < REGENERATION_COST:

            return Response({

                "error":
                    "Not enough credits to regenerate."

            }, status=400)

        # ── Deduct Credits ────────────────────

        profile.credits -= REGENERATION_COST

        profile.total_generations += 1

        profile.save()

        # ── Rebuild Input ─────────────────────

        data = {

            'title': project.title,

            'audience': project.audience,

            'tone': project.tone,

            'platform': project.platform,

        }

        # ── AI Regeneration ───────────────────

        ai_result = generate_reel_content_with_thumbnails(
            data
        )

        # ── Update Project ────────────────────

        project.hook = ai_result.get(
            'hook',
            project.hook
        )

        project.alternative_hooks = ai_result.get(
            'alternative_hooks',
            project.alternative_hooks
        )

        project.script = ai_result.get(
            'script',
            project.script
        )

        project.hashtags = ai_result.get(
            'hashtags',
            project.hashtags
        )

        project.caption = ai_result.get(
            'caption',
            project.caption
        )

        project.viral_score = ai_result.get(
            'viral_score',
            project.viral_score
        )

        project.thumbnail_titles = ai_result.get(
            'thumbnail_titles',
            project.thumbnail_titles
        )

        project.thumbnail_images = ai_result.get(
            'thumbnail_images',
            project.thumbnail_images
        )

        project.save()

        return Response({

            "success": True,

            "project_id": project.id,

            "data": ProjectSerializer(project).data,

            "credits_remaining":
                profile.credits,

            "total_generations":
                profile.total_generations

        })

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=500)


# ─────────────────────────────────────────────────────────────
# REGENERATE THUMBNAILS ONLY
# ─────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def regenerate_thumbnails_view(request, pk):

    try:

        project = get_object_or_404(
            Project,
            pk=pk,
            user=request.user
        )

        thumbnail_data = generate_thumbnails(

            gemini_client,

            title=project.title,

            platform=
                project.platform or
                'Instagram Reel',

            tone=
                project.tone or
                'Motivational',
        )

        project.thumbnail_images = thumbnail_data

        project.save(
            update_fields=[
                'thumbnail_images',
                'updated_at'
            ]
        )

        return Response({

            "project_id": project.id,

            "thumbnail_images": thumbnail_data,

        })

    except Exception as e:

        return Response({

            "error": str(e)

        }, status=500)


# ─────────────────────────────────────────────────────────────
# DASHBOARD STATS
# ─────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):

    user_projects = Project.objects.filter(
        user=request.user
    )

    total_projects = user_projects.count()

    profile, _ = request.user.userprofile.__class__.objects.get_or_create(
        user=request.user,
        defaults={'credits': 10000, 'total_generations': 0}
    )
    total_generations = profile.total_generations

    hours_saved = total_generations * 2

    engagement_rate = min(
        95,
        30 + (total_projects * 2)
    )

    return Response({

        "total_projects": total_projects,

        "total_generations":
            total_generations,

        "hours_saved":
            hours_saved,

        "engagement_rate":
            engagement_rate

    })