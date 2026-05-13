from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver



class Project(models.Model):
    """
    Stores a single AI-generated content project.
    Each project belongs to one user and holds all inputs + outputs.
    """
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    null=True,
    blank=True
)

    # ── User Inputs ──
    title = models.CharField(max_length=255)
    audience = models.CharField(max_length=255, blank=True, default='')
    tone = models.CharField(max_length=100, blank=True, default='')
    platform = models.CharField(max_length=100, blank=True, default='')
    video_length = models.CharField(max_length=100, blank=True, default='')
    key_points = models.TextField(blank=True, default='')
    instructions = models.TextField(blank=True, default='')
    language = models.CharField(max_length=50, blank=True, default='English')

    # ── AI Generated Outputs ──
    script = models.TextField(blank=True, default='')
    hook = models.TextField(blank=True, default='')
    hashtags = models.JSONField(default=list, blank=True)
    caption = models.TextField(blank=True, default='')
    viral_score = models.IntegerField(default=0)
    thumbnail_titles = models.JSONField(default=list, blank=True)
    thumbnail_images = models.JSONField(default=list, blank=True)  # [{"prompt": "...", "image_url": "..."}]
    alternative_hooks = models.JSONField(default=list, blank=True)

    # ── Metadata ──
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} — {self.user.username}"

class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    credits = models.IntegerField(default=10000)

    total_generations = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):

    if created:

        UserProfile.objects.create(user=instance)