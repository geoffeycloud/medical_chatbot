"""
Medical Safety and Triage System
Implements emergency detection, risk assessment, and safety guardrails.
"""

import re
from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum

class UrgencyLevel(Enum):
    """Medical urgency levels for triage."""
    EMERGENCY = "emergency"
    URGENT = "urgent"  # See doctor within 24 hours
    ROUTINE = "routine"  # Can be managed with self-care or scheduled appointment
    
class RiskLevel(Enum):
    """Risk levels for medical queries."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

@dataclass
class TriageResult:
    """Result of medical triage assessment."""
    urgency: UrgencyLevel
    risk: RiskLevel
    confidence: float
    reasoning: str
    action_required: str
    emergency_contacts: List[str] = None

class MedicalSafety:
    """Handles medical safety protocols and emergency detection."""
    
    def __init__(self):
        # Emergency keywords that require immediate medical attention
        self.emergency_keywords = [
            # Cardiac emergencies
            'chest pain', 'heart attack', 'cardiac arrest', 'angina',
            'severe chest pressure', 'crushing chest pain',
            
            # Breathing emergencies
            'trouble breathing', 'shortness of breath', 'difficulty breathing',
            'choking', 'wheezing severely', 'gasping for air',
            
            # Neurological emergencies
            'stroke', 'seizure', 'unconscious', 'paralysis', 'facial drooping',
            'severe headache with fever', 'sudden severe headache',
            
            # Mental health emergencies
            'suicidal', 'suicide', 'kill myself', 'end my life', 'want to die',
            'self harm', 'overdose', 'poisoning',
            
            # Severe injuries
            'severe bleeding', 'broken bone', 'deep cut', 'head injury',
            'spinal injury', 'severe burn',
            
            # Other emergencies
            'allergic reaction', 'anaphylaxis', 'severe pain', 'fever over 103',
            'vomiting blood', 'blood in stool', 'severe abdominal pain'
        ]
        
        # High-risk keywords requiring urgent medical attention (24-48 hours)
        self.urgent_keywords = [
            'persistent fever', 'severe headache', 'vision problems',
            'hearing loss', 'severe nausea', 'persistent vomiting',
            'unusual bleeding', 'severe fatigue', 'weight loss',
            'persistent cough', 'difficulty swallowing'
        ]
        
        # Routine keywords for general health concerns
        self.routine_keywords = [
            'mild headache', 'common cold', 'minor cut', 'bruise',
            'muscle soreness', 'mild fever', 'runny nose', 'sore throat'
        ]
        
        # Emergency contact information
        self.emergency_contacts = {
            'us': {
                'emergency': '911',
                'suicide_prevention': '988 (Suicide & Crisis Lifeline)',
                'poison_control': '1-800-222-1222',
                'domestic_violence': '1-800-799-7233'
            }
        }

    def assess_urgency(self, message: str) -> TriageResult:
        """
        Assess the urgency level of a medical query.
        
        Args:
            message (str): User's medical query
            
        Returns:
            TriageResult: Triage assessment with urgency level and recommendations
        """
        message_lower = message.lower()
        
        # Check for emergency keywords
        emergency_matches = [kw for kw in self.emergency_keywords if kw in message_lower]
        if emergency_matches:
            return TriageResult(
                urgency=UrgencyLevel.EMERGENCY,
                risk=RiskLevel.HIGH,
                confidence=0.9,
                reasoning=f"Emergency keywords detected: {', '.join(emergency_matches)}",
                action_required="SEEK IMMEDIATE MEDICAL ATTENTION - Call 911 or go to the nearest emergency room",
                emergency_contacts=["911", "988 (if mental health emergency)"]
            )
        
        # Check for urgent keywords
        urgent_matches = [kw for kw in self.urgent_keywords if kw in message_lower]
        if urgent_matches:
            return TriageResult(
                urgency=UrgencyLevel.URGENT,
                risk=RiskLevel.MEDIUM,
                confidence=0.7,
                reasoning=f"Urgent symptoms detected: {', '.join(urgent_matches)}",
                action_required="Contact your healthcare provider within 24 hours or visit urgent care"
            )
        
        # Check for routine keywords
        routine_matches = [kw for kw in self.routine_keywords if kw in message_lower]
        if routine_matches:
            return TriageResult(
                urgency=UrgencyLevel.ROUTINE,
                risk=RiskLevel.LOW,
                confidence=0.6,
                reasoning=f"Common symptoms detected: {', '.join(routine_matches)}",
                action_required="Monitor symptoms and consider self-care or schedule routine appointment if symptoms persist"
            )
        
        # Default to routine for general health questions
        return TriageResult(
            urgency=UrgencyLevel.ROUTINE,
            risk=RiskLevel.LOW,
            confidence=0.4,
            reasoning="General health inquiry without specific urgent symptoms",
            action_required="General health information provided. Consult healthcare provider if you have specific concerns"
        )

    def get_emergency_response(self, triage_result: TriageResult) -> str:
        """
        Generate appropriate emergency response based on triage result.
        
        Args:
            triage_result (TriageResult): Result from urgency assessment
            
        Returns:
            str: Emergency response message
        """
        if triage_result.urgency == UrgencyLevel.EMERGENCY:
            return f"""
🚨 MEDICAL EMERGENCY DETECTED 🚨

{triage_result.action_required}

