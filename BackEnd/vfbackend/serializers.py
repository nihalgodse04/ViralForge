"""
ViralForge AI — Serializers
Handles data validation and transformation for API endpoints.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Project


# ─── Auth Serializers ────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'name')
        extra_kwargs = {
            'username': {'required': False}
        }

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        username = validated_data.get('username', validated_data.get('email'))

        user = User.objects.create_user(
            username=username,
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=name
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Returns user name and email alongside JWT tokens."""
    def validate(self, attrs):
        data = super().validate(attrs)
        data['name'] = self.user.first_name or self.user.username
        data['email'] = self.user.email
        return data


# ─── Project Serializers ─────────────────────────────────────

class ProjectSerializer(serializers.ModelSerializer):
    """Full project serializer — used for detail/list views."""
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'audience', 'tone', 'platform',
            'video_length', 'key_points', 'instructions', 'language',
            'script', 'hook', 'alternative_hooks', 'hashtags', 'caption', 'viral_score',
            'thumbnail_titles', 'thumbnail_images', 'is_favorite',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer — used for project list/history cards."""
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'platform', 'tone', 'viral_score',
            'hook', 'is_favorite', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class GenerateInputSerializer(serializers.Serializer):
    """Validates incoming generation request payload."""
    title = serializers.CharField(max_length=255)
    audience = serializers.CharField(max_length=255, required=False, default='General')
    tone = serializers.CharField(max_length=100, required=False, default='Motivational')
    platform = serializers.CharField(max_length=100, required=False, default='Instagram Reel')
    video_length = serializers.CharField(max_length=100, required=False, default='30-45 seconds')
    key_points = serializers.CharField(required=False, default='', allow_blank=True)
    instructions = serializers.CharField(required=False, default='', allow_blank=True)
    language = serializers.CharField(max_length=50, required=False, default='English')
