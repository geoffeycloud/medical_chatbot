from flask import Flask
from flask_cors import CORS
from config import config
import os

def create_app(config_name=None):
    """Application factory pattern."""
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Enable CORS
    CORS(app)
    
    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)
    
    return app
