// Enhanced Medical Chatbot JavaScript with Safety Features

class AdvancedMedicalChatbot {
    constructor() {
        console.log('Initializing AdvancedMedicalChatbot...');
        
        // Get DOM elements
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.clearButton = document.getElementById('clearChat');
        this.showFeaturesButton = document.getElementById('showFeatures');
        
        // Check if required elements exist
        if (!this.messageInput || !this.sendButton || !this.chatMessages) {
            console.error('Required DOM elements not found:', {
                messageInput: !!this.messageInput,
                sendButton: !!this.sendButton,
                chatMessages: !!this.chatMessages
            });
            return;
        }
        
        // Initialize modals (optional)
        try {
            this.featuresModal = new bootstrap.Modal(document.getElementById('featuresModal'));
        } catch (error) {
            console.warn('Bootstrap modals not available:', error);
        }
        
        this.emergencyBanner = document.getElementById('emergencyBanner');
        
        // Performance tracking elements
        this.responseTimeElement = document.getElementById('responseTime');
        this.riskLevelElement = document.getElementById('riskLevel');
        this.urgencyLevelElement = document.getElementById('urgencyLevel');
        this.charCountElement = document.getElementById('charCount');
        
        this.initializeEventListeners();
        this.scrollToBottom();
        this.updateCharCount();
        
        // Enable debug mode if URL contains ?debug=true
        if (window.location.search.includes('debug=true')) {
            this.enableDebugMode();
        }
        
        console.log('AdvancedMedicalChatbot initialized successfully');
    }
    
    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // Send button click
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => {
                console.log('Send button clicked');
                this.sendMessage();
            });
        }
        
        // Enter key press
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('Enter key pressed');
                    this.sendMessage();
                }
            });
        }
        
        // Clear chat button
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                console.log('Clear button clicked');
                this.clearChat();
            });
        }
        
        // Mobile sidebar toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const sidebar = document.querySelector('.sidebar');
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                console.log('Mobile toggle clicked');
                sidebar.classList.toggle('show');
            });
            
            // Hide sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    !mobileToggle.contains(e.target) && 
                    sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                }
            });
        }
        
        // Show features modal
        if (this.showFeaturesButton && this.featuresModal) {
            this.showFeaturesButton.addEventListener('click', () => {
                console.log('Features button clicked');
                this.featuresModal.show();
            });
        }
        
        // Input character count and validation
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => this.handleInputChange());
        }
        
        // Auto-focus input
        if (this.messageInput) {
            this.messageInput.focus();
        }
        
        console.log('Event listeners set up successfully');
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
        console.log('sendMessage called');
        this.addDebugMessage && this.addDebugMessage('sendMessage called');
        
        const message = this.messageInput.value.trim();
        console.log('Message to send:', message);
        this.addDebugMessage && this.addDebugMessage(`Message: ${message.substring(0, 30)}...`);
        
        if (!message) {
            console.log('Empty message, showing error');
            this.showError('Please enter a message');
            return;
        }
        
        if (message.length > 1000) {
            console.log('Message too long, showing error');
            this.showError('Message too long. Please keep it under 1000 characters.');
            return;
        }
        
        // Disable input and show loading
        this.setInputState(false);
        this.showLoadingIndicator();
        this.addDebugMessage && this.addDebugMessage('Loading indicator shown');
        
        // Add user message to chat
        this.addMessage('user', message);
        this.messageInput.value = '';
        this.updateCharCount();
        
        const startTime = Date.now();
        this.addDebugMessage && this.addDebugMessage('Sending request to server');
        
        try {
            console.log('Sending request to server...');
            
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000)
            );
            
            const fetchPromise = fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const response = await Promise.race([fetchPromise, timeoutPromise]);
            console.log('Response received:', response.status);
            this.addDebugMessage && this.addDebugMessage(`Response: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            this.addDebugMessage && this.addDebugMessage(`Data received, emergency: ${data.emergency}`);
            
            const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
            
            this.hideLoadingIndicator();
            this.addDebugMessage && this.addDebugMessage('Loading indicator hidden');
            this.handleSuccessResponse(data, responseTime);
            this.addDebugMessage && this.addDebugMessage('Success response handled');
            
        } catch (error) {
            console.error('Error in sendMessage:', error);
            this.addDebugMessage && this.addDebugMessage(`Error: ${error.message}`);
            this.hideLoadingIndicator();
            
            if (error.message.includes('timeout')) {
                this.showError('Request timed out. The server may be processing a complex query. Please try again.');
            } else if (error.message.includes('HTTP error')) {
                this.showError('Server error occurred. Please try again.');
            } else {
                this.showError('Network error. Please check your connection and try again.');
            }
        } finally {
            // Ensure cleanup happens
            setTimeout(() => {
                this.hideLoadingIndicator();
                this.setInputState(true);
            }, 100);
            this.addDebugMessage && this.addDebugMessage('Final cleanup scheduled');
        }
    }
    
    handleSuccessResponse(data, actualResponseTime) {
        console.log('handleSuccessResponse called with:', data);
        this.addDebugMessage && this.addDebugMessage('handleSuccessResponse called');
        
        // Force hide loading indicator first
        this.hideLoadingIndicator();
        
        // Update performance metrics
        this.updatePerformanceMetrics(data, actualResponseTime);
        
        // Handle emergency responses
        if (data.emergency) {
            console.log('Emergency response detected');
            this.addDebugMessage && this.addDebugMessage('Emergency response handling');
            this.handleEmergencyResponse(data);
            // Ensure cleanup for emergency responses
            setTimeout(() => {
                this.hideLoadingIndicator();
                this.setInputState(true);
            }, 100);
            return;
        }
        
        // Handle normal responses with enhanced display
        console.log('Normal response handling');
        this.addDebugMessage && this.addDebugMessage('Normal response handling');
        this.addEnhancedBotMessage(data);
    }
    
    handleEmergencyResponse(data) {
        console.log('handleEmergencyResponse called');
        this.addDebugMessage && this.addDebugMessage('Emergency response processing');
        
        // Force hide loading indicator
        this.hideLoadingIndicator();
        
        // Show emergency banner
        this.showEmergencyBanner(data.response);
        
        // Add emergency message to chat
        this.addMessage('bot', data.response, 'emergency', data);
        
        // Auto-scroll and flash attention
        this.scrollToBottom();
        this.flashEmergencyAttention();
        
        console.log('Emergency response handling complete');
        this.addDebugMessage && this.addDebugMessage('Emergency handling complete');
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
        // Create or show inline loading indicator
        let loadingDiv = document.getElementById('loadingIndicator');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingIndicator';
            loadingDiv.className = 'message bot-message loading-message';
            loadingDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        <i class="fas fa-spinner fa-spin"></i> Analyzing symptoms & assessing safety...
                    </div>
                </div>
            `;
            this.chatMessages.appendChild(loadingDiv);
        } else {
            loadingDiv.style.display = 'flex';
        }
        this.scrollToBottom();
        console.log('Loading indicator shown');
    }
    
    hideLoadingIndicator() {
        const loadingDiv = document.getElementById('loadingIndicator');
        if (loadingDiv) {
            loadingDiv.remove();
            console.log('Loading indicator removed');
        }
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
    
    // Debug mode for troubleshooting
    enableDebugMode() {
        console.log('🔧 Debug mode enabled');
        this.debugMode = true;
        
        // Add debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debugPanel';
        debugPanel.style.cssText = `
            position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); 
            color: white; padding: 10px; border-radius: 5px; font-family: monospace; 
            font-size: 12px; z-index: 9999; max-width: 300px;
        `;
        debugPanel.innerHTML = '<strong>🔧 Debug Mode</strong><div id="debugLog"></div>';
        document.body.appendChild(debugPanel);
        
        this.debugLog = document.getElementById('debugLog');
        this.addDebugMessage('Debug mode initialized');
    }
    
    addDebugMessage(message) {
        if (this.debugMode && this.debugLog) {
            const time = new Date().toLocaleTimeString();
            this.debugLog.innerHTML += `<br>${time}: ${message}`;
            this.debugLog.scrollTop = this.debugLog.scrollHeight;
        }
        console.log(`[DEBUG] ${message}`);
    }
}

// Initialize the enhanced chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedMedicalChatbot();
});
