from app.chatbot import MedicalChatbot
from config import config
import os

# Load config
app_config = config['development']()

try:
    # Test chatbot
    api_key = app_config.GEMINI_API_KEY
    print(f"Testing with API key: {api_key[:20]}...")
    
    bot = MedicalChatbot(api_key)
    response = bot.get_response("Hello, how are you?")
    print("✅ Chatbot test successful!")
    print(f"Response: {response[:100]}...")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
