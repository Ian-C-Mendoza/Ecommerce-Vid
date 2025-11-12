import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  Settings,
  UserCheck,
} from "lucide-react";

export function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("general"); // 'general' | 'technical' | 'admin'
  const [isOnline] = useState(true);

  const agents = [
    { id: "general", name: "General Support", status: "online", icon: Bot },
    {
      id: "technical",
      name: "Technical Support",
      status: "online",
      icon: Settings,
    },
    { id: "admin", name: "Direct to Admin", status: "online", icon: UserCheck },
  ];

  const currentAgent = agents.find((a) => a.id === selectedAgent) || agents[0];
  const CurrentIcon = currentAgent.icon || Bot;

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi! I'm here to help you with any questions about our video editing services. How can I assist you today?",
      sender: "support",
      timestamp: new Date(),
      agent: "general",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleAgentChange = (agentId) => {
    setSelectedAgent(agentId);
    const agent = agents.find((a) => a.id === agentId) || agents[0];
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: `You've been connected to ${agent.name}. How can I help you?`,
        sender: "support",
        timestamp: new Date(),
        agent: agentId,
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: "user",
      timestamp: new Date(),
      agent: selectedAgent,
    };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    setTimeout(() => {
      const reply = getAgentReply(selectedAgent, userMsg.text);
      const supportMsg = {
        id: (Date.now() + 1).toString(),
        text: reply,
        sender: "support",
        timestamp: new Date(),
        agent: selectedAgent,
      };
      setMessages((prev) => [...prev, supportMsg]);
    }, 650);
  };

  return (
    <>
      {/* Toggle FAB */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full h-16 w-16 bg-blue-600 hover:bg-blue-700 shadow-lg transition-all duration-300"
              aria-label="Open chat"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </Button>
            {isOnline && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            )}
          </div>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96">
          {/* Glass wrapper (backdrop blur lives here) */}
          <Card className="glass rounded-2xl overflow-hidden isolate">
            <CardHeader className="flex flex-col gap-3 pb-3 bg-white/10 dark:bg-neutral-900/30 border-b border-white/10">
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                      <CurrentIcon className="w-5 h-5 text-white" />
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base text-blue-700 dark:text-blue-300">
                      Live Support – {currentAgent.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {isOnline ? "🟢 Online" : "⚫ Offline"}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-red-100/40 dark:hover:bg-red-900/40 rounded-full"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Agent selector */}
              <div className="w-full">
                <Select value={selectedAgent} onValueChange={handleAgentChange}>
                  <SelectTrigger className="h-8 text-sm bg-white/20 dark:bg-neutral-800/30 rounded-md">
                    <SelectValue placeholder="Choose support" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/70 dark:bg-neutral-900/70 border border-white/20 rounded-md">
                    {agents.map((a) => {
                      const Icon = a.icon || Bot;
                      return (
                        <SelectItem key={a.id} value={a.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span>{a.name}</span>
                            <span className="ml-auto text-xs">{a.status}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages (tinted, no extra blur) */}
              <div className="h-64 overflow-y-auto p-4 space-y-4 bg-white/5 dark:bg-neutral-900/25">
                {messages.map((m) => {
                  const RowIcon =
                    m.sender === "user"
                      ? User
                      : agents.find((a) => a.id === m.agent)?.icon || Bot;
                  const isUser = m.sender === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex space-x-3 ${
                        isUser ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow ${
                          isUser
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200/60 dark:bg-gray-700/60"
                        }`}
                      >
                        <RowIcon className="w-4 h-4" />
                      </div>

                      <div
                        className={`flex-1 max-w-[80%] ${
                          isUser ? "text-right" : ""
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg text-sm ${
                            isUser
                              ? "bg-blue-600 text-white shadow"
                              : "bg-white/70 dark:bg-gray-700/70 border border-white/10"
                          }`}
                        >
                          {m.text}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-1">
                          {m.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input row (tinted, no extra blur) */}
              <div className="p-4 border-t border-white/10 dark:border-white/10 bg-white/10 dark:bg-neutral-900/35">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-white/40 dark:bg-neutral-800/50 border border-white/20 rounded-lg"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="glass-card px-3 py-2"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We typically respond within a few minutes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

/* helpers */
function getAgentReply(agent, text) {
  const t = (text || "").toLowerCase();

  const general = [
    "Thanks for reaching out! I'd be happy to help you with that.",
    "Let me check our available options for you.",
    "That's a great question! Our team can definitely assist with that.",
    "Thanks for your interest! Let me provide you with more details.",
  ];

  const technical = [
    "I'm here to help with any technical questions you have.",
    "Let me look into the technical specifications for you.",
    "I can provide detailed information about our editing process.",
    "For technical support, I'll need a few more details about your project.",
  ];

  const admin = [
    "Hello! This is the admin team. How can I personally assist you?",
    "I can handle special requests or custom solutions.",
    "I'll personally ensure your needs are met.",
  ];

  if (t.includes("price") || t.includes("cost")) {
    return "Our pricing starts at $49 (Basic), $149 (Standard), and $299 (Premium). Each tier differs by complexity, turnaround and revisions. Want a quick breakdown?";
  }
  if (
    t.includes("delivery") ||
    t.includes("time") ||
    t.includes("turnaround")
  ) {
    return "Typical delivery: Basic 2–3 days, Standard 5–7 days, Premium 10–14 days. Rush delivery is available. What’s your deadline?";
  }
  if (t.includes("revision") || t.includes("changes")) {
    return "Revisions: Basic = 1, Standard = 3, Premium = unlimited. We’ll make sure you’re happy with the result.";
  }
  if (t.includes("format") || t.includes("file")) {
    return "We deliver MP4/MOV (others on request) and any common resolution (HD/4K). Tell us the platform so we can export perfectly.";
  }

  const pools = { general, technical, admin };
  const list = pools[agent] || general;
  return list[Math.floor(Math.random() * list.length)];
}
