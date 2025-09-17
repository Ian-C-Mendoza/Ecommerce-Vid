import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MessageCircle, X, Send, User, Bot, UserCheck, Settings } from 'lucide-react';

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('general');
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm here to help you with any questions about our video editing services. How can I assist you today?",
      sender: 'support',
      timestamp: new Date(),
      agent: 'general'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isOnline] = useState(true);
  const messagesEndRef = useRef(null);

  const agents = [
    { id: 'general', name: 'General Support', icon: Bot, status: 'online' },
    { id: 'technical', name: 'Technical Support', icon: Settings, status: 'online' },
    { id: 'admin', name: 'Direct to Admin', icon: UserCheck, status: 'online' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAgentChange = (agentId) => {
    setSelectedAgent(agentId);
    const agent = agents.find(a => a.id === agentId);
    
    const switchMessage = {
      id: Date.now().toString(),
      text: `You've been connected to ${agent.name}. How can I help you?`,
      sender: 'support',
      timestamp: new Date(),
      agent: agentId
    };
    
    setMessages(prev => [...prev, switchMessage]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      agent: selectedAgent
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate support response based on agent
    setTimeout(() => {
      const responses = {
        general: [
          "Thanks for reaching out! I'd be happy to help you with that.",
          "Let me check our available options for you.",
          "That's a great question! Our team can definitely assist with that.",
          "I'll connect you with one of our video editing specialists right away.",
          "Thanks for your interest! Let me provide you with more details."
        ],
        technical: [
          "I'm here to help with any technical questions you have.",
          "Let me look into the technical specifications for you.",
          "I can provide detailed information about our editing process.",
          "For technical support, I'll need a few more details about your project.",
          "I can help troubleshoot any technical issues you're experiencing."
        ],
        admin: [
          "Hello! This is the admin team. How can I personally assist you?",
          "I'm here to handle any special requests or concerns you may have.",
          "As an admin, I have access to all our services and can provide custom solutions.",
          "Thank you for contacting admin directly. What can I help you with?",
          "I'll personally ensure your needs are met. Please tell me more about your project."
        ]
      };
      
      const agentResponses = responses[selectedAgent] || responses.general;
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: agentResponses[Math.floor(Math.random() * agentResponses.length)],
        sender: 'support',
        timestamp: new Date(),
        agent: selectedAgent
      };
      
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const currentAgent = agents.find(a => a.id === selectedAgent);

  return (
    <div className="chat-support fixed bottom-0 right-0 z-[999] p-4">
      <div className="relative">
        {/* Chat Window - Opens upward */}
        {isOpen && (
          <Card className="absolute bottom-full mb-4 right-0 w-80 h-[500px] shadow-2xl glass border-white/20 animate-in slide-in-from-bottom-5 duration-300">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-white">
                  <currentAgent.icon className="w-5 h-5" />
                  <span>ReelWorks - {currentAgent.name}</span>
                </CardTitle>
                <Badge variant="secondary" className="bg-green-500 text-white animate-pulse text-xs">
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              {/* Agent Selector */}
              <div className="mt-3">
                <Select value={selectedAgent} onValueChange={handleAgentChange}>
                  <SelectTrigger className="w-full h-8 text-sm bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center space-x-2">
                          <agent.icon className="w-4 h-4" />
                          <span>{agent.name}</span>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${agent.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                            {agent.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex flex-col h-full">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50 max-h-80">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-2.5 animate-in slide-in-from-bottom-2 duration-300 ${
                        message.sender === 'user'
                          ? 'bg-gradient-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'support' && (
                          <currentAgent.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        )}
                        {message.sender === 'user' && (
                          <User className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-white" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs leading-relaxed">{message.text}</p>
                          <p
                            className={`text-xs mt-1 opacity-70 ${
                              message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground/70'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t bg-background/80">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 h-8 text-sm bg-background/50 border-white/20 focus:border-primary"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-gradient-primary hover:bg-gradient-secondary btn-hover-primary h-8 w-8 p-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Toggle Button - Enhanced with pulsing */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-16 h-16 rounded-full shadow-2xl bg-gradient-primary text-white border-0 transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none"
          size="lg"
        >
          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-primary animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-primary animate-pulse opacity-30"></div>
          
          {/* Icon */}
          <div className="relative z-10">
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <MessageCircle className="w-7 h-7 text-white" />
            )}
          </div>
          
          {/* Online indicator with enhanced pulsing */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60"></div>
            </div>
          )}
          
          {/* Floating text indicator */}
          {!isOpen && (
            <div className="absolute -top-12 right-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1 rounded-lg shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Need help? Chat with us!
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