Emergency Contacts:
• Call 911 immediately for medical emergencies
• Call 988 for mental health crises (Suicide & Crisis Lifeline)
• Call 1-800-222-1222 for poison emergencies

IMPORTANT: This AI cannot replace emergency medical services. If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.

Reasoning: {triage_result.reasoning}
            """
        elif triage_result.urgency == UrgencyLevel.URGENT:
            return f"""
⚠️ URGENT MEDICAL ATTENTION NEEDED ⚠️

{triage_result.action_required}

Your symptoms may require prompt medical evaluation. Please:
1. Contact your healthcare provider today
2. Visit an urgent care center if your doctor is unavailable
3. Call 911 if symptoms worsen significantly

Reasoning: {triage_result.reasoning}
            """
        else:
            return None  # No emergency response needed

class SymptomChecker:
    """Provides symptom-to-condition matching with confidence scores."""
    
    def __init__(self):
        # Symptom patterns and their possible conditions
        self.symptom_patterns = {
            'flu_like': {
                'symptoms': ['fever', 'headache', 'body aches', 'fatigue', 'chills'],
                'conditions': [
                    {'name': 'Influenza (Flu)', 'confidence': 0.8, 'reasoning': 'Classic flu symptoms include fever, headache, and body aches'},
                    {'name': 'Common Cold', 'confidence': 0.6, 'reasoning': 'Similar symptoms but usually milder than flu'},
                    {'name': 'COVID-19', 'confidence': 0.7, 'reasoning': 'Overlapping symptoms with flu, testing recommended'}
                ]
            },
            'respiratory': {
                'symptoms': ['cough', 'runny nose', 'sore throat', 'congestion'],
                'conditions': [
                    {'name': 'Upper Respiratory Infection', 'confidence': 0.8, 'reasoning': 'Common cold symptoms affecting upper respiratory tract'},
                    {'name': 'Allergies', 'confidence': 0.6, 'reasoning': 'Seasonal allergies can cause similar symptoms'},
                    {'name': 'Sinusitis', 'confidence': 0.7, 'reasoning': 'Sinus infection often presents with congestion and headache'}
                ]
            },
            'digestive': {
                'symptoms': ['nausea', 'vomiting', 'diarrhea', 'stomach pain'],
                'conditions': [
                    {'name': 'Gastroenteritis', 'confidence': 0.8, 'reasoning': 'Stomach flu commonly causes nausea, vomiting, and diarrhea'},
                    {'name': 'Food Poisoning', 'confidence': 0.7, 'reasoning': 'Recent food consumption may be related to symptoms'},
                    {'name': 'Viral Infection', 'confidence': 0.6, 'reasoning': 'Many viruses can cause digestive symptoms'}
                ]
            }
        }

    def analyze_symptoms(self, message: str) -> Dict:
        """
        Analyze symptoms and provide possible conditions with explanations.
        
        Args:
            message (str): User's symptom description
            
        Returns:
            Dict: Analysis results with possible conditions and reasoning
        """
        message_lower = message.lower()
        matched_conditions = []
        
        for pattern_name, pattern_data in self.symptom_patterns.items():
            symptom_matches = sum(1 for symptom in pattern_data['symptoms'] if symptom in message_lower)
            
            if symptom_matches >= 2:  # At least 2 symptoms match
                match_ratio = symptom_matches / len(pattern_data['symptoms'])
                
                for condition in pattern_data['conditions']:
                    adjusted_confidence = condition['confidence'] * match_ratio
                    matched_conditions.append({
                        'condition': condition['name'],
                        'confidence': round(adjusted_confidence, 2),
                        'reasoning': condition['reasoning'],
                        'matched_symptoms': symptom_matches,
                        'total_symptoms': len(pattern_data['symptoms'])
                    })
        
        # Sort by confidence
        matched_conditions.sort(key=lambda x: x['confidence'], reverse=True)
        
        return {
            'possible_conditions': matched_conditions[:3],  # Top 3 matches
            'total_matches': len(matched_conditions),
            'analysis_confidence': 'high' if matched_conditions and matched_conditions[0]['confidence'] > 0.6 else 'moderate'
        }

    def generate_explanation(self, analysis: Dict) -> str:
        """
        Generate a clear explanation of the symptom analysis.
        
        Args:
            analysis (Dict): Results from analyze_symptoms
            
        Returns:
            str: Human-readable explanation
        """
        if not analysis['possible_conditions']:
            return "Based on the symptoms described, I cannot identify a specific pattern. Please provide more details about your symptoms."
        
        explanation = "🔍 **Symptom Analysis:**\n\n"
        
        for i, condition in enumerate(analysis['possible_conditions'], 1):
            confidence_level = "High" if condition['confidence'] > 0.7 else "Moderate" if condition['confidence'] > 0.5 else "Low"
            
            explanation += f"**{i}. {condition['condition']}** (Confidence: {confidence_level} - {condition['confidence']})\n"
            explanation += f"   • Reasoning: {condition['reasoning']}\n"
            explanation += f"   • Symptom match: {condition['matched_symptoms']}/{condition['total_symptoms']} symptoms\n\n"
        
        explanation += "⚠️ **Important:** This analysis is for informational purposes only and should not replace professional medical diagnosis. Please consult with a healthcare provider for proper evaluation and treatment.\n"
        
        return explanation
