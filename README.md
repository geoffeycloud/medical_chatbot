# Medical Chatbot

A sophisticated medical AI chatbot built with Flask and Google's Gemini AI that provides general health information and wellness guidance.

## ⚠️ Important Disclaimer

This chatbot provides general health information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

## 🌟 Features

- **AI-Powered Responses**: Uses Google's Gemini AI for intelligent health-related conversations
- **Modern Web Interface**: Responsive design with real-time chat functionality
- **Health Tips**: Curated daily health tips and wellness advice
- **Medical Safety**: Built-in disclaimers and responsible AI responses
- **Professional UI**: Clean, medical-themed interface with accessibility features

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **AI Engine**: Google Gemini API
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Icons**: Font Awesome
- **Development**: Virtual Environment, dotenv

## 📋 Prerequisites

- Python 3.8 or higher
- Google Gemini API key ([Get yours here](https://makersuite.google.com/app/apikey))
- Modern web browser

## 🚀 Quick GitHub Setup

1. **Your project is already secure** - API keys are protected via environment variables
2. **See `GITHUB_SETUP.md`** for detailed instructions
3. **Ready to push!** - Just get your API key and follow the setup steps below

## 🚀 Installation & Setup

### 1. Clone or Create Project Structure
```bash
# If cloning from repository
git clone <repository-url>
cd medical_chatbot

# Or create manually as done in this setup
```

### 2. Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
# Copy environment template
copy .env.example .env

# Edit .env file and add your Gemini API key:
GEMINI_API_KEY=your_actual_gemini_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### 5. Run the Application
```bash
python run.py
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
medical_chatbot/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes.py            # Application routes
│   ├── chatbot.py           # Gemini AI integration
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # Custom styles
│   │   └── js/
│   │       └── chat.js      # Frontend JavaScript
│   └── templates/
│       └── index.html       # Main chat interface
├── config/
│   └── __init__.py          # Configuration settings
├── venv/                    # Virtual environment
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── requirements.txt         # Python dependencies
├── run.py                  # Application entry point
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Required: Your Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
```

### Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key in Google AI Studio"
4. Review and accept the terms of service
5. Create an API key in a new or existing project
6. Copy the generated API key to your `.env` file

## 💻 Usage

1. **Start the Application**: Run `python run.py`
2. **Open Browser**: Navigate to `http://localhost:5000`
3. **Start Chatting**: Type health-related questions in the chat interface
4. **View Health Tips**: Check the sidebar for daily health tips
5. **Clear Chat**: Use the "Clear Chat" button to reset conversation

### Example Questions You Can Ask

- "What are the symptoms of common cold?"
- "How can I improve my sleep quality?"
- "What foods are good for heart health?"
- "How much water should I drink daily?"
- "What are some stress management techniques?"

## 🔒 Safety Features

- **Medical Disclaimers**: Automatic reminders about professional medical care
- **Responsible AI**: Programmed to avoid providing specific medical diagnoses
- **Emergency Guidance**: Encourages users to seek emergency care when appropriate
- **General Information Focus**: Emphasizes wellness and general health information

## 🔐 Security Notice

**Your API key is fully protected!** This project uses environment variables and `.gitignore` to keep your API key secure when pushing to GitHub.

## 🚀 Deployment

### Development
```bash
python run.py
```

### Production (using Gunicorn)
```bash
gunicorn -w 4 -b 0.0.0.0:8000 run:app
```

### Environment-Specific Deployment
- Set `FLASK_ENV=production` for production deployment
- Use a proper WSGI server like Gunicorn or uWSGI
- Consider containerization with Docker
- Set up proper logging and monitoring

## 🧪 Testing

The application includes error handling and validation:
- Input validation for chat messages
- API error handling
- Loading states and user feedback
- Responsive design testing

## 🛡️ Security Considerations

- API keys are stored in environment variables
- Input validation and sanitization
- CORS configuration for cross-origin requests
- No sensitive medical data storage
- Rate limiting consideration for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational and demonstration purposes. Please ensure compliance with medical software regulations in your jurisdiction.

## 🆘 Support

For technical issues:
1. Check the console for error messages
2. Verify your Gemini API key is correct
3. Ensure all dependencies are installed
4. Check network connectivity

## 📚 Additional Resources

- [Google Gemini AI Documentation](https://ai.google.dev/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Medical AI Ethics Guidelines](https://www.who.int/publications/i/item/ethics-and-governance-of-artificial-intelligence-for-health)

---

**Remember**: This is a demonstration application. Always consult healthcare professionals for medical advice, diagnosis, or treatment.
