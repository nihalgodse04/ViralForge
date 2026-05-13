from openai import OpenAI
from dotenv import load_dotenv

import os
import json

from .thumbnail_service import generate_thumbnails

load_dotenv()

# ─────────────────────────────────────────────────────────────
# OPENROUTER CLIENT
# ─────────────────────────────────────────────────────────────

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)


# ─────────────────────────────────────────────────────────────
# MOCK FALLBACK
# ─────────────────────────────────────────────────────────────

def generate_mock_response(data):

    title = data.get("title", "Viral Content")

    return {

        "hook":
            "Nobody talks about this productivity trick.",

        "alternative_hooks": [

            "You’re secretly ruining your focus every morning.",

            "This tiny habit changed my entire routine.",

            "Top performers avoid this mistake daily."
        ],

        "script":
            """
[HOOK | 0:00 - 0:03]
Nobody talks about this productivity trick.

[SCENE 1 | 0:04 - 0:08]
Stop checking your phone first thing in the morning.

[SCENE 2 | 0:09 - 0:14]
Your focus is strongest during the first 2 hours of the day.

[CTA | 0:20 - 0:25]
Follow for more productivity psychology tips.
            """,

        "hashtags": [

            "#viral",
            "#motivation",
            "#success",
            "#mindset",
            "#growth",
            "#reels",
            "#productivity",
            "#selfimprovement"
        ],

        "caption":
            f"Level up your {title} with these powerful tips 🚀",

        "viral_score": 89,

        "thumbnail_titles": [

            f"5 {title} Hacks",

            f"{title} That Actually Work",

            f"Secrets About {title}",

            f"Improve Your {title} Fast"
        ],

        "thumbnail_images": [],
    }


# ─────────────────────────────────────────────────────────────
# MAIN AI GENERATION
# ─────────────────────────────────────────────────────────────

def generate_reel_content(data):

    USE_MOCK = False

    if USE_MOCK:
        return generate_mock_response(data)

    try:

        prompt = f"""
Topic: {data.get('title')}

Audience: {data.get('audience')}

Tone: {data.get('tone')}

Platform: {data.get('platform')}

Generate viral creator-style content.

REQUIREMENTS:

1. Generate 1 strong viral hook.

2. Generate 3 alternative hooks.

3. Create short-form video script using:
[HOOK]
[SCENE]
[CTA]

4. Generate 8 hashtags.

5. Generate engaging caption.

6. Give viral score (1-100).

7. Generate 4 thumbnail titles.

Return ONLY valid JSON:

{{
    "hook": "",
    "alternative_hooks": [],
    "script": "",
    "hashtags": [],
    "caption": "",
    "viral_score": 0,
    "thumbnail_titles": []
}}
"""

        # ─────────────────────────────────────
        # OPENROUTER REQUEST
        # ─────────────────────────────────────

        response = client.chat.completions.create(

            model="openai/gpt-4o-mini",

            messages=[

                {
                    "role": "system",

                    "content":
                        "You are a viral content strategist."
                },

                {
                    "role": "user",

                    "content": prompt
                }
            ],

            response_format={
                "type": "json_object"
            },

            temperature=0.8,
        )

        text = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )

        return json.loads(text)

    except Exception as e:

        print("[OpenRouter Failed]", e)

        return generate_mock_response(data)


# ─────────────────────────────────────────────────────────────
# FULL PIPELINE
# ─────────────────────────────────────────────────────────────

def generate_reel_content_with_thumbnails(data):

    result = generate_reel_content(data)

    try:

        thumbnail_data = generate_thumbnails(

            client,

            title=data.get(
                'title',
                ''
            ),

            platform=data.get(
                'platform',
                'Instagram Reel'
            ),

            tone=data.get(
                'tone',
                'Motivational'
            ),
        )

        result['thumbnail_images'] = thumbnail_data

    except Exception as e:

        print(f"[Thumbnail Error] {e}")

        result['thumbnail_images'] = []

    return result