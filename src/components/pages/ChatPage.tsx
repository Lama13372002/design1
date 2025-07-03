"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  Pin,
  Flag,
  MoreHorizontal,
  Shield,
  MessageCircle,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  user: {
    name: string;
    avatar?: string;
    role?: "admin" | "moderator";
  };
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    user: { name: "Админ", role: "admin" },
    message: "Добро пожаловать в общий чат! Соблюдайте правила.",
    timestamp: "12:30"
  },
  {
    id: "2",
    user: { name: "SportsFan" },
    message: "Кто ставит на Реал сегодня?",
    timestamp: "12:35"
  },
  {
    id: "3",
    user: { name: "BetMaster" },
    message: "Я думаю Барса выиграет, коэффициент хороший",
    timestamp: "12:36"
  },
  {
    id: "4",
    user: { name: "Test User", role: undefined },
    message: "Согласен, но Реал дома сильнее",
    timestamp: "12:37",
    isOwn: true
  }
];

const pinnedRules = [
  "Запрещены оскорбления",
  "Запрещен спам",
  "Споры разрешаются только через платформу"
];

export const ChatPage = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showRules, setShowRules] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: { name: "Test User" },
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        isOwn: true
      };

      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleReportMessage = (messageId: string) => {
    alert(`Жалоба на сообщение ${messageId} отправлена модераторам`);
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "moderator":
        return "bg-blue-500";
      default:
        return "bg-gradient-to-br from-blue-500 to-purple-600";
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="text-xs">Admin</Badge>;
      case "moderator":
        return <Badge variant="default" className="text-xs">Mod</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Общий чат</h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>127 онлайн</span>
                <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRules(!showRules)}
          >
            <Pin className="h-4 w-4" />
          </Button>
        </div>

        {/* Pinned Rules */}
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Pin className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300 text-sm">
                      Правила чата
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {pinnedRules.map((rule, index) => (
                      <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                        • {rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${message.isOwn ? "order-2" : ""}`}>
              {!message.isOwn && (
                <div className="flex items-center space-x-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`${getRoleColor(message.user.role)} text-white text-xs`}>
                      {message.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">{message.user.name}</span>
                  {getRoleBadge(message.user.role)}
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
              )}

              <div className="flex items-start space-x-2">
                <Card className={`
                  ${message.isOwn
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-card"
                  }
                `}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    {message.isOwn && (
                      <div className="text-xs opacity-80 mt-1 text-right">
                        {message.timestamp}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {!message.isOwn && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReportMessage(message.id)}
                    className="opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            placeholder="Написать сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Shield className="h-3 w-3" />
            <span>Модерация включена</span>
          </div>
          <span>{newMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
};
