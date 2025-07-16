from flask import Blueprint, render_template, request, jsonify, current_app
from app.chatbot import MedicalChatbot
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

main = Blueprint('main', __name__)

# Initialize chatbot (will be done on first request)
chatbot = None

def get_chatbot():
    """Get or initialize the chatbot instance."""
    global chatbot
    if chatbot is None:
        api_key = current_app.config['GEMINI_API_KEY']
        if not api_key:
            raise ValueError("Gemini API key not found. Please check your .env file.")
        logger.info("Initializing chatbot...")
        chatbot = MedicalChatbot(api_key)
        logger.info("Chatbot initialized successfully")
    return chatbot

@main.route('/')
def index():
    """Home page."""
    try:
        return render_template('index.html')
    except Exception as e:
        logger.error(f"Error loading home page: {str(e)}")
        return render_template('index.html', error="Configuration error. Please check API key.")

@main.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages with comprehensive safety and analysis."""
    try:
        logger.info("Received chat request")
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400
        
        user_message = data['message'].strip()
        logger.info(f"Processing message: {user_message[:50]}...")
        
        # Basic validation
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        if len(user_message) > 1000:
            return jsonify({'error': 'Message too long. Please keep it under 1000 characters.'}), 400
        
        # Get comprehensive chatbot response
        bot = get_chatbot()
        result = bot.get_response(user_message)
        
        logger.info(f"Generated response in {result.get('response_time', 0)}s")
        
        # Handle emergency cases
        if result.get('emergency', False):
            logger.warning(f"Emergency detected: {result.get('reasoning', 'Unknown')}")
            return jsonify({
                'response': result['response'],
                'urgency': result['urgency'],
                'risk_level': result['risk_level'],
                'emergency': True,
                'confidence': result['confidence'],
                'reasoning': result['reasoning'],
                'response_time': result['response_time'],
                'status': 'emergency'
            })
        
        # Standard response with comprehensive information
        response_data = {
            'response': result['response'],
            'urgency': result['urgency'],
            'risk_level': result['risk_level'],
            'emergency': False,
            'confidence': result['confidence'],
            'reasoning': result['reasoning'],
            'recommendations': result['recommendations'],
            'response_time': result['response_time'],
            'disclaimers': result['disclaimers'],
            'status': 'success'
        }
        
        # Include symptom analysis if available
        if 'symptom_analysis' in result and result['symptom_analysis']['possible_conditions']:
            response_data['symptom_analysis'] = result['symptom_analysis']
        
        return jsonify(response_data)
        
    except ValueError as ve:
        logger.error(f"Configuration error: {str(ve)}")
        return jsonify({
            'error': 'Configuration error. Please check your API key setup.',
            'status': 'error'
        }), 500
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Sorry, I encountered an error. Please try again.',
            'status': 'error'
        }), 500

@main.route('/health-tips')
def health_tips():
    """Get health tips."""
    try:
        bot = get_chatbot()
        tips = bot.get_health_tips()
        return jsonify({
            'tips': tips,
            'status': 'success'
        })
    except Exception as e:
        logger.error(f"Error getting health tips: {str(e)}")
        return jsonify({
            'error': 'Unable to load health tips at this time.',
            'status': 'error'
        }), 500
