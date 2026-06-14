# calendar_intelligence.py - Calendar events (mock for now, structured for real integration)
from datetime import datetime, timedelta


def get_calendar_events() -> list:
    """
    Returns upcoming calendar events.
    Replace this with Google Calendar API integration later.
    For now returns realistic demo events based on current time.
    """
    now = datetime.now()
    today = now.strftime("%A")
    
    # Realistic events that change based on day/time
    events = []
    
    # Evening events
    if now.hour >= 16:
        events.append({
            "title": "Friends coming over",
            "time": "Tonight 8:00 PM",
            "intent": "HOST_GUESTS"
        })
    
    # Next day travel
    tomorrow = (now + timedelta(days=1)).strftime("%A")
    events.append({
        "title": f"Flight to Bangalore",
        "time": f"Tomorrow ({tomorrow}) 9:00 AM",
        "intent": "TRAVEL"
    })
    
    # Weekend party
    if now.weekday() >= 4:  # Friday onwards
        events.append({
            "title": "Weekend house party",
            "time": "Saturday 7:00 PM",
            "intent": "HOST_GUESTS"
        })

    return events


def get_most_urgent_event() -> dict:
    """Get the most time-sensitive upcoming event."""
    events = get_calendar_events()
    if events:
        return events[0]
    return {"title": "No upcoming events", "time": "-", "intent": "ROUTINE"}
