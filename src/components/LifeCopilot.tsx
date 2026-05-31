import React, { useState, useRef, useEffect } from "react";
import { Mic, ArrowRight, Play, Square, Bell, Sparkles, Volume2, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { ChatMessage } from "../types";

interface Props {
  preferences: {
    screenReaderMode: boolean;
    highContrastMode: boolean;
    lowBandwidth: boolean;
  };
}

export default function LifeCopilot({ preferences }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "jarvis",
      text: "Habari! I am Jarvis, your Life Copilot. I have calibrated your OS profile to ensure high-contrast visibility and screen-reader compatibility. How can I assist you with your schedule, medicine reminders, or opportunity matches today?",
      timestamp: "09:00",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSpeak = (text: string) => {
    if (!synthRef.current) return;
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      return;
    }
    
    // Create a speech friendly read-out
    const cleanedText = text.replace(/[#*`_]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    speechUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          preferences,
          context: {
            page: "AOS Digital OS Africa Core Portal",
            localTime: new Date().toISOString(),
          },
        }),
      });
      const data = await response.json();
      
      const copilotMsg: ChatMessage = {
        id: `jarvis-${Date.now()}`,
        sender: "jarvis",
        text: data.text || "Hello! Deep connection successfully bypassed. I am standing by to process your next micro-action.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, copilotMsg]);
      
      // Auto-narrate if user wants high accessibility
      if (preferences.screenReaderMode) {
        handleSpeak(copilotMsg.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoiceIn = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice conversion
      const voicePrompts = [
        "Summarize standard bank accessibility tenders in Johannesburg.",
        "Set a medication reminder to take Insulin at 14:00 daily.",
        "Draft a business plan to sell accessible screen reader modules in Kigali.",
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      handleSendMessage(randomPrompt);
    } else {
      setIsRecording(true);
      // Let it automatically trigger after 3.5s
      setTimeout(() => {
        if (isRecording) {
          setIsRecording(false);
        }
      }, 3500);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full" id="copilot-panel">
      {/* Messages Column */}
      <div className="lg:col-span-2 flex flex-col glass-panel rounded-2xl border border-slate-800/80 shadow-2xl h-[560px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500 pulsing-dot"></div>
            <div>
              <h2 className="font-display font-medium text-slate-100 flex items-center gap-1.5 text-base">
                Jarvis Life Copilot <Sparkles className="w-4 h-4 text-indigo-400" />
              </h2>
              <p className="text-xs text-slate-400">Africa Assistive Neural Core v2.4 (Active)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeak(messages[messages.length - 1]?.text || "")}
              className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1 ${
                isSpeaking ? "bg-red-500/20 text-red-300" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
              }`}
              title="Speak last answer aloud"
            >
              <Volume2 className="w-4 h-4" />
              {isSpeaking ? "Stop Utterance" : "Hear Feed"}
            </button>
          </div>
        </div>

        {/* Chat Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              <div
                className={`p-3.5 rounded-2xl leading-relaxed text-[13.5px] whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-slate-50 rounded-br-none"
                    : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/50"
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 mr-auto bg-slate-800/40 border border-slate-800 px-4 py-3 rounded-2xl rounded-bl-none max-w-[150px]">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Fast Action Helpers */}
        <div className="p-2 bg-slate-900/40 border-t border-slate-800 overflow-x-auto flex gap-2 scrollbar-none">
          <button
            onClick={() => handleSendMessage("Recommend remote WCAG evaluation audits for me.")}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1.5 rounded-full border border-indigo-500/10 shrink-0 cursor-pointer"
          >
            🔍 Recommend Audits
          </button>
          <button
            onClick={() => handleSendMessage("Analyze standard business templates for low bandwidth")}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1.5 rounded-full border border-indigo-500/10 shrink-0 cursor-pointer"
          >
            🏢 Low-Bandwidth Commerce
          </button>
          <button
            onClick={() => handleSendMessage("Create a reminder alert for my monthly MoMo mobile wallet reconciliation.")}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-indigo-300 px-2.5 py-1.5 rounded-full border border-indigo-500/10 shrink-0 cursor-pointer"
          >
            💰 Check MoMo Balance
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/60"
        >
          <button
            type="button"
            onClick={handleToggleVoiceIn}
            className={`p-3.5 rounded-xl border transition-all shrink-0 ${
              isRecording
                ? "bg-red-500 border-red-400 text-slate-100 animate-pulse"
                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-400"
            }`}
            title="Simulate Voice Prompt"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Listening... voice trigger active..." : "Ask Jarvis everything (e.g., summarize documents, schedule reminders)..."}
            className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 border border-slate-700/80 rounded-xl px-4 py-3 outline-none text-sm transition-focus focus:border-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors shrink-0 cursor-pointer"
            disabled={loading || !input.trim()}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Jarvis Productivity Desk */}
      <div className="flex flex-col gap-6">
        {/* Medicine & Wellness Reminders */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-md">
          <h3 className="font-display font-medium text-slate-200 flex items-center gap-2 mb-3 text-sm">
            <Bell className="w-4 h-4 text-emerald-400" /> Active Jarvis Reminders
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-emerald-200">Insulin Medication Alert</p>
                <p className="text-[10px] text-emerald-400/80">Every day at 14:00 (Rwandan Time)</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 bg-indigo-500/5 p-2.5 rounded-xl border border-indigo-500/10">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Safaricom Prep Pitch Deadline</p>
                <p className="text-[10px] text-slate-400">August 15, 2026 - KES 2.5M Grant Proposal</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Learning & Emotional Support Coach */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-md flex-1">
          <h3 className="font-display font-medium text-slate-200 flex items-center gap-2 mb-3 text-sm">
            <Sparkles className="w-4 h-4 text-magenta-400" /> Neural Coaching Modules
          </h3>
          <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
            Your daily tailored exercises to refine confidence, digital freelancing capability, and accessibility audits:
          </p>
          <div className="space-y-2.5">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-indigo-300">Duolingo Sign Language</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Beginner</span>
              </div>
              <p className="text-[11px] text-slate-400">Practice translating business templates with visual sign-avatar guides.</p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-indigo-300">Accessibility Auditing 101</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">95% score</span>
              </div>
              <p className="text-[11px] text-slate-400">Understand automated color-contrast checks and screen reader aria anchors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
