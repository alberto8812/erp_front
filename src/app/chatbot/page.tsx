"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Send,
  Mic,
  Plus,
  Search,
  Library,
  Sparkles,
  Menu,
  Home,
} from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { SidebarHeaderChatBot } from "./ui/SidebarHeaderChatBot";
import { NavigationChatBot } from "./ui/NavigationChatBot";
import { UserProfileChatBot } from "./ui/UserProfileChatBot";

export default function ChatbotOnErpChatPage() {
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const chatHistory = ["Transformar DTO en NestJS", "New chat"];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Gracias por tu pregunta. Estoy procesando tu solicitud y te daré una respuesta detallada en un momento.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <ViewTransition default="slow-fade">
      <div className="h-screen flex bg-background">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden`}
        >
          {/* Sidebar Header */}
          <SidebarHeaderChatBot />

          {/* Navigation */}
          <NavigationChatBot />

          {/* Chat History */}
          <div className="flex-1 px-4">
            <h3 className="text-sm font-medium text-sidebar-foreground mb-2">
              Chats
            </h3>
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {chatHistory.map((chat, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left text-sidebar-foreground hover:bg-sidebar-accent text-sm h-auto py-2 px-2"
                  >
                    <span className="truncate">{chat}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* User Profile */}
          <UserProfileChatBot />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="h-8 w-8 p-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <h2 className="font-semibold text-foreground">ChatBot</h2>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            {messages.length === 1 ? (
              <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-semibold text-foreground mb-8 text-balance">
                  ¿Con qué puedo ayudarte?
                </h1>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${
                      msg.isBot ? "" : "flex-row-reverse"
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback
                        className={
                          msg.isBot
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-foreground"
                        }
                      >
                        {msg.isBot ? "AI" : "TU"}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${msg.isBot ? "" : "text-right"}`}>
                      <div className="prose prose-sm max-w-none text-foreground">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-border bg-card">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Pregunta lo que quieras"
                  className="pr-20 py-3 text-base bg-input border-border"
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="h-8 w-8 p-0 bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                ChatBot puede cometer errores. Verifica la información
                importante.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
