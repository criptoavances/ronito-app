"""
Email marketing service - handles onboarding sequences and campaigns
"""
from datetime import datetime, timedelta
from app.db import get_supabase
from app.services.email_service import send_verification_email, send_transactional_email
from typing import Optional

class EmailMarketingSequence:
    """Manages automated email sequences"""

    # Email sequence for new signups
    WELCOME_SEQUENCE = [
        {
            "day": 0,
            "subject": "Welcome to RONITO - Your AI Life Manager",
            "template": "welcome_email",
            "description": "Welcome email + verification link"
        },
        {
            "day": 1,
            "subject": "Set Your Big Goal - The WHY That Drives Everything",
            "template": "big_goal_reminder",
            "description": "Reminder to complete onboarding, focus on big goal"
        },
        {
            "day": 3,
            "subject": "Your First Week Check-in: How's It Going?",
            "template": "week_checkin",
            "description": "Check progress, offer support"
        },
        {
            "day": 7,
            "subject": "7 Days In: You're Building a Life OS",
            "template": "week_one_recap",
            "description": "Week recap, tips for sustainable use"
        }
    ]

    @staticmethod
    async def enroll_user_in_sequence(user_id: str, email: str):
        """
        Enroll new user in welcome email sequence

        Args:
            user_id: User ID
            email: User email address
        """
        try:
            supabase = get_supabase()

            # Create email_sequences table record
            enrollment_data = {
                "user_id": user_id,
                "email": email,
                "sequence_name": "welcome",
                "enrolled_at": datetime.utcnow().isoformat(),
                "status": "active",
                "current_email_index": 0,
                "last_sent_at": None
            }

            # Store enrollment (requires email_sequences table)
            # supabase.table("email_sequences").insert(enrollment_data).execute()

            # Send day 0 email (verification)
            # This will be done in signup flow

            return True
        except Exception as e:
            print(f"Error enrolling user in email sequence: {e}")
            return False

    @staticmethod
    async def send_sequence_email(user_id: str, email: str, sequence_index: int = 0):
        """
        Send next email in sequence

        Args:
            user_id: User ID
            email: User email
            sequence_index: Which email in sequence to send
        """
        if sequence_index >= len(EmailMarketingSequence.WELCOME_SEQUENCE):
            return False

        email_config = EmailMarketingSequence.WELCOME_SEQUENCE[sequence_index]

        # Templates would be defined in Systeme.io
        # This just logs which email should be sent
        print(f"Should send day {email_config['day']} email to {email}")
        print(f"Template: {email_config['template']}")
        print(f"Subject: {email_config['subject']}")

        return True

async def create_email_sequence_tables(supabase):
    """
    Create required tables for email marketing (run once)
    """
    sql = """
    -- Email sequences tracking
    CREATE TABLE IF NOT EXISTS public.email_sequences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        email TEXT NOT NULL,
        sequence_name TEXT NOT NULL,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'active', -- active, paused, completed
        current_email_index INTEGER DEFAULT 0,
        last_sent_at TIMESTAMP NULL,
        completed_at TIMESTAMP NULL
    );

    CREATE INDEX IF NOT EXISTS idx_email_sequences_user ON public.email_sequences(user_id);

    -- Email engagement tracking
    CREATE TABLE IF NOT EXISTS public.email_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        email TEXT NOT NULL,
        event_type TEXT NOT NULL, -- sent, opened, clicked, bounced
        email_subject TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_email_events_user ON public.email_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_email_events_type ON public.email_events(event_type);
    """

    # Execute SQL
    pass
