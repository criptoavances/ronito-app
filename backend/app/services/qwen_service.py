import httpx
import json
from typing import Optional, List, Dict
from app.config import settings


class QwenService:
    """Service for interacting with Alibaba Qwen API via DashScope"""

    def __init__(self):
        self.api_key = settings.ALIBABA_QWEN_API_KEY
        self.base_url = "https://ws-w8k4zh0uucrx94g5.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1/chat/completions"
        self.model = "qwen-turbo"

    async def chat(self, message: str, user_context: Optional[Dict] = None) -> str:
        """Send a message to Qwen and get a response"""
        if not self.api_key:
            return "Qwen API not configured. Please set ALIBABA_QWEN_API_KEY environment variable."

        # Build system prompt with user context
        system_prompt = self._build_system_prompt(user_context)

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            "temperature": 0.7,
            "top_p": 0.9,
            "max_tokens": 500
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    json=payload,
                    headers=headers
                )
                response.raise_for_status()
                result = response.json()

                if result.get("choices") and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"]
                else:
                    return "No response from Qwen"
        except httpx.RequestError as e:
            return f"Error communicating with Qwen API: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    def _build_system_prompt(self, user_context: Optional[Dict] = None) -> str:
        """Build system prompt with user context"""
        base_prompt = """You are Ronnie, an AI companion for Ronito (Daily Life OS).
You are warm, motivating, and focused on helping the user live intentionally.
You provide brief, actionable advice. Keep responses concise (2-3 sentences usually).
You know about the user's goals and help them stay focused.
"""

        if user_context:
            if user_context.get("big_goal"):
                base_prompt += f"\nThe user's big goal is: {user_context['big_goal']}\n"
            if user_context.get("daily_goals"):
                goals_str = ", ".join(user_context["daily_goals"][:3])
                base_prompt += f"Today's goals: {goals_str}\n"

        return base_prompt

    async def get_motivation(self, user_context: Optional[Dict] = None) -> str:
        """Get a motivational message"""
        motivation_prompt = "Give me a brief (1-2 sentences), warm motivational message to start my day. Reference my big goal if you know it."
        return await self.chat(motivation_prompt, user_context)

    async def suggest_next_action(self, current_time: str, user_context: Optional[Dict] = None) -> str:
        """Suggest what the user should work on next"""
        prompt = f"It's {current_time}. Based on my goals, what should I focus on right now? (1-2 sentences)"
        return await self.chat(prompt, user_context)


qwen_service = QwenService()
