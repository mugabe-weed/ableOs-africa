import React, { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  MapPin,
  Compass,
  CheckCircle,
  Video,
  Sparkles,
  Award,
  BookOpen,
  PieChart,
  UserCheck,
  Phone,
  MessageSquare,
  HelpCircle,
  Copy,
  ChevronRight,
  Shield,
  Eye,
  Star,
  Users
} from "lucide-react";
import {
  initialTaxis,
  initialTourismSpots,
  initialStartups,
  initialTransactions,
  initialSignLanguage,
  initialCertifiedBusinesses
} from "../data/mockData";
import {
  AccessibleTaxi,
  TourismSpot,
  IncubatorStartup,
  WalletTransaction,
  SignLanguageSymbol,
  CertificationBusiness
} from "../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// -----------------------------------------------------
// 1. FINTECH WALLET SYSTEM
// -----------------------------------------------------
export function FintechWallet() {
  const [balance, setBalance] = useState({ KES: 154000, RWF: 1250000, USD: 1280 });
  const [transactions, setTransactions] = useState<WalletTransaction[]>(initialTransactions);
  const [activeCurrency, setActiveCurrency] = useState<"KES" | "RWF" | "USD">("USD");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceTo, setInvoiceTo] = useState("");
  const [fundingGoal, setFundingGoal] = useState({ raised: 4500, target: 10000 });

  const handleInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceAmount || !invoiceTo) return;

    const newTx: WalletTransaction = {
      id: `invoice-${Date.now()}`,
      type: "Invoiced Out",
      amount: parseFloat(invoiceAmount),
      provider: "Stripe",
      status: "Processing",
      refCode: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions((prev) => [newTx, ...prev]);
    setInvoiceAmount("");
    setInvoiceTo("");
    alert(`Invoiced $${invoiceAmount} out to: ${invoiceTo} using registered Stripe gateway.`);
  };

  const handleSimulateMoMoCashout = () => {
    const cashOutVal = 50;
    if (balance.USD < cashOutVal) return;

    setBalance((prev) => ({
      ...prev,
      USD: prev.USD - cashOutVal,
      KES: prev.KES + cashOutVal * 130,
    }));

    const newTx: WalletTransaction = {
      id: `momo-${Date.now()}`,
      type: "Mobile Money Out",
      amount: cashOutVal,
      provider: "MTN MoMo",
      status: "Completed",
      refCode: `MOMO-${Math.floor(Math.random() * 9000 + 1000)}`,
      date: new Date().toISOString().split("T")[0],
    };

    setTransactions((prev) => [newTx, ...prev]);
    alert(`Successfully disbursed $${cashOutVal} USD to MTN Mobile Money wallet linked to (+250788******5).`);
  };

  const currentBalDisplay = () => {
    if (activeCurrency === "KES") return `KES ${balance.KES.toLocaleString()}`;
    if (activeCurrency === "RWF") return `RWF ${balance.RWF.toLocaleString()}`;
    return `$${balance.USD.toLocaleString()} USD`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="fintech-panel">
      {/* Wallet balance display card */}
      <div className="lg:col-span-4 space-y-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg bg-gradient-to-b from-indigo-900/20 to-slate-900/60 flex flex-col justify-between h-[256px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-indigo-300 font-mono tracking-wider uppercase font-semibold">MTN MoMo Cashout Active</span>
              <Wallet className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-400">Total Available Balance (Multi-cur)</p>
            <h3 className="font-display font-bold text-slate-50 text-2xl mt-1.5">{currentBalDisplay()}</h3>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex gap-1.5">
              {(["USD", "KES", "RWF"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setActiveCurrency(curr)}
                  className={`text-[10px] font-mono px-2 py-1 rounded transition-colors ${
                    activeCurrency === curr ? "bg-indigo-600 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-400 shrink-0 cursor-pointer"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              onClick={handleSimulateMoMoCashout}
              className="w-full bg-slate-800 hover:bg-slate-705 text-white font-medium text-xs border border-indigo-500/10 rounded-xl py-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" /> Disburse $50 to MTN MoMo
            </button>
          </div>
        </div>

        {/* Crowdfunding support widget */}
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/10 shadow-sm space-y-3.5 bg-indigo-500/5">
          <h4 className="font-display font-medium text-indigo-300 text-xs leading-none">Assistive Braille Dev Crowdfunding</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Local design team in Ggaba, Uganda is assembling solar-powered Braille mechanical panels. Match funding is pooled using Airtel/MoMo wallets.
          </p>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Goal Raised ($)</span>
              <span className="text-slate-200 font-bold">${fundingGoal.raised} / ${fundingGoal.target}</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(fundingGoal.raised / fundingGoal.target) * 100}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => {
              setFundingGoal((prev) => ({ ...prev, raised: prev.raised + 10 }));
              setBalance((prev) => ({ ...prev, USD: prev.USD - 10 }));
              alert("Thank you! Contributed $10 to Braille mechanical panels. Your matched balance was debited.");
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] rounded-lg py-2 cursor-pointer"
          >
            Sponsor $10 from balance
          </button>
        </div>
      </div>

      {/* Invoicing and transactions column */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoicing form */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="font-display font-medium text-slate-200 text-sm mb-1.5 flex items-center gap-2">
              📜 Instat-Invoice System
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Issue remote compliant contracting invoices with direct Stripe and mobile money routing anchors.
            </p>
          </div>

          <form onSubmit={handleInvoiceSubmit} className="space-y-3 mt-4">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Send Invoice To (Corporate Email)</label>
              <input
                type="email"
                required
                value={invoiceTo}
                onChange={(e) => setInvoiceTo(e.target.value)}
                placeholder="billing@safricom.co.ke"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Invoice Value Amount (USD)</label>
              <input
                type="number"
                required
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                placeholder="250"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slice-100 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl py-2.5 cursor-pointer"
            >
              Issue Digital Invoice
            </button>
          </form>
        </div>

        {/* Recent Transactions List */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between shadow-md h-full">
          <div>
            <h4 className="font-display font-medium text-slate-200 text-sm mb-3">Recent Transactions</h4>
            <div className="space-y-3 max-h-[220px] overflow-y-auto">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-200">{tx.type}</p>
                    <p className="text-[10px] text-slate-500">{tx.date} • {tx.provider} ({tx.refCode})</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono font-bold ${tx.type.includes("Invoiced") || tx.type.includes("Out") ? "text-slate-300" : "text-emerald-400"}`}>
                      {tx.type.includes("Invoiced") || tx.type.includes("Out") ? "-" : "+"}${tx.amount}
                    </p>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 2. ACCESSIBLE TRANSPORT & WAYFINDING
// -----------------------------------------------------
export function TransportMap() {
  const [taxis, setTaxis] = useState<AccessibleTaxi[]>(initialTaxis);
  const [selectedTaxi, setSelectedTaxi] = useState<AccessibleTaxi | null>(null);
  const [routeInput, setRouteInput] = useState("");
  const [isRouting, setIsRouting] = useState(false);
  const [eta, setEta] = useState<number | null>(null);

  const handleDispatchTaxi = (taxi: AccessibleTaxi) => {
    setSelectedTaxi(taxi);
    // Move status to "En Route"
    setTaxis((prev) =>
      prev.map((t) => (t.id === taxi.id ? { ...t, status: "En Route" } : t))
    );
    alert(`Dispatch payload submitted to ${taxi.driverName}. Your wheelchair ramp taxi will arrive in ${taxi.distanceMinutes} minutes.`);
  };

  const handleEstimateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeInput) return;

    setIsRouting(true);
    setTimeout(() => {
      setIsRouting(false);
      setEta(22); // Calculated 22 minutes wheelchair optimized route
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="transport-panel">
      {/* Route Plotting Column */}
      <div className="lg:col-span-4 space-y-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg">
          <h3 className="font-display font-medium text-slate-100 text-sm mb-3">Accessible Route Planner</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            AOS spatial guidance computes step-free transit corridors, audited wheelchair ramps, and vocal wayfinding paths across Africa.
          </p>

          <form onSubmit={handleEstimateRoute} className="space-y-4">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Destination Address Coordinates</label>
              <input
                type="text"
                required
                value={routeInput}
                onChange={(e) => setRouteInput(e.target.value)}
                placeholder="e.g. Kigali Convention Centre and Serena Wing..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isRouting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl py-2.5 transition-colors cursor-pointer"
            >
              {isRouting ? "Calculating Accessibility Vectors..." : "Compute Safe Wheelchair Route"}
            </button>
          </form>

          {eta && (
            <div className="mt-4 p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-xs space-y-1">
              <p className="text-indigo-400 font-semibold flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Transit Route Formulated
              </p>
              <p className="text-slate-300 leading-snug">
                Step-Free accessible boardwalk calculated. Estimated ETA: <strong className="font-mono text-emerald-400">{eta} mins</strong> text alerts dispatched to your mobile.
              </p>
            </div>
          )}
        </div>

        {/* Dispatch details and training credentials */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-sm">
          <h4 className="font-display font-medium text-slate-200 text-xs mb-3">Driver Disability Training Program</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All registered Taxi network operators undergo extensive assistive device training, wheelchair restraint harness guidelines, and basic sign communication.
          </p>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-indigo-400 font-mono">
            <span>Verified Inclusive Cabs</span>
            <span>100% Audit Star</span>
          </div>
        </div>
      </div>

      {/* Available Cabs Listing Map Column */}
      <div className="lg:col-span-8 space-y-4">
        <div className="relative glass-panel rounded-2xl border border-slate-800 p-4 shadow-xl select-none bg-slate-950/20 overflow-hidden h-[260px] flex items-center justify-center">
          {/* Spatial Grid representation representing Map */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative text-center max-w-sm space-y-1.5 z-10">
            <MapPin className="w-10 h-10 text-indigo-500 mx-auto animate-bounce" />
            <h4 className="font-display font-medium text-slate-200 text-sm">Interactive GPS Waypoint Plotter</h4>
            <p className="text-xs text-slate-500">
              Active dispatch tracking hub for Kigali, Nairobi, Cape Town, and Lagos corridors. Driver telemetry matches standard transit.
            </p>
          </div>
        </div>

        {/* Taxi Card Listing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {taxis.map((taxi) => (
            <div key={taxi.id} className="glass-card p-4 rounded-xl border border-slate-800/80 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-200">{taxi.driverName}</span>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">★{taxi.rating}</span>
                </div>
                <p className="text-[11px] text-slate-400">{taxi.vehicleType}</p>
                <div className="flex flex-wrap gap-1 pt-1.5">
                  {taxi.accessibilityFeatures.map((feat, i) => (
                    <span key={i} className="text-[9px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded leading-none shrink-0">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">ETA {taxi.distanceMinutes} Mins</span>
                <button
                  onClick={() => handleDispatchTaxi(taxi)}
                  disabled={taxi.status === "En Route"}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    taxi.status === "En Route"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {taxi.status === "En Route" ? "Cab Assigned" : "Request Ride"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 3. AI CAREER & INTERVIEW COACH
// -----------------------------------------------------
export function CareerCoach() {
  const [jobTitle, setJobTitle] = useState("Junior Web Accessibility Specialist");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [recordedSpeechText, setRecordedSpeechText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<any>(null);

  const mockQuestions = [
    "Tell us about a time you optimized an interface for screen-reader tab index traversal.",
    "Explain how you approach testing visual color-contrast under WCAG 2.2 principles.",
    "How do you configure mobile money SMS triggers for blind commuters in East Africa?",
  ];

  const handleRunCVAnalysis = async () => {
    if (!recordedSpeechText.trim()) return;
    setLoading(true);
    setFeedbackResult(null);

    try {
      const resp = await fetch("/api/interview-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          questionSelected: mockQuestions[questionIndex],
          userTranscript: recordedSpeechText,
        }),
      });
      const data = await resp.json();
      if (data.success && data.feedback) {
        setFeedbackResult(data.feedback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateAudioResponse = () => {
    // Fill response text representing vocal answers
    const simulatedAnswers = [
      "I structured the main navigation of standard web views using semantic landmarks. By organizing tabIndex systematically into structured headers, blind screen reader users skipped menu logs.",
      "My color contrast design auditing utilized high-contrast buttons paired with dark visual glare filters. This direct modification shifted average WCAG scores from fail to gold compliance rating.",
    ];
    setRecordedSpeechText(simulatedAnswers[questionIndex % simulatedAnswers.length]);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="career-coach-panel">
      {/* Question Selector and Vocal Input */}
      <div className="xl:col-span-4 flex flex-col gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h2 className="font-display font-medium text-slate-100 text-sm">AI Interview Coaching Core</h2>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Target job Position Sector</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Active Mock Interview Question ({questionIndex + 1}/{mockQuestions.length})</span>
            <p className="text-slate-200 font-semibold text-xs leading-normal mt-1">"{mockQuestions[questionIndex]}"</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Your Vocal Practice Answer Transcript</span>
              <button
                type="button"
                onClick={handleSimulateAudioResponse}
                className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                🪄 Simulate vocal transcript
              </button>
            </div>
            <textarea
              value={recordedSpeechText}
              onChange={(e) => setRecordedSpeechText(e.target.value)}
              placeholder="Record speech aloud or type responsive answers here..."
              className="w-full bg-slate-900 border border-slate-800/80 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none h-28 font-sans resize-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setQuestionIndex((prev) => (prev + 1) % mockQuestions.length)}
              className="flex-1 bg-slate-805 bg-slate-800 hover:bg-slate-705 text-slate-300 font-semibold text-xs rounded-xl py-2.5 transition-colors cursor-pointer"
            >
              Skip Question
            </button>
            <button
              onClick={handleRunCVAnalysis}
              disabled={loading || !recordedSpeechText.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl py-2.5 transition-colors cursor-pointer"
            >
              {loading ? "Counseling answer..." : "Submit Answer For Review"}
            </button>
          </div>
        </div>

        {/* Remote Work Readiness Checklist */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <h4 className="font-display font-medium text-slate-200 text-xs mb-3 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-slate-400" /> Career Audit Standard
          </h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Remote timezone preparation completed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Accessibility tester credentials saved</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Stripe payment payouts connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Review Results Feed Column */}
      <div className="xl:col-span-8">
        {feedbackResult ? (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-5 animate-fade-in">
            {/* Confidence Score Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-display font-medium text-slate-100 text-base">Vocal Coaching Analysis</h3>
                <p className="text-xs text-slate-400 mt-0.5">Mock results analyzed across Star criteria metrics.</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono">CONFIDENCE SCORE</span>
                <p className="text-2xl font-mono font-bold text-emerald-400">{feedbackResult.confidenceScore}/100</p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">✔ Strong delivery features</h4>
                <ul className="space-y-2">
                  {feedbackResult.strengths.map((str: string, i: number) => (
                    <li key={i} className="bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/10 text-slate-350">
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-amber-400 uppercase tracking-wider text-[10px]">⚠ Enhancement Areas</h4>
                <ul className="space-y-2">
                  {feedbackResult.weaknesses.map((weak: string, i: number) => (
                    <li key={i} className="bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10 text-slate-350">
                      {weak}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Resume enhancements & suggested expressions */}
            <div className="pt-3 border-t border-slate-800/80 space-y-4 text-xs font-sans">
              <div>
                <h4 className="font-semibold text-indigo-400">💡 Resume/CV Bullet-Point Enhancement:</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-900 border border-slate-850 p-3 rounded-xl inline-block mt-1 font-mono">
                  {feedbackResult.cvEnhancements}
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2 mt-2">
                <h4 className="font-semibold text-indigo-300">🚀 Key Phrases To Try:</h4>
                <div className="space-y-1 px-1 text-slate-300 leading-relaxed font-sans">
                  {feedbackResult.suggestedPhraes ? (
                    feedbackResult.suggestedPhraes.map((ph: string, idx: number) => (
                      <p key={idx} className="flex gap-2 items-center text-xs">
                        <span className="text-indigo-400 font-bold">•</span> "{ph}"
                      </p>
                    ))
                  ) : (
                    <p className="italic text-slate-500">No expressions mapped.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 border border-slate-800/80 flex flex-col items-center justify-center h-full">
            <Sparkles className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <h3 className="font-display font-medium text-slate-300 mb-1 text-sm">Vocal Trainer Ready</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Press "Simulate vocal transcript" or type your spoken response, and click "Submit Answer For Review" to activate our neural confidence analyzers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 4. DISABILITY DIGITAL IDENTITY (D-ID)
// -----------------------------------------------------
export function DigitalId() {
  const [biometrics, setBiometrics] = useState(true);
  const [profilePreferences, setProfilePreferences] = useState({
    hearScreenReaderPrompts: true,
    fontScalingIndex: 110,
    momoVocalToggles: true,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="digital-id-panel">
      {/* Identity Card Representation */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="relative w-full max-w-[340px] h-[480px] rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-950 to-indigo-950 border border-indigo-500/20 shadow-2xl p-6 overflow-hidden flex flex-col justify-between">
          {/* Spatial Grid patterns overlay representing trust */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Secure Header */}
          <div className="relative flex justify-between items-center z-10">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold leading-none uppercase">AFRICA UNION ASSISTIVE PASSPORT</span>
            <Shield className="w-4.5 h-4.5 text-emerald-400" />
          </div>

          {/* Biometrics biometric simulation marker */}
          <div className="relative text-center space-y-2 mt-4 z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border border-indigo-500/30 bg-slate-900/80 flex items-center justify-center p-3 text-indigo-300 select-none">
              <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "20s" }} />
            </div>
            <div>
              <h4 className="font-display font-semibold text-slate-100 text-[14px] leading-snug">Prince Mugabe</h4>
              <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">DID #AOS-8742-991</p>
            </div>
          </div>

          {/* Credentials list */}
          <div className="relative space-y-2 mt-4 z-10 text-xs text-left">
            <div className="flex justify-between border-b border-indigo-500/10 pb-1 px-1">
              <span className="text-slate-500 font-sans text-[10.5px]">Inclusive Specialty</span>
              <span className="text-indigo-400 font-semibold font-mono">Web Auditor</span>
            </div>
            <div className="flex justify-between border-b border-indigo-500/10 pb-1 px-1">
              <span className="text-slate-500 font-sans text-[10.5px]">Trust Network Rating</span>
              <span className="text-emerald-400 font-mono font-bold">98% Grade A</span>
            </div>
            <div className="flex justify-between pb-0.5 px-px">
              <span className="text-slate-500 font-sans text-[10.5px]">Stripe Payout Status</span>
              <span className="text-slate-200 font-semibold">Active & Audited</span>
            </div>
          </div>

          {/* Verification Stamp footer */}
          <div className="relative pt-3 border-t border-indigo-500/10 flex justify-between items-center text-[10px] z-10">
            <div className="space-y-0.5">
              <span className="text-slate-500 block">LAST RE-VERIFIED</span>
              <span className="text-slate-300 font-mono font-bold">2026-05-28</span>
            </div>
            <span className="bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase scale-90">
              Verified Union
            </span>
          </div>
        </div>
      </div>

      {/* Trust credentials preferences management */}
      <div className="lg:col-span-7 space-y-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="font-display font-medium text-slate-100 text-sm">Self-Sovereign Identity Preferences</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your Disability Digital Identity (D-ID) allows you to securely share audited skills, credentials, and accessibility preferences with remote employers or regional medical agencies.
          </p>

          <div className="space-y-4 pt-2 border-t border-slate-850">
            {/* Control 1 */}
            <div className="flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-250">Cryptographic Biometrics Face/Voice lock</p>
                <p className="text-[10px] text-slate-500">Sign transaction payouts and dashboard lock using facial or voice matches</p>
              </div>
              <input
                type="checkbox"
                checked={biometrics}
                onChange={(e) => setBiometrics(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Control 2 */}
            <div className="flex justify-between items-center text-xs">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-250">Vocal screen-reader accessibility prompts</p>
                <p className="text-[10px] text-slate-500">Enable automatic text-to-speech voicing when hovering interactive elements</p>
              </div>
              <input
                type="checkbox"
                checked={profilePreferences.hearScreenReaderPrompts}
                onChange={(e) =>
                  setProfilePreferences({ ...profilePreferences, hearScreenReaderPrompts: e.target.checked })
                }
                className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </div>

            {/* Font Control */}
            <div className="space-y-2 pt-2 border-t border-slate-850">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Adaptive Global Font Magnification</span>
                <span className="font-mono text-indigo-400 font-bold">{profilePreferences.fontScalingIndex}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="150"
                value={profilePreferences.fontScalingIndex}
                onChange={(e) =>
                  setProfilePreferences({ ...profilePreferences, fontScalingIndex: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 5. SIGN LANGUAGE AI
// -----------------------------------------------------
export function SignLanguageAi() {
  const [inputText, setInputText] = useState("HELLO");
  const [activeSymbol, setActiveSymbol] = useState<SignLanguageSymbol | null>(initialSignLanguage[0]);
  const [animIndex, setAnimIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimIndex((prev) => (prev + 1) % 4);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTranslateString = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim().toUpperCase();
    const match = initialSignLanguage.find((sig) => sig.word.includes(query) || query.includes(sig.word));
    if (match) {
      setActiveSymbol(match);
    } else {
      setActiveSymbol({
        word: query || "UNKNOWN",
        keyframes: ["scale-100", "scale-105 rotate-6", "scale-95 -rotate-6", "scale-100"],
        description: `Custom translation: wave hands outwards in a sweeping horizontal gesture for "${query}".`,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sign-language-panel">
      {/* Translation query form */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="font-display font-medium text-slate-100 text-sm">Real-Time Sign Language Translator</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate custom speech-to-gesture sign overlays instantly. Enter any English word or sentence.
          </p>

          <form onSubmit={handleTranslateString} className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Enter Phrase / Word</label>
              <input
                type="text"
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. hello, thank you, accessible"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500 uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl py-2 cursor-pointer"
            >
              Translate to Avatar Gesture
            </button>
          </form>

          {activeSymbol && (
            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/10 text-xs">
              <span className="text-[10px] text-slate-500 font-mono">GESTURE TRANSLATION PATH</span>
              <p className="text-slate-200 mt-1 font-semibold">Word: "{activeSymbol.word}"</p>
              <p className="text-slate-400 leading-normal mt-1">{activeSymbol.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Avatar Simulator column */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div className="relative glass-panel rounded-2xl border border-slate-800 shadow-xl overflow-hidden h-[330px] flex items-center justify-center bg-slate-950/40">
          <div className="absolute inset-x-0 bottom-4 text-center">
            <span className="text-[10px] bg-slate-900/80 border border-slate-800 text-slate-450 px-3 py-1 rounded-full font-mono uppercase tracking-widest text-slate-350">
              Avatar Gesture: {activeSymbol ? activeSymbol.word : "IDLE"}
            </span>
          </div>

          {/* Interactive animated vector hand elements using simple classes */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-28 h-28 rounded-full border border-indigo-500/20 bg-gradient-to-tr from-indigo-500/10 to-transparent flex items-center justify-center shadow-inner transition-all duration-1000 ${
                activeSymbol ? activeSymbol.keyframes[animIndex] : "scale-100"
              }`}
            >
              <Video className="w-10 h-10 text-indigo-400" />
            </div>

            {/* Ripple ring indicators representing spatial hand tracks */}
            <div className={`absolute w-36 h-36 rounded-full border border-indigo-500/10 animate-ping opacity-25`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 6. ENTERPRISE MARKET INTELLIGENCE & HEATMAPS
// -----------------------------------------------------
export function MarketIntelligence() {
  const [selectedHub, setSelectedHub] = useState("Nairobi");

  const analyticsData = [
    { name: "Jan", EmploymentIndex: 68, CertifiedFirms: 12, RevenueSaaS: 1800 },
    { name: "Feb", EmploymentIndex: 72, CertifiedFirms: 14, RevenueSaaS: 2400 },
    { name: "Mar", EmploymentIndex: 75, CertifiedFirms: 18, RevenueSaaS: 2900 },
    { name: "Apr", EmploymentIndex: 78, CertifiedFirms: 19, RevenueSaaS: 3400 },
    { name: "May", EmploymentIndex: 84, CertifiedFirms: 25, RevenueSaaS: 4900 },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="market-int-panel">
      {/* Index list */}
      <div className="xl:col-span-4 space-y-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <h3 className="font-display font-medium text-slate-100 text-sm mb-3 flex items-center gap-1.5">
            <PieChart className="w-4.5 h-4.5 text-indigo-400" /> Regional Tech Hub Integrity
          </h3>
          <p className="text-xs text-slate-450 text-slate-400 leading-relaxed mb-4">
            AOS indexes accessibility scores of regional centers, verifying disability tech deployments and corporate compliance ratings.
          </p>

          <div className="space-y-2">
            {[
              { city: "Kigali", score: 91, progress: "91%", color: "text-emerald-400 bg-emerald-500" },
              { city: "Nairobi", score: 85, progress: "85%", color: "text-indigo-400 bg-indigo-500" },
              { city: "Lagos", score: 72, progress: "72%", color: "text-amber-400 bg-amber-500" },
              { city: "Johannesburg", score: 94, progress: "94%", color: "text-emerald-400 bg-emerald-500" },
            ].map((hub) => (
              <button
                key={hub.city}
                onClick={() => setSelectedHub(hub.city)}
                className={`w-full text-xs p-2.5 rounded-xl border flex justify-between items-center transition-all cursor-pointer ${
                  selectedHub === hub.city
                    ? "bg-indigo-600/10 border-indigo-500/30 font-semibold"
                    : "bg-slate-900/60 hover:bg-slate-800 border-slate-850"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-slate-200">{hub.city} Hub Compliance</span>
                  <span className="text-[10px] text-slate-500">Employment Integration</span>
                </div>
                <div className="text-right">
                  <span className={`font-mono font-bold ${hub.color.split(" ")[0]}`}>{hub.score}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics chart and predictions */}
      <div className="xl:col-span-8 flex flex-col justify-between">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-2xl space-y-4 flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-display font-medium text-slate-200 text-sm">Revenue SaaS & Employment Index Dynamics</h4>
              <p className="text-[11px] text-slate-500">Quarterly growth metrics across audited inclusive startups.</p>
            </div>
            <span className="text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 font-mono px-2.5 py-1 rounded-xl">
              Hub active: {selectedHub}
            </span>
          </div>

          {/* Recharts Graphical Chart Area */}
          <div className="w-full h-[220px] pt-3 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f1f5f9" }} />
                <Legend />
                <Area type="monotone" dataKey="RevenueSaaS" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" />
                <Bar dataKey="EmploymentIndex" barSize={12} fill="#10b981" />
                <Line type="monotone" dataKey="CertifiedFirms" stroke="#f59e0b" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 7. ACCESSIBLE TOURISM directory
// -----------------------------------------------------
export function TourismPlatform() {
  const [spots, setSpots] = useState<TourismSpot[]>(initialTourismSpots);

  return (
    <div className="space-y-4" id="tourism-panel">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="font-display font-medium text-slate-100 text-sm">Inclusive African Tourism Hub</h3>
          <p className="text-xs text-slate-400">Audited accessible destinations, roll-in walkways, and specialized local tour support.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {spots.map((spot) => (
          <div key={spot.id} className="glass-card p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-indigo-500/15 border border-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded uppercase">
                  {spot.category}
                </span>
                <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold font-mono">
                  ★ {spot.accessibilityRating}.0
                </div>
              </div>

              <h4 className="font-display font-medium text-slate-100 text-[13.5px] leading-snug">{spot.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium">Location: {spot.region} • Range: {spot.priceRange}</p>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-[9.5px] uppercase font-bold text-slate-500 tracking-wider">Audited Features:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {spot.features.map((feat, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-900 text-slate-350 border border-slate-850 px-2 py-0.5 rounded leading-normal shrink-0">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Initiating audio-guided booking coordinates for: ${spot.name}`)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 text-xs font-semibold rounded-xl py-2 cursor-pointer"
            >
              Book Accessible Wing
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 8. VOICE COMMAND HELPER / AUDIO CONTROLLER
// -----------------------------------------------------
interface VoiceModeProps {
  onNavigationSelect: (app: any) => void;
  activeApp: string;
}

export function VoiceCommandHelper({ onNavigationSelect, activeApp }: VoiceModeProps) {
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleTriggerSpeechRecognition = () => {
    if (listening) {
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Manual trigger mock if API is unsupported inside the sandbox iframe
      setListening(true);
      setFeedback("Listening... Say: 'open wallet' or 'open scanner'...");
      setTimeout(() => {
        const commands = ["copilot", "scanner_engine", "fintech", "biz_creator"];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        onNavigationSelect(randomCommand);
        setFeedback(`Executed voice redirection: Opening ${randomCommand.toUpperCase()} panel.`);
        setListening(false);
      }, 3000);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.lang = "en-US";
    recognizer.interimResults = false;

    recognizer.onstart = () => {
      setListening(true);
      setFeedback("Vocal command line online... speak now...");
    };

    recognizer.onerror = () => {
      setListening(false);
      setFeedback("Voice check failed. Using fallback simulation.");
    };

    recognizer.onend = () => {
      setListening(false);
    };

    recognizer.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript.toLowerCase();
      setFeedback(`Recognized command phrase: "${resultText}"`);

      if (resultText.includes("wallet") || resultText.includes("finance") || resultText.includes("pay")) {
        onNavigationSelect("fintech");
      } else if (resultText.includes("scanner") || resultText.includes("audit") || resultText.includes("wcag")) {
        onNavigationSelect("scanner_engine");
      } else if (resultText.includes("assistant") || resultText.includes("jarvis") || resultText.includes("life")) {
        onNavigationSelect("copilot");
      } else if (resultText.includes("business") || resultText.includes("creator") || resultText.includes("startup")) {
        onNavigationSelect("biz_creator");
      } else if (resultText.includes("developer") || resultText.includes("api") || resultText.includes("token")) {
        onNavigationSelect("api_platform");
      } else if (resultText.includes("transit") || resultText.includes("taxi") || resultText.includes("transport")) {
        onNavigationSelect("transport");
      } else {
        setFeedback(`Unmapped phrase: "${resultText}". Redirecting to Copilot assistant.`);
        onNavigationSelect("copilot");
      }
    };

    recognizer.start();
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 shadow-md flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleTriggerSpeechRecognition}
          className={`p-3 rounded-xl border transition-all cursor-pointer shrink-0 ${
            listening
              ? "bg-red-500 border-red-400 text-white animate-pulse"
              : "bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white"
          }`}
          title="Voice Control Platform Toggle"
        >
          <Phone className="w-5 h-5" />
        </button>
        <div>
          <h4 className="font-display font-medium text-slate-100 text-xs flex items-center gap-1.5 leading-none">
            Vocal Navigation Active
          </h4>
          <p className="text-[10px] text-slate-400 mt-1">
            {listening ? feedback : "Press microphone button and say: 'open wallet' or 'open scanner' to route."}
          </p>
        </div>
      </div>

      <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 font-mono px-2 py-1 rounded">
        Active View: {activeApp.toUpperCase()}
      </span>
    </div>
  );
}

// -----------------------------------------------------
// 9. AI CONTENT CREATOR
// -----------------------------------------------------
export function ContentCreator() {
  const [topic, setTopic] = useState("");
  const [platformSelected, setPlatformSelected] = useState<"TikTok" | "YouTube" | "Blog">("TikTok");
  const [scriptResponse, setScriptResponse] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGenerateScript = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setScriptResponse("");

    setTimeout(() => {
      let script = "";
      if (platformSelected === "TikTok") {
        script = `🎬 **Platform: TikTok / Reels (Fast Pace)**\n\n**Visual Hook**: Point index finger to screen camera with giant text caption overlay: "Why 80 Million Africans are locked out of your website!"\n\n🎤 **Spoken Line (0:00 - 0:05)**: "Wait, do NOT make your next website without adding alternate image descriptions! Here is how..."\n\n🔍 **Action**: Show standard screen reader audio read-out overlay mock.\n\n📈 **Call to Action (0:12)**: "Scan your business URL instantly inside AbleOS for free!"`;
      } else if (platformSelected === "YouTube") {
        script = `🎥 **Platform: YouTube Video Script Blueprint**\n\n**Video Title Option**: "Building Silicon Savannah with Assistive Technology Guides"\n\n⏱ **Intro (0:00 - 1:30)**: Explaining the economic potential of disabled web design engineers in Rwanda and South Africa...\n\n🔨 **Section 2 (Demonstration)**: Walking through WCAG 2.2 color contrast parameters using AbleOS Developer APIs.\n\n🏆 **Resolution**: Outlining Tony Elumelu grants available for inclusive startups.`;
      } else {
        script = `✍ **Platform: Blog Post / LinkedIn Article**\n\n**Headline**: "Leveraging Self-Sovereign Identity for Disability Tech Hubs across East Africa"\n\n**Intro**: Standard web products frequently oversimplify accessibility compliance issues. Lived-experience perspectives from local African tech corridors prove assistive devises are scalable business sectors, not mere NGO exercises.\n\n**Key Takeaway**: Self-sovereign digital credentials reduce employment friction, matching remote contractors instantly with vetted Stripe payment routes.`;
      }
      setScriptResponse(script);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="content-creator-panel">
      {/* Parameters */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="font-display font-medium text-slate-100 text-sm">AI Content Creator Suite</h3>
          <p className="text-xs text-slate-400">Generate viral scripts for social platforms, inclusive captions, and marketing summaries instantly.</p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Your Topic or Accent theme</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Disability web design opportunities in Lagos"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400">Select Platform</label>
              <div className="flex gap-1">
                {(["TikTok", "YouTube", "Blog"] as const).map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setPlatformSelected(plat)}
                    className={`flex-1 text-xs py-1.5 rounded-lg border transition-all cursor-pointer ${
                      platformSelected === plat
                        ? "bg-indigo-600/15 border-indigo-500/20 text-indigo-300 font-semibold"
                        : "bg-transparent text-slate-500 border-transparent"
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateScript}
              disabled={generating || !topic.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl py-2.5 cursor-pointer"
            >
              {generating ? "Synthesizing Scripts..." : "Generate AI Script Outlines"}
            </button>
          </div>
        </div>
      </div>

      {/* Script response */}
      <div className="lg:col-span-7">
        {scriptResponse ? (
          <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 flex flex-col justify-between h-full shadow-2xl animate-fade-in">
            <div className="space-y-3 text-xs leading-relaxed">
              <span className="text-[10px] text-slate-500 uppercase font-bold text-slate-450 tracking-wider">Generated Content Output:</span>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed font-mono whitespace-pre-line text-slate-300">
                {scriptResponse}
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(scriptResponse);
                alert("Copied generated social script to clipboard!");
              }}
              className="w-full bg-slate-800 hover:bg-emerald-600 border border-slate-700 text-slate-200 text-xs rounded-xl py-2 flex items-center justify-center gap-1 cursor-pointer transition-colors mt-4"
            >
              <Copy className="w-3.5 h-3.5" /> Copy script code
            </button>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 border border-slate-800 flex flex-col items-center justify-center h-full">
            <Video className="w-12 h-12 text-slate-850 text-slate-750 mb-2" />
            <p className="text-xs">
              Formulate viral inclusive accessibility topics and click "Generate AI Script Outlines".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------
// 10. DISABILITY STARTUP INCUBATOR
// -----------------------------------------------------
export function StartupIncubator() {
  const [startups, setStartups] = useState<IncubatorStartup[]>(initialStartups);
  const [mentors, setMentors] = useState([
    { name: "Sipho Khumalo (Fintech Lead, Johannesburg)", booked: false },
    { name: "Anna Mary (Safaricom Foundation, Nairobi)", booked: false },
  ]);

  const handleBookMentor = (index: number) => {
    setMentors((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, booked: true } : m))
    );
    alert(`Booked introductory mentorship sandbox call with: ${mentors[index].name}. Invite calendar details sent.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="incubator-panel">
      {/* Incubation Pipeline List */}
      <div className="lg:col-span-8 space-y-4">
        <h3 className="font-display font-medium text-slate-100 text-sm">Disability Social Venture Pipeline</h3>
        <div className="space-y-3">
          {startups.map((start) => (
            <div key={start.id} className="glass-panel p-5 rounded-2xl border border-slate-850 shadow-md space-y-4 flex flex-col justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/15 text-indigo-300 font-mono px-2 py-0.5 rounded tracking-wide uppercase">
                      {start.stage}
                    </span>
                    <h4 className="font-display font-medium text-slate-100 text-[14px] mt-1.5">{start.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono">INVESTOR ENROLLMENT</span>
                    <p className="font-mono text-emerald-400 font-bold text-sm">{start.investorInterestPercentage}% interest</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-normal">{start.description}</p>
                <p className="text-[10px] text-slate-500">Founder: <strong className="text-slate-350">{start.founder}</strong> • Seeking seed capital: <strong className="text-indigo-400 font-mono">{start.fundingWanted}</strong></p>
              </div>

              {/* Mentors booked */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 items-center text-[10.5px]">
                <span className="text-slate-500 uppercase tracking-wider font-semibold">Registered Mentors:</span>
                {start.mentorsBooked.map((ment, i) => (
                  <span key={i} className="bg-slate-900 border border-slate-850 text-slate-300 px-2 py-0.5 rounded">
                    {ment}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mentors list & pitch scoring */}
      <div className="lg:col-span-4 space-y-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg space-y-4">
          <h3 className="font-display font-medium text-slate-100 text-xs flex items-center gap-1.5">
            <Users className="w-4.5 h-4.5 text-indigo-400" /> Book Sector Experts
          </h3>

          <div className="space-y-3">
            {mentors.map((m, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2 flex flex-col justify-between">
                <span className="text-xs text-slate-200 leading-tight block">{m.name}</span>
                <button
                  onClick={() => handleBookMentor(idx)}
                  disabled={m.booked}
                  className={`text-[10px] font-semibold py-1.5 rounded transition-colors cursor-pointer ${
                    m.booked
                      ? "bg-slate-900 border border-slate-850 text-slate-500"
                      : "bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {m.booked ? "Mentorship Call Booked" : "Schedule 15m Advisory Callback"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pitch decks guideline */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 space-y-3.5">
          <h4 className="font-display font-semibold text-slate-200 text-xs">Africa Investor Matchmaker Workspace</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Directly connect your generated AI startup ideas to over 40 global inclusive tech funds, specializing in African hardware and accessibility services.
          </p>
        </div>
      </div>
    </div>
  );
}
