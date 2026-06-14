# calendar_intelligence.py - Real Google Calendar events integration
import os
import datetime
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from bedrock_client import classify_calendar_event

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

def get_credentials():
    creds = None
    # The file token.json stores the user's access and refresh tokens
    current_dir = os.path.dirname(os.path.abspath(__file__))
    token_path = os.path.join(current_dir, "token.json")
    credentials_path = os.path.join(current_dir, "credentials.json")

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(credentials_path):
                print("Missing credentials.json. Please follow setup instructions.")
                return None
            flow = InstalledAppFlow.from_client_secrets_file(
                credentials_path, SCOPES
            )
            # This requires a local browser
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(token_path, "w") as token:
            token.write(creds.to_json())
            
    return creds

def get_calendar_events() -> list:
    """
    Returns upcoming calendar events directly from Google Calendar.
    """
    creds = get_credentials()
    if not creds:
        print("[CALENDAR] No credentials found. Returning empty events.")
        return []

    try:
        service = build("calendar", "v3", credentials=creds)

        # Call the Calendar API
        now = datetime.datetime.utcnow().isoformat() + "Z"  # 'Z' indicates UTC time
        print("[CALENDAR] Fetching upcoming events...")
        events_result = (
            service.events()
            .list(
                calendarId="primary",
                timeMin=now,
                maxResults=10,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        raw_events = events_result.get("items", [])

        formatted_events = []
        for event in raw_events:
            start = event["start"].get("dateTime", event["start"].get("date"))
            summary = event.get("summary", "Busy")
            
            # Format time for the context engine
            try:
                # Convert ISO string to a more readable format
                # Example: "2026-06-14T09:00:00+05:30"
                if "T" in start:
                    dt = datetime.datetime.fromisoformat(start)
                    time_str = dt.strftime("%A, %b %d at %I:%M %p")
                else:
                    dt = datetime.datetime.strptime(start, "%Y-%m-%d")
                    time_str = dt.strftime("%A, %b %d (All Day)")
            except Exception:
                time_str = start
                
            # Classify intent using Bedrock
            print(f"[CALENDAR] Classifying event: {summary}")
            classification = classify_calendar_event(summary, time_str)
            intent = classification.get("intent", "ROUTINE")
            
            formatted_events.append({
                "title": summary,
                "time": time_str,
                "intent": intent
            })

        return formatted_events
    except Exception as e:
        print(f"[CALENDAR] API error: {e}")
        return []

def get_most_urgent_event() -> dict:
    """Get the most time-sensitive upcoming event."""
    events = get_calendar_events()
    if events:
        return events[0]
    return {"title": "No upcoming events", "time": "-", "intent": "ROUTINE"}
