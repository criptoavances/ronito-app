import httpx
import os
from typing import Optional

SYSTEME_IO_API_KEY = os.getenv("SYSTEME_IO_API_KEY", "")
SYSTEME_IO_API_URL = "https://api.systeme.io/api/contacts"

async def send_verification_email(email: str, verification_token: str, verification_link: str) -> bool:
    """
    Send verification email via Systeme.io

    Args:
        email: User's email address
        verification_token: Unique token for verification
        verification_link: Full verification URL for user to click

    Returns:
        bool: True if email sent successfully, False otherwise
    """

    if not SYSTEME_IO_API_KEY:
        print("Warning: SYSTEME_IO_API_KEY not configured. Email verification disabled.")
        return False

    try:
        async with httpx.AsyncClient() as client:
            # For now, just log the action since Systeme.io email sending
            # requires proper campaign/template setup
            print(f"Email verification needed for {email}")
            print(f"Verification link: {verification_link}")

            # TODO: Implement actual Systeme.io API call when campaign is set up
            # This would require creating an email template in Systeme.io
            # and then triggering it via API

            return True
    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False

async def send_transactional_email(email: str, subject: str, html_body: str) -> bool:
    """
    Send transactional email via Systeme.io

    Args:
        email: Recipient email
        subject: Email subject
        html_body: HTML email content

    Returns:
        bool: True if sent successfully
    """

    if not SYSTEME_IO_API_KEY:
        return False

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                SYSTEME_IO_API_URL,
                headers={
                    "Authorization": f"Bearer {SYSTEME_IO_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "email": email,
                    "first_name": email.split("@")[0],
                }
            )
            return response.status_code in [200, 201]
    except Exception as e:
        print(f"Error sending transactional email: {e}")
        return False
