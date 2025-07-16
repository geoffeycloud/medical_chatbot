from app import create_app
import os

app = create_app()
with app.app_context():
    api_key = app.config.get('GEMINI_API_KEY')
    print(f"API Key found: {bool(api_key)}")
    print(f"API Key valid: {api_key != 'your_gemini_api_key_here' if api_key else False}")
    print(f"API Key starts with: {api_key[:20] if api_key else 'None'}...")
