"""
ViralForge AI — Optimized Thumbnail Generation Service
Fast, token-efficient, production-safe thumbnail pipeline.
"""

import os
import uuid
import requests

from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────────────────────

STABILITY_API_KEY = os.getenv(
    "STABILITY_API_KEY",
    ""
)

MEDIA_ROOT = Path(
    os.getenv(
        "MEDIA_ROOT",
        str(
            Path(__file__)
            .resolve()
            .parent.parent / "media"
        )
    )
)

MEDIA_URL = "/media/"


# ─────────────────────────────────────────────────────────────
# STATIC PROMPT BUILDER
# ─────────────────────────────────────────────────────────────

def build_thumbnail_prompt(
    title,
    platform="Instagram Reel",
    tone="Motivational"
):
    """
    Builds a strong viral thumbnail prompt
    WITHOUT Gemini calls.
    Extremely fast + token efficient.
    """

    return f"""
    Viral social media thumbnail.

    Topic: {title}

    Platform: {platform}

    Tone: {tone}

    Style:
    ultra realistic,
    cinematic lighting,
    expressive human emotion,
    high contrast,
    vibrant neon glow,
    modern creator economy aesthetic,
    dark luxury background,
    bold typography,
    highly clickable,
    viral YouTube thumbnail style,
    dramatic composition,
    attention grabbing,
    4k quality.
    """


# ─────────────────────────────────────────────────────────────
# IMAGE GENERATION
# ─────────────────────────────────────────────────────────────

def generate_thumbnail_image(prompt):
    """
    Generates thumbnail image using Stability AI.
    Returns image URL or fallback image.
    NEVER crashes.
    """

    fallback_url = (
        "/static/images/default-thumbnail.jpg"
    )

    if not STABILITY_API_KEY:

        print(
            "[Thumbnail] Missing STABILITY_API_KEY"
        )

        return fallback_url

    try:

        url = (
            "https://api.stability.ai/"
            "v2beta/stable-image/"
            "generate/core"
        )

        headers = {

            "Authorization":
                f"Bearer {STABILITY_API_KEY}",

            "Accept": "image/*",
        }

        payload = {

            "prompt": prompt,

            "output_format": "webp",

            "aspect_ratio": "9:16",
        }

        response = requests.post(

            url,

            headers=headers,

            files={"none": ""},

            data=payload,

            timeout=15
        )

        if response.status_code != 200:

            print(

                f"[Thumbnail] Stability Error "
                f"{response.status_code}: "
                f"{response.text[:200]}"
            )

            return fallback_url

        # ── Save Image ────────────────────────

        thumbnails_dir = (
            MEDIA_ROOT / "thumbnails"
        )

        thumbnails_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        filename = (
            f"thumb_"
            f"{uuid.uuid4().hex[:12]}.webp"
        )

        filepath = (
            thumbnails_dir / filename
        )

        with open(filepath, "wb") as f:

            f.write(response.content)

        return (
            f"{MEDIA_URL}"
            f"thumbnails/{filename}"
        )

    except Exception as e:

        print(
            f"[Thumbnail] Generation Failed: {e}"
        )

        return fallback_url


# ─────────────────────────────────────────────────────────────
# MAIN PIPELINE
# ─────────────────────────────────────────────────────────────

def generate_thumbnails(
    client,
    title,
    platform="Instagram Reel",
    tone="Motivational"
):
    """
    Full thumbnail pipeline.
    Fast + stable + quota-safe.
    NEVER raises exceptions.
    """

    try:

        prompt = build_thumbnail_prompt(
            title=title,
            platform=platform,
            tone=tone
        )

        image_url = generate_thumbnail_image(
            prompt
        )

        return [

            {
                "prompt": prompt,

                "image_url": image_url,
            }

        ]

    except Exception as e:

        print(
            f"[Thumbnail Pipeline Error] {e}"
        )

        return [

            {
                "prompt":
                    f"Thumbnail for {title}",

                "image_url":
                    "/static/images/default-thumbnail.jpg",
            }

        ]