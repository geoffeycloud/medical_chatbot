# Medical Chatbot - Quick Start Guide

## 🚀 Quick Setup Instructions

You have successfully created a medical chatbot web application! Follow these steps to get it running:

### Step 1: Configure Your API Key

1. **Edit the .env file**:
   ```
   GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```

2. **Or run the setup script**:
   ```bash
   python setup.py
   ```

### Step 2: Start the Application

**Option A: Use the startup script (Windows)**:
```bash
start.bat
```

**Option B: Manual start**:
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Start the application
python run.py
```

### Step 3: Open Your Browser

Navigate to: **http://localhost:5000**

## 🏥 Features

✅ **AI-Powered Medical Assistant** - Uses Google Gemini AI  
✅ **Emergency Detection** - Recognizes emergency situations  
✅ **Health Tips** - Daily wellness recommendations  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Session Management** - Tracks conversation history  
✅ **Safety Features** - Medical disclaimers and responsible AI  

## 🔧 Project Structure

```
medical_chatbot/
├── app/                    # Main application
│   ├── chatbot.py         # AI integration
│   ├── routes.py          # Web routes
│   ├── utils.py           # Utility functions
│   ├── static/            # CSS & JavaScript
│   └── templates/         # HTML templates
├── config/                # Configuration
├── venv/                  # Virtual environment
├── .env                   # Environment variables
├── requirements.txt       # Dependencies
├── run.py                # Application entry point
├── setup.py              # Setup script
└── start.bat             # Windows startup script
```

## 🛡️ Important Safety Notes

- **Not for medical emergencies** - Always call emergency services
- **General information only** - Not a substitute for professional medical advice
- **Responsible AI** - Built with medical safety guidelines
- **Privacy focused** - No sensitive data storage

## 🧪 Testing the Application

1. **Health Check**: Visit http://localhost:5000/health
2. **Chat Interface**: Ask questions like:
   - "What are symptoms of common cold?"
   - "How can I improve my sleep?"
   - "What foods are good for heart health?"

## 🔍 Troubleshooting

**Problem**: "Configuration error. Please check API key."
**Solution**: Make sure your Gemini API key is set in the .env file

**Problem**: ImportError or ModuleNotFoundError
**Solution**: Activate virtual environment and install requirements:
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

**Problem**: Port already in use
**Solution**: The app runs on port 5000. Change port in run.py if needed.

## 🌟 Next Steps

1. **Customize the UI** - Edit templates and CSS
2. **Add more features** - Extend the chatbot capabilities
3. **Deploy to cloud** - Use platforms like Heroku, AWS, or Azure
4. **Add database** - Store conversation history
5. **Implement user accounts** - Add authentication

## 📚 API Documentation

### Endpoints:
- `GET /` - Main chat interface
- `POST /chat` - Send message to chatbot
- `GET /health` - Health check
- `GET /tips` - Get health tips

## 🤝 Support

If you need help:
1. Check the README.md for detailed documentation
2. Run `python setup.py` for configuration help
3. Check console logs for error messages
4. Ensure your Gemini API key is valid

---

**🎉 Congratulations! Your medical chatbot is ready to use!**

Remember to always encourage users to consult healthcare professionals for medical advice.
