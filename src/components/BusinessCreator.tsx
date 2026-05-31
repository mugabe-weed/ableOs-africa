import React, { useState } from "react";
import { Sparkles, Briefcase, Plus, BookOpen, Share2, Wallet, ArrowRight, RefreshCw, Send, Check } from "lucide-react";
import { BusinessPlan } from "../types";

export default function BusinessCreator() {
  const [idea, setIdea] = useState("");
  const [industry, setIndustry] = useState("Technology & Assistive Devices");
  const [focus, setFocus] = useState("Screen Readers & Speech Recognition");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [plan, setPlan] = useState<BusinessPlan | null>({
    businessName: "Sina Mobility Kigali",
    tagline: "Unlocking tactile spatial wayfinding for the blind tech corridor.",
    marketAnalysis: "With over 350,000 visually impaired residents in East Africa, there is an underserved market for reliable local spatial guides. Expanding public transit hubs in Rwanda represent our initial target sites.",
    businessModel: "Affordable B2B location-scoring dashboard licensing + free USSD SMS routes for general commuters.",
    disabilityLeverage: "Founded by visually impaired engineers, our physical testing of acoustics delivers superior calibration than baseline visual assumptions.",
    initialSteps: [
      "Acquire 10 physical prototype beacons.",
      "Integrate local USSD routing on Rwanda Telecom API Developer Sandbox.",
      "Conduct tactile walking audits of standard bus lanes in Kigali."
    ],
    momoPricingStrategy: "RWF 200 per monthly USSD routing subscription paid directly using MTN MoMo.",
    draftProposalHook: "Highly effective pitch: 'We are bridging standard transportation voids for blind Rwandans through spatial acoustics, opening independent daily operations for 350,000 commuters.'"
  });

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    try {
      const resp = await fetch("/api/business-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          industry,
          accessibilityFocus: focus,
        }),
      });
      const resData = await resp.json();
      if (resData.success && resData.data) {
        setPlan(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyProposal = () => {
    if (!plan) return;
    navigator.clipboard.writeText(plan.draftProposalHook);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="biz-creator-panel">
      {/* Parameter Entry Column */}
      <div className="xl:col-span-4 flex flex-col gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h2 className="font-display font-medium text-slate-100 text-sm">AI Business Incubator</h2>
          </div>

          <form onSubmit={handleCreateBusiness} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Your Core Startup Idea</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. Tactile acoustic maps for blind public transit riders or local physical micro-assembly of low-power braille displays..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none h-24 resize-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              >
                <option value="Technology & Assistive Devices">Technology & Assistive Devices</option>
                <option value="Inclusive Mobility & Freight">Inclusive Mobility & Freight</option>
                <option value="Fintech & Mobile Wallet Portals">Fintech & Mobile Wallet Portals</option>
                <option value="Education, Audio Learning & Maps">Education, Audio Learning & Maps</option>
                <option value="Tourism & Hospitality Auditing">Tourism & Hospitality Auditing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">Core Accessibility Accommodation</label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="e.g. Visually impaired accessibility, text-to-speech tutorials..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !idea.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Business Blueprint...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Formulate Venture Blueprint
                </>
              )}
            </button>
          </form>
        </div>

        {/* Enterprise Context Banner */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 shadow-sm bg-gradient-to-br from-indigo-950/20 to-slate-900/60">
          <h3 className="font-display font-medium text-slate-200 text-xs mb-1.5 flex items-center gap-2">
            💡 Monetization Framework
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All businesses incubated through AbleOS can directly integrate with MTN MoMo payout APIs or invoice using our embedded wallet. Build recurring enterprise contracts with African corporate partners.
          </p>
        </div>
      </div>

      {/* Result Display Column */}
      <div className="xl:col-span-8">
        {plan ? (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-5">
            {/* Header with Visual dynamic branding illustration */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                {/* Visual SVG Dynamic Logo Preview */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg text-slate-100 font-bold text-lg select-none">
                  {plan.businessName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-medium text-slate-100 text-lg">{plan.businessName}</h3>
                  <p className="text-xs text-indigo-400 italic font-medium">“{plan.tagline}”</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyProposal}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs rounded-xl px-3 py-2 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-slate-400" />}
                  {copied ? "Copied Pitch!" : "Copy Grant Pitch"}
                </button>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    🎯 Target Market & Regional Demand
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{plan.marketAnalysis}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    💰 Financial Model & Recurring MoMo Structure
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed font-mono">{plan.momoPricingStrategy}</p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    ♿ Disability Competitive Leverage
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{plan.disabilityLeverage}</p>
                </div>
              </div>

              {/* Startup Roadmap */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    🚀 Recommended Implementation Milestones
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {plan.initialSteps.map((step, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start text-slate-300">
                        <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Proposal Pitch Draft */}
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <h4 className="text-xs font-semibold text-indigo-400 mb-1">
                    📝 Investor Pitch / Africa Grant Pitch Hook
                  </h4>
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs italic text-slate-300 leading-relaxed font-mono">
                    "{plan.draftProposalHook}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-slate-800/80 shadow-lg text-center flex flex-col items-center justify-center h-full">
            <Sparkles className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <h3 className="font-display font-medium text-slate-300 mb-1 text-sm">Incubator Sandbox Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Enter details in the generator sidebar and click "Formulate Venture Blueprint" to harness AI startup intelligence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
