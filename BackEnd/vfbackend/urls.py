"""
ViralForge AI — URL Configuration
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    user_credits,
    dashboard_stats,
    RegisterView,
    CustomTokenObtainPairView,
    generate_content,
    ProjectListView,
    ProjectDetailView,
    FavoriteListView,
    toggle_favorite,
    regenerate_project,
    regenerate_thumbnails_view,
)

urlpatterns = [

    # ── Auth ──
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ── AI Generation ──
    path('generate/', generate_content, name='generate'),
    path('user/credits/', user_credits),

    # ── Projects ──
    path('projects/', ProjectListView.as_view(), name='project-list'),
    path('projects/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('projects/<int:pk>/favorite/', toggle_favorite, name='project-favorite'),
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('projects/<int:project_id>/regenerate/', regenerate_project, name='project-regenerate'),
    path('projects/<int:pk>/regenerate-thumbnails/', regenerate_thumbnails_view, name='project-regenerate-thumbnails'),
    path('dashboard/stats/', dashboard_stats),

]