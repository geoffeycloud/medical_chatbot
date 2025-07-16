import google.generativeai as genai
from typing import Dict, List, Optional
import logging
import time
from .safety import MedicalSafety, SymptomChecker, UrgencyLevel

class MedicalChatbot:
    """Medical chatbot using Google's Gemini AI."""
    
    def __init__(self, api_key: str):
        """Initialize the chatbot with Gemini API key and safety systems."""
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Initialize safety and triage systems
        self.safety_system = MedicalSafety()
        self.symptom_checker = SymptomChecker()
        
        # Enhanced medical context prompt with explainable AI
        self.system_prompt = """
        You are an advanced medical AI assistant designed to provide helpful, safe, and explainable health information. 

        CORE PRINCIPLES:
        1. SAFETY FIRST: Always prioritize patient safety over providing information
        2. EXPLAINABLE AI: Always explain your reasoning and thought process
        3. EVIDENCE-BASED: Base responses on established medical knowledge
        4. HUMBLE: Acknowledge limitations and uncertainties
        
        RESPONSE STRUCTURE:
        1. Assessment: Briefly summarize what the user is asking
        2. Analysis: Explain your reasoning process step-by-step
        3. Information: Provide relevant health information
        4. Recommendations: Suggest appropriate next steps
        5. Disclaimers: Include necessary medical disclaimers
        
        CRITICAL SAFETY RULES:
        - NEVER provide specific medical diagnoses
        - NEVER recommend specific medications or dosages
        - ALWAYS recommend emergency care for serious symptoms
        - ALWAYS include appropriate disclaimers
        - EXPLAIN why you suggest certain conditions or recommendations
        
        EXPLANATION FORMAT:
        When discussing possible conditions, use this format:
        "Based on your symptoms of [symptoms], this could suggest [condition] because [medical reasoning]. However, [uncertainty factors] should also be considered."
        
        Keep responses helpful, empathetic, medically responsible, and always explain your reasoning.
        """
        
    def get_response(self, user_message: str) -> Dict[str, any]:
        """
        Get comprehensive response from the medical chatbot with safety checks.
        
        Args:
            user_message (str): User's medical query
            
        Returns:
            Dict: Comprehensive response with safety information, analysis, and recommendations
        """
        start_time = time.time()
        
        try:
            # Step 1: Safety and triage assessment
            triage_result = self.safety_system.assess_urgency(user_message)
            
            # Step 2: Handle emergencies immediately
            if triage_result.urgency == UrgencyLevel.EMERGENCY:
                emergency_response = self.safety_system.get_emergency_response(triage_result)
                return {
                    'response': emergency_response,
                    'urgency': triage_result.urgency.value,
                    'risk_level': triage_result.risk.value,
                    'confidence': triage_result.confidence,
                    'reasoning': triage_result.reasoning,
                    'emergency': True,
                    'response_time': round(time.time() - start_time, 2),
                    'safety_override': True
                }
            
            # Step 3: Symptom analysis for non-emergency cases
            symptom_analysis = self.symptom_checker.analyze_symptoms(user_message)
            symptom_explanation = self.symptom_checker.generate_explanation(symptom_analysis)
            
            # Step 4: Generate AI response with enhanced context
            enhanced_prompt = f"""
            {self.system_prompt}
            
            TRIAGE INFORMATION:
            - Urgency Level: {triage_result.urgency.value}
            - Risk Level: {triage_result.risk.value}
            - Recommended Action: {triage_result.action_required}
            
            SYMPTOM ANALYSIS:
            {symptom_explanation if symptom_analysis['possible_conditions'] else 'No specific symptom patterns identified.'}
            
            USER QUERY: {user_message}
            
            Please provide a comprehensive response following the response structure outlined above.
            """
            
            # Generate content with enhanced prompt
            response = self.model.generate_content(enhanced_prompt)
            ai_response = response.text
            
            # Step 5: Add urgent care warning if needed
            if triage_result.urgency == UrgencyLevel.URGENT:
                urgent_warning = self.safety_system.get_emergency_response(triage_result)
                ai_response = urgent_warning + "\n\n" + ai_response
            
            # Step 6: Compile comprehensive response
            response_time = round(time.time() - start_time, 2)
            
            return {
                'response': ai_response,
                'urgency': triage_result.urgency.value,
                'risk_level': triage_result.risk.value,
                'confidence': triage_result.confidence,
                'reasoning': triage_result.reasoning,
                'symptom_analysis': symptom_analysis,
                'response_time': response_time,
                'emergency': False,
                'disclaimers': self._get_disclaimers(triage_result.urgency),
                'recommendations': triage_result.action_required
            }
            
        except Exception as e:
            logging.error(f"Error getting chatbot response: {str(e)}")
            error_time = round(time.time() - start_time, 2)
            return {
                'response': "I apologize, but I'm experiencing technical difficulties. Please try again later or consult with a healthcare professional for your medical concerns.",
                'urgency': 'unknown',
                'risk_level': 'unknown',
                'confidence': 0.0,
                'reasoning': f"System error: {str(e)}",
                'emergency': False,
                'error': True,
                'response_time': error_time
            }
    
    def _get_disclaimers(self, urgency: UrgencyLevel) -> List[str]:
        """Get appropriate disclaimers based on urgency level."""
        base_disclaimers = [
            "This AI assistant provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment.",
            "Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.",
            "Never disregard professional medical advice or delay seeking it because of something you have read here."
        ]
        
        if urgency == UrgencyLevel.URGENT:
            base_disclaimers.insert(0, "⚠️ Your symptoms may require prompt medical attention. Please contact your healthcare provider.")
        
        return base_disclaimers
    
    def get_health_tips(self) -> List[str]:
        """Get general health tips."""
        tips = [
            "Stay hydrated by drinking at least 8 glasses of water daily",
            "Maintain a balanced diet with plenty of fruits and vegetables",
            "Exercise regularly - aim for at least 30 minutes of activity daily",
            "Get 7-9 hours of quality sleep each night",
            "Practice stress management techniques like meditation or deep breathing",
            "Schedule regular check-ups with your healthcare provider",
            "Wash your hands frequently to prevent infections",
            "Limit processed foods and added sugars in your diet"
        ]
        return tips
