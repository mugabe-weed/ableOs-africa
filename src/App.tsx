import React, { useState, useEffect } from "react";
import {
  Sparkles,
  LayoutDashboard,
  Brain,
  Lightbulb,
  Search,
  Code2,
  BadgeCheck,
  Wallet,
  Compass,
  Briefcase,
  UserCheck,
  Video,
  Database,
  Eye,
  Menu,
  X,
  Settings,
  Shield,
  Phone,
  HelpCircle,
  TrendingUp,
  Award,
  WifiOff
} from "lucide-react";

// Importing modular elements
import LifeCopilot from "./components/LifeCopilot";
import BusinessCreator from "./components/BusinessCreator";
import OpportunityEngine from "./components/OpportunityEngine";
import ApiPlatform from "./components/ApiPlatform";
import ScannerEngine from "./components/ScannerEngine";
import OfflineDocsModule from "./components/OfflineDocsModule";

import {
  FintechWallet,
  TransportMap,
  CareerCoach,
  DigitalId,
  SignLanguageAi,
  MarketIntelligence,
  TourismPlatform,
  VoiceCommandHelper,
  ContentCreator,
  StartupIncubator
} from "./components/EnterpriseOSModules";

import { ActiveApp } from "./types";
import { initialCertifiedBusinesses } from "./data/mockData";

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveApp>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [pingOnline, setPingOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setPingOnline(true);
    const handleOffline = () => setPingOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // App redirect callback used by vocal systems
  const handleVocalRouting = (targetApp: ActiveApp) => {
    setActiveApp(targetApp);
  };

  const getAppTitle = () => {
    switch (activeApp) {
      case "dashboard":
        return "Autonomous Workspace";
      case "copilot":
        return "Jarvis Life Assist";
      case "biz_creator":
        return "AI Entrepreneurship Creator";
      case "opp_engine":
        return "Opportunity Discovery & Scraping";
      case "api_platform":
        return "Developer Integration APIs";
      case "scanner_engine":
        return "WCAG Web Auditor Scanner";
      case "cert_system":
        return "Verified Accessible Certifications";
      case "fintech":
        return "Assistive Multi-Cur Fintech Wallet";
      case "transport":
        return "Accessible Logistics Taxi Network";
      case "interview_coach":
        return "AI Confidence & Career Coach";
      case "digital_id":
        return "Cryptographic Assistive Passport (D-ID)";
      case "sign_language":
        return "Speech-to-Gesture Sign Avatar AI";
      case "market_intelligence":
        return "Regional Accessibility Market Intel";
      case "tourism":
        return "Inclusive Regional Tourism Directory";
      case "content_creator":
        return "AI Assistive Content Broadcaster";
      case "incubator":
        return "Disability Startups Accelerator Pipeline";
      case "offline_vault":
        return "Offline Document Vault & Tools";
      default:
        return "AbleOS Terminal";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-200 ${
      highContrastMode ? "bg-black text-white" : "bg-[#080b11] text-slate-100"
    }`}>
      {/* OS Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-3 flex justify-between items-center shrink-0 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors md:hidden cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-indigo-400" /> : <Menu className="w-5 h-5 text-indigo-400" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center font-display font-bold text-slate-100 shadow-md">
              A
            </div>
            <div>
              <h1 className="font-display font-medium text-slate-100 text-sm tracking-wide leading-none flex items-center gap-1.5">
                AbleOS Africa <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              </h1>
              <p className="text-[10px] text-indigo-400 font-mono tracking-wider">AFRICA DIGITAL CORE v2.8</p>
            </div>
          </div>
        </div>

        {/* Global Assistive controls panel */}
        <div className="flex items-center gap-3">
          {/* Quick toggle list */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] bg-slate-900 px-3 py-1.5 rounded-full border border-slate-850">
            <span className="text-slate-500 uppercase tracking-wider font-semibold mr-1">Toggles:</span>
            
            <label className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 select-none">
              <input
                type="checkbox"
                checked={screenReaderMode}
                onChange={(e) => setScreenReaderMode(e.target.checked)}
                className="w-3 h-3 text-indigo-500 rounded bg-slate-950 border-slate-800 cursor-pointer"
              />
              Audio Assistant Narrator
            </label>

            <span className="text-slate-800">|</span>

            <label className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 select-none">
              <input
                type="checkbox"
                checked={highContrastMode}
                onChange={(e) => setHighContrastMode(e.target.checked)}
                className="w-3 h-3 text-indigo-500 rounded bg-slate-950 border-slate-800 cursor-pointer"
              />
              High Contrast AA
            </label>

            <span className="text-slate-800">|</span>

            <label className="flex items-center gap-1 cursor-pointer hover:text-indigo-400 select-none">
              <input
                type="checkbox"
                checked={lowBandwidth}
                onChange={(e) => setLowBandwidth(e.target.checked)}
                className="w-3 h-3 text-indigo-500 rounded bg-slate-950 border-slate-800 cursor-pointer"
              />
              Low Bandwidth
            </label>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full pulsing-dot ${pingOnline ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
            <span className="text-[10.5px] text-slate-400 font-mono hidden md:inline">
              {pingOnline ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
            </span>
          </div>
        </div>
      </header>

      {/* Primary OS Container Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* SIDE BAR LAUNCHER DOCK */}
        <aside className={`border-r border-slate-800/80 bg-slate-950/60 transition-transform duration-300 md:translate-x-0 w-[240px] flex flex-col justify-between shrink-0 absolute md:static inset-y-0 left-0 z-50 p-4 ${
          sidebarOpen ? "translate-x-0 bg-slate-950" : "-translate-x-full"
        }`}>
          <div className="space-y-4">
            <div className="text-[10.5px] text-slate-500 uppercase font-bold tracking-wider px-2">Core Operating Modules</div>
            
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard },
                { id: "offline_vault", label: "Offline Vault & Tools", icon: WifiOff },
                { id: "copilot", label: "Jarvis Life Copilot", icon: Brain },
                { id: "biz_creator", label: "VC Business Creator", icon: Lightbulb },
                { id: "opp_engine", label: "Smart Opportunities", icon: Search },
                { id: "api_platform", label: "Developer Portal", icon: Code2 },
                { id: "scanner_engine", label: "WCAG Web Auditor", icon: BadgeCheck },
                { id: "cert_system", label: "Business Credentials", icon: Award },
                { id: "fintech", label: "Assisive Wallet & Pay", icon: Wallet },
                { id: "transport", label: "Dispatch Logistics", icon: Compass },
                { id: "interview_coach", label: "AI Career Coach", icon: Briefcase },
                { id: "digital_id", label: "Cryptographic Identity", icon: UserCheck },
                { id: "sign_language", label: "Sign Sign Language AI", icon: Video },
                { id: "market_intelligence", label: "Market Intelligence", icon: Database },
                { id: "tourism", label: "Tourism Companion", icon: Compass },
                { id: "content_creator", label: "Broadcaster AI", icon: Video },
                { id: "incubator", label: "Venture Accelerator", icon: Shield },
              ].map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      setActiveApp(app.id as ActiveApp);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-xs font-medium font-sans px-3 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      activeApp === app.id
                        ? "bg-indigo-600/15 border-indigo-500/25 text-indigo-300 font-semibold shadow-inner"
                        : "bg-transparent hover:bg-slate-900 border-transparent text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {app.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-900 space-y-2.5">
            <div className="flex items-center gap-1.5 px-2 text-[10.5px] text-slate-500">
              <Shield className="w-3.5 h-3.5" /> Secure Crypto Sandboxed
            </div>
            {/* Direct quick action */}
            <button
              onClick={() => alert("Calibrating screen reader profiles and high contrast templates.")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-350 text-[11px] rounded-xl py-2 cursor-pointer transition-colors border border-slate-800"
            >
              Calibrate UI Mode
            </button>
          </div>
        </aside>

        {/* WORKSPACE VIEW PANEL */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Active app Title banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400">AbleOS Workspace</span>
              <h2 className="font-display font-bold text-slate-50 text-xl tracking-wide mt-0.5">{getAppTitle()}</h2>
            </div>
            {/* Integrated Vocal Navigation Quick Assistant */}
            <div className="w-full sm:w-auto shrink-0 max-w-sm">
              <VoiceCommandHelper onNavigationSelect={handleVocalRouting} activeApp={activeApp} />
            </div>
          </div>

          {/* ACTIVE SCREEN ROUTER */}
          <div className="h-full">
            {activeApp === "dashboard" && (
              <div className="space-y-6">
                {/* Visual Bento Overview Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Jobs & Freelance Scraped</p>
                    <p className="text-xl font-mono font-bold text-slate-100 mt-1">142 Actives</p>
                    <span className="text-[10.5px] text-indigo-400 mt-1 block">Timezone matched: Africa</span>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-slate-800 shadow-bold">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Verified Audited Partners</p>
                    <p className="text-xl font-mono font-bold text-emerald-400 mt-1">4 certified</p>
                    <span className="text-[10.5px] text-slate-500 mt-1 block">MTN Safaricom, Standard BK</span>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Developer API volume</p>
                    <p className="text-xl font-mono font-bold text-slate-100 mt-1">9,060 Calls</p>
                    <span className="text-[10.5px] text-indigo-400 mt-1 block">90.6% limit quota left</span>
                  </div>

                  <div className="glass-panel p-4 rounded-xl border border-slate-800 shadow-md">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Digital Wallet Escrow</p>
                    <p className="text-xl font-mono font-bold text-slate-100 mt-1">$1,280 USD</p>
                    <span className="text-[10.5px] text-emerald-400 mt-1 block">Reps RWF 1.25M MoMo</span>
                  </div>
                </div>

                {/* Dashboard core interaction: Ask Jarvis anything */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 space-y-5">
                    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 shadow-2xl">
                      <div className="flex items-center gap-1.5">
                        <Brain className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-display font-medium text-slate-100 text-sm">Empowerment Operating System summary</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        AbleOS Africa is a modern assistive software suite. Rather than using passive layouts, configure customized tactile inputs or leverage Jarvis voice narration triggers to manage schedules, apply for African technology grants, issue invoices, scan WCAG contrast barrier values on-the-fly, or translate speech strings into fluid Sign Language avatar animations.
                      </p>

                      <div className="pt-3 flex gap-2">
                        <button
                          onClick={() => handleVocalRouting("copilot")}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          Launch Jarvis Assistant
                        </button>
                        <button
                          onClick={() => handleVocalRouting("scanner_engine")}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl px-4 py-2.5 transition-colors border border-slate-750 cursor-pointer"
                        >
                          Scan Website Accessibility
                        </button>
                      </div>
                    </div>

                    {/* Certifications status summary component */}
                    <div className="glass-panel p-5 rounded-2xl border border-slate-801 border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-medium text-slate-200 text-sm">Verified Accessible Business Certifications</h4>
                        <button
                          onClick={() => handleVocalRouting("cert_system")}
                          className="text-indigo-400 hover:underline text-xs cursor-pointer"
                        >
                          Manage Audits
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {initialCertifiedBusinesses.slice(0, 2).map((biz) => (
                          <div key={biz.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-200">{biz.name}</span>
                              <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-mono">{biz.badgeName}</span>
                            </div>
                            <p className="text-slate-500 text-[11px]">{biz.industry} • {biz.region}</p>
                            <p className="text-indigo-300 text-[10.5px]">Accessibility compliance score: <strong className="font-mono">{biz.accessibilityScore}%</strong></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Quick-Stats / Action modules */}
                  <div className="lg:col-span-4 space-y-5">
                    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                      <h4 className="font-display font-medium text-slate-200 text-xs flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Africa Accessibility Index
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                        Average compliance level amongst Sub-Saharan enterprise firms has increased by 14% year-on-year. Verified listings are automatically synced on our database node.
                      </p>
                      <button
                        onClick={() => handleVocalRouting("market_intelligence")}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 text-xs font-semibold rounded-xl py-2 cursor-pointer"
                      >
                        Explore Intel Maps & Heatmaps
                      </button>
                    </div>

                    <div className="glass-panel p-4 rounded-2xl border border-indigo-500/10 shadow-sm space-y-2 text-xs bg-indigo-500/5">
                      <h4 className="font-semibold text-indigo-300">Self-Sovereign Identity verified</h4>
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        Your assistive passport skills are verified on-chain, matched with stripe and MTN wallets payout routes.
                      </p>
                      <button
                        onClick={() => handleVocalRouting("digital_id")}
                        className="text-indigo-400 hover:underline font-bold text-[10.5px] cursor-pointer"
                      >
                        View Verified Passport ID
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeApp === "copilot" && <LifeCopilot preferences={{ screenReaderMode, highContrastMode, lowBandwidth }} />}
            {activeApp === "biz_creator" && <BusinessCreator />}
            {activeApp === "opp_engine" && <OpportunityEngine />}
            {activeApp === "api_platform" && <ApiPlatform />}
            {activeApp === "scanner_engine" && <ScannerEngine />}
            
            {/* Enterprise OS components routed simply */}
            {activeApp === "cert_system" && (
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-5" id="cert-panel">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-display font-medium text-slate-100 text-base">Verified Accessible Business Certification Badge Dashboard</h3>
                    <p className="text-xs text-slate-400">Manage annual subscription-based audits, issue compliant SVG emblems, and review rankings.</p>
                  </div>
                  <button
                    onClick={() => alert("Initiating verified accessibility audit. Compliance crawler dispatched.")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl px-4 py-2 cursor-pointer"
                  >
                    Request Corporate Audit Verification
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  {initialCertifiedBusinesses.map((biz) => (
                    <div key={biz.id} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center gap-4 shadow-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-semibold text-slate-200 text-sm leading-none">{biz.name}</h4>
                          <span className="bg-indigo-500/15 text-indigo-400 font-mono px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide">
                            {biz.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{biz.industry} • {biz.region}</p>
                        <p className="text-slate-400 text-[10.5px]">Audit frequency: {biz.auditFrequency}</p>
                        <p className="text-indigo-300 font-mono font-bold mt-1.5">Compliance Grade score: {biz.accessibilityScore}%</p>
                      </div>

                      {/* Compliant SVG Emblem Badging */}
                      <div className="p-3 w-16 h-16 rounded-xl border border-indigo-500/15 bg-gradient-to-tr from-indigo-500/10 to-transparent flex flex-col items-center justify-center text-center shadow-lg shrink-0">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold leading-none">{biz.badgeName.split(" ")[0]}</span>
                        <span className="text-[12px] font-display font-bold text-slate-100 mt-1">{biz.badgeName.split(" ")[1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeApp === "fintech" && <FintechWallet />}
            {activeApp === "transport" && <TransportMap />}
            {activeApp === "interview_coach" && <CareerCoach />}
            {activeApp === "digital_id" && <DigitalId />}
            {activeApp === "sign_language" && <SignLanguageAi />}
            {activeApp === "market_intelligence" && <MarketIntelligence />}
            {activeApp === "tourism" && <TourismPlatform />}
            {activeApp === "content_creator" && <ContentCreator />}
            {activeApp === "incubator" && <StartupIncubator />}
            {activeApp === "offline_vault" && <OfflineDocsModule />}
          </div>
        </main>
      </div>

      {/* Footer bar credentials */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-2 text-[11px] text-slate-500 shrink-0">
        <p>© 2026 AbleOS Network. All rights reserved. Self-sovereign digital ecosystem for Africa and global expansion.</p>
        <p className="font-mono">Secure Sandboxed Container Node ({pingOnline ? "Online" : "Offline Cache Mode"})</p>
      </footer>
    </div>
  );
}
