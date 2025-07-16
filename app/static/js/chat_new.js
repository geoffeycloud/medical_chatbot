// Enhanced Medical Chatbot JavaScript with Safety Features

class AdvancedMedicalChatbot {
    constructor() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.clearButton = document.getElementById('clearChat');
        this.showFeaturesButton = document.getElementById('showFeatures');
        this.loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        this.featuresModal = new bootstrap.Modal(document.getElementById('featuresModal'));
        this.emergencyBanner = document.getElementById('emergencyBanner');
        
        // Performance tracking elements
        this.responseTimeElement = document.getElementById('responseTime');
        this.riskLevelElement = document.getElementById('riskLevel');
        this.urgencyLevelElement = document.getElementById('urgencyLevel');
        this.charCountElement = document.getElementById('charCount');
        
        this.initializeEventListeners();
        this.scrollToBottom();
        this.updateCharCount();
    }
    
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Clear chat button
        this.clearButton.addEventListener('click', () => this.clearChat());
        
        // Show features modal
        if (this.showFeaturesButton) {
            this.showFeaturesButton.addEventListener('click', () => this.featuresModal.show());
        }
        
        // Input character count and validation
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        
        // Auto-focus input
        this.messageInput.focus();
    }
    
    handleInputChange() {
        const message = this.messageInput.value.trim();
        this.sendButton.disabled = message.length === 0;
        this.updateCharCount();
    }
    
    updateCharCount() {
        const currentLength = this.messageInput.value.length;
        const maxLength = parseInt(this.messageInput.getAttribute('maxlength'));
        
        if (this.charCountElement) {
            this.charCountElement.textContent = currentLength;
            
            // Color coding for character count
            if (currentLength > maxLength * 0.9) {
                this.charCountElement.style.color = '#dc3545';
            } else if (currentLength > maxLength * 0.7) {
                this.charCountElement.style.color = '#ffc107';
            } else {
                this.charCountElement.style.color = '#2c5aa0';
            }
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) {
            this.showError('Please enter a message');
            return;
        }
        
        if (message.length > 1000) {
            this.showError('Message too long. Please keep it under 1000 characters.');
            return;
        }
        
        // Disable input and show loading
        this.setInputState(false);
        this.showLoadingIndicator();
        
        // Add user message to chat
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.updateCharCount();
        
        const startTime = Date.now();
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
            
            this.hideLoadingIndicator();
            
            if (response.ok) {
                this.handleSuccessResponse(data, responseTime);
            } else {
                this.handleErrorResponse(data);
            }
            
        } catch (error) {
            console.error('Error:', error);
            this.hideLoadingIndicator();
            this.showError('Network error. Please check your connection and try again.');
        } finally {
            this.setInputState(true);
        }
    }
    
    handleSuccessResponse(data, actualResponseTime) {
        // Update performance metrics
        this.updatePerformanceMetrics(data, actualResponseTime);
        
        // Handle emergency responses
        if (data.emergency) {
            this.handleEmergencyResponse(data);
            return;
        }
        
        // Handle normal responses with enhanced display
        this.addEnhancedBotMessage(data);
    }
    
    handleEmergencyResponse(data) {
        // Show emergency banner
        this.showEmergencyBanner(data.response);
        
        // Add emergency message to chat
        this.addMessage('bot', data.response, 'emergency', data);
        
        // Auto-scroll and flash attention
        this.scrollToBottom();
        this.flashEmergencyAttention();
    }
    
    addEnhancedBotMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message bot-message ${data.urgency === 'urgent' ? 'urgent-message' : ''}`;
        
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-header">
                    <strong>Medical AI Assistant</strong>
                    <div class="status-badges">
                        <span class="confidence-badge badge bg-info">
                            <i class="fas fa-brain"></i> ${Math.round(data.confidence * 100)}% Confidence
                        </span>
                        <span class="urgency-badge badge urgency-${data.urgency}">
                            <i class="fas fa-triage"></i> ${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}
                        </span>
                        <span class="risk-badge badge risk-${data.risk_level}">
                            <i class="fas fa-shield-alt"></i> ${data.risk_level.charAt(0).toUpperCase() + data.risk_level.slice(1)} Risk
                        </span>
                    </div>
                </div>
                <div class="message-text">
                    ${this.formatMessageText(data.response)}
                </div>
                ${this.renderSymptomAnalysis(data.symptom_analysis)}
                ${this.renderRecommendations(data.recommendations)}
                ${this.renderDisclaimers(data.disclaimers)}
            </div>
            <div class="message-time">
                <span class="time">${currentTime}</span>
                <span class="response-time">
                    <i class="fas fa-clock"></i> ${data.response_time || 'N/A'}s
                </span>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    renderSymptomAnalysis(analysis) {
        if (!analysis || !analysis.possible_conditions || analysis.possible_conditions.length === 0) {
            return '';
        }
        
        let html = '<div class="analysis-section"><h6><i class="fas fa-search"></i> Symptom Analysis</h6>';
        
        analysis.possible_conditions.forEach((condition, index) => {
            const confidencePercent = Math.round(condition.confidence * 100);
            html += `
                <div class="condition-match">
                    <div class="condition-header">
                        <strong>${condition.condition}</strong>
                        <span class="confidence-score">
                            ${confidencePercent}%
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${confidencePercent}%"></div>
                            </div>
                        </span>
                    </div>
                    <div class="condition-reasoning">
                        <i class="fas fa-lightbulb text-warning"></i> ${condition.reasoning}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    renderRecommendations(recommendations) {
        if (!recommendations) return '';
        
        return `
            <div class="analysis-section">
                <h6><i class="fas fa-tasks"></i> Recommended Action</h6>
                <div class="recommendation-text">
                    <i class="fas fa-arrow-right text-primary"></i> ${recommendations}
                </div>
            </div>
        `;
    }
    
    renderDisclaimers(disclaimers) {
        if (!disclaimers || disclaimers.length === 0) return '';
        
        let html = '<div class="disclaimers-section mt-3"><small class="text-muted">';
        disclaimers.forEach(disclaimer => {
            html += `<div class="disclaimer-item"><i class="fas fa-info-circle"></i> ${disclaimer}</div>`;
        });
        html += '</small></div>';
        
        return html;
    }
    
    updatePerformanceMetrics(data, actualResponseTime) {
        // Update response time
        if (this.responseTimeElement) {
            this.responseTimeElement.textContent = `${actualResponseTime}s`;
        }
        
        // Update risk level
        if (this.riskLevelElement) {
            this.riskLevelElement.textContent = data.risk_level.charAt(0).toUpperCase() + data.risk_level.slice(1);
            this.riskLevelElement.className = `metric-value badge risk-${data.risk_level}`;
        }
        
        // Update urgency level
        if (this.urgencyLevelElement) {
            this.urgencyLevelElement.textContent = data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1);
            this.urgencyLevelElement.className = `metric-value badge urgency-${data.urgency}`;
        }
    }
    
    showEmergencyBanner(message) {
        if (this.emergencyBanner) {
            document.getElementById('emergencyMessage').textContent = message;
            this.emergencyBanner.style.display = 'block';
            this.emergencyBanner.classList.add('show');
            
            // Auto-hide after 30 seconds
            setTimeout(() => {
                this.hideEmergencyBanner();
            }, 30000);
        }
    }
    
    hideEmergencyBanner() {
        if (this.emergencyBanner) {
            this.emergencyBanner.classList.remove('show');
            setTimeout(() => {
                this.emergencyBanner.style.display = 'none';
            }, 150);
        }
    }
    
    flashEmergencyAttention() {
        // Flash the page background briefly to draw attention
        document.body.style.background = 'rgba(220, 53, 69, 0.1)';
        setTimeout(() => {
            document.body.style.background = '';
        }, 1000);
    }
    
    formatMessageText(text) {
        // Convert newlines to HTML breaks and preserve formatting
        return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
    
    addMessage(sender, message, type = 'normal', data = null) {
        const messageDiv = document.createElement('div');
        const isUser = sender === 'user';
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        if (type === 'emergency') {
            messageDiv.className += ' emergency-message';
        }
        
        const messageContent = isUser ? message : this.formatMessageText(message);
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <strong>${isUser ? 'You' : 'Medical AI'}:</strong> ${messageContent}
            </div>
            <div class="message-time">
                <span class="time">${currentTime}</span>
                ${data && data.response_time ? `<span class="response-time"><i class="fas fa-clock"></i> ${data.response_time}s</span>` : ''}
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
        }
    }
    
    showLoadingIndicator() {
        this.loadingModal.show();
    }
    
    hideLoadingIndicator() {
        this.loadingModal.hide();
    }
    
    handleErrorResponse(data) {
        this.showError(data.error || 'An error occurred');
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show mt-2';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
    }
    
    clearChat() {
        // Keep only the initial bot message
        const initialMessage = this.chatMessages.querySelector('.message.bot-message');
        this.chatMessages.innerHTML = '';
        if (initialMessage) {
            this.chatMessages.appendChild(initialMessage.cloneNode(true));
        }
        
        // Reset performance metrics
        if (this.responseTimeElement) this.responseTimeElement.textContent = '--';
        if (this.riskLevelElement) {
            this.riskLevelElement.textContent = '--';
            this.riskLevelElement.className = 'metric-value badge';
        }
        if (this.urgencyLevelElement) {
            this.urgencyLevelElement.textContent = '--';
            this.urgencyLevelElement.className = 'metric-value badge';
        }
        
        this.hideEmergencyBanner();
        this.messageInput.focus();
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the enhanced chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedMedicalChatbot();
});
