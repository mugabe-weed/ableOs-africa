import React, { useState } from "react";
import { Search, Database, Award, ArrowUpRight, Cpu, Plus, Filter, CheckCircle, Clipboard } from "lucide-react";
import { initialOpportunities } from "../data/mockData";
import { Opportunity } from "../types";

export default function OpportunityEngine() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [activeTab, setActiveTab] = useState<"All" | "Grant" | "Tender" | "Remote Job" | "Fellowship">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [matchingOnly, setMatchingOnly] = useState(false);

  // New Opportunity modal/form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<Opportunity["type"]>("Grant");
  const [newProvider, setNewProvider] = useState("");
  const [newRegion, setNewRegion] = useState("");

  const handleSimulateScraping = () => {
    setIsScraping(true);
    setTimeout(() => {
      // Inject simulated newly scraped local tenders
      const scraped: Opportunity[] = [
        {
          id: `scraped-${Date.now()}`,
          title: "African Union Union Assistive Innovation Challege",
          type: "Grant",
          provider: "African Union Development Agency",
          amount: "$35,000 USD equity-free funding",
          deadline: "2026-11-30",
          region: "Pan-Africa",
          eligibility: ["Startup based in AU member states", "Include voice navigation controls", "Focused on rural digital literacy"],
          matchedPercentage: 94,
        },
        {
          id: `scraped-job-${Date.now()}`,
          title: "Accessible Content Creator Lead",
          type: "Remote Job",
          provider: "African Youth Inclusive Corp",
          amount: "NGN 850,000 (~$600 USD) / month",
          deadline: "2026-08-30",
          region: "Nigeria (Remote)",
          eligibility: ["Knowledge of alt text description mapping", "Excellent video editing skills", "Familiarity with screen-reader commands"],
          matchedPercentage: 90,
        },
      ];
      setOpportunities((prev) => [...scraped, ...prev]);
      setIsScraping(false);
    }, 2000);
  };

  const handleAddOpportunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProvider) return;
    const added: Opportunity = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      type: newType,
      provider: newProvider,
      amount: newAmount || "$5,000 USD",
      deadline: "2026-12-31",
      region: newRegion || "Pan-Africa",
      eligibility: ["Configured by self-profile guidelines", "Requires standard WCAG principles"],
      matchedPercentage: 85,
    };
    setOpportunities((prev) => [added, ...prev]);
    setShowAddForm(false);
    setNewTitle("");
    setNewProvider("");
    setNewAmount("");
    setNewRegion("");
  };

  const filtered = opportunities.filter((opp) => {
    const matchesTab = activeTab === "All" || opp.type === activeTab;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMatch = !matchingOnly || opp.matchedPercentage >= 90;
    return matchesTab && matchesSearch && matchesMatch;
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="opp-engine-panel">
      {/* Sidebar Controls */}
      <div className="xl:col-span-4 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-medium text-slate-100 flex items-center gap-1.5 text-sm">
              <Cpu className="w-4.5 h-4.5 text-indigo-400" /> Scraper Engine Controls
            </h3>
            <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-mono px-2 py-0.5 rounded-md">AI-Sync Node</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Our Automated Scraping Pipeline continuously monitors African government procurement logs, development banks, Safaricom/MTN grants, and remote job portals timezone-matched to Africa.
          </p>

          <button
            onClick={handleSimulateScraping}
            disabled={isScraping}
            className="w-full bg-slate-805 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium text-xs border border-indigo-500/20 rounded-xl py-3 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isScraping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                Scraping Regional Tenders...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Trigger Scraper Scan (Force Refresh)
              </>
            )}
          </button>
        </div>

        {/* Dynamic Criteria Matcher Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <h3 className="font-display font-medium text-slate-200 text-xs mb-3 flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-slate-400" /> Suitability Filters
          </h3>

          <div className="space-y-4">
            {/* Toggle 1 */}
            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-300">High Suitability Matches Only</span>
                <span className="text-[10px] text-slate-500">Filters opportunities matching over 90% suitability criteria</span>
              </div>
              <input
                type="checkbox"
                checked={matchingOnly}
                onChange={(e) => setMatchingOnly(e.target.checked)}
                className="w-4.5 h-4.5 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
              />
            </label>

            {/* Simulated Scraper Target Status */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Scraped Sources</span>
                <span className="text-indigo-400 font-mono font-semibold">14 Web Sources</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Timezone Matches</span>
                <span className="text-emerald-400 font-semibold">UTC -1 to UTC +4</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Last Database Pull</span>
                <span className="text-slate-500 font-mono">2 mins ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Listing View Column */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        {/* Search and Tab selectors */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search grants, tenders, regions..."
              className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(["All", "Grant", "Tender", "Remote Job", "Fellowship"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-medium font-sans px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800/80"
                }`}
              >
                {tab === "All" ? "📦 All Opportunities" : tab}
              </button>
            ))}
            <button
              onClick={() => setShowAddForm(true)}
              className="text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl flex items-center gap-1 transition-colors ml-auto cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Opportunity
            </button>
          </div>
        </div>

        {/* Add Opportunity Modal Inline Form */}
        {showAddForm && (
          <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 shadow-xl bg-slate-900/90 space-y-4 animate-fade-in">
            <h4 className="font-display font-medium text-slate-100 text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> Share Accessibility Opportunity
            </h4>

            <form onSubmit={handleAddOpportunitySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Title / Role / Scope</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Google Africa AI Access Grant"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Provider Institution</label>
                <input
                  type="text"
                  required
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  placeholder="e.g. Google philanthropy Hub"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Grant Value / Budget</label>
                <input
                  type="text"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. $25,000 USD equity-free"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Type Categories</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as Opportunity["type"])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                >
                  <option value="Grant">Grant</option>
                  <option value="Tender">Tender</option>
                  <option value="Remote Job">Remote Job</option>
                  <option value="Fellowship">Fellowship</option>
                  <option value="Funding">Funding</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-800 text-slate-300 text-xs rounded-xl px-4 py-2 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl px-4 py-2 cursor-pointer"
                >
                  Publish and Index
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Opportunity Card Listing */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((opp) => (
              <div
                key={opp.id}
                className="glass-card rounded-2xl p-5 border border-slate-805 border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
              >
                <div className="space-y-1.5 flex-1 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        opp.type === "Grant"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/10"
                          : opp.type === "Tender"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/10"
                          : opp.type === "Fellowship"
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/10"
                          : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/10"
                      }`}
                    >
                      {opp.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">{opp.region}</span>
                  </div>

                  <h4 className="font-display font-medium text-slate-100 text-[14px] leading-snug">{opp.title}</h4>
                  <p className="text-xs text-slate-400">
                    By <strong className="text-slate-300 font-medium">{opp.provider}</strong> • Budget:{" "}
                    <span className="font-mono text-indigo-400 font-semibold">{opp.amount}</span>
                  </p>

                  <div className="pt-2">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Required Criteria:</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {opp.eligibility.map((criteria, i) => (
                        <span
                          key={i}
                          className="text-[10.5px] bg-slate-900 text-slate-300 px-2 py-1 rounded-md border border-slate-800 inline-flex items-center gap-1 leading-none"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                          {criteria}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score and Apply area */}
                <div className="flex flex-col items-end gap-2 shrink-0 self-stretch justify-between md:justify-center border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500">AOS Suitability Match</span>
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-lg font-mono font-bold text-emerald-400">{opp.matchedPercentage}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Applying via AbleOS Digital Credentials to: ${opp.title}`)}
                    className="w-full bg-indigo-600/15 text-indigo-300 hover:bg-slate-700 hover:text-white border border-indigo-500/20 text-xs rounded-xl px-3 py-1.5 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    Auto-Apply Core Profile <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl flex flex-col items-center">
              <Clipboard className="w-10 h-10 text-slate-700 mb-2" />
              <p className="text-sm font-medium">No matching opportunities found.</p>
              <p className="text-xs text-slate-600 mt-1">Try resetting search filters or trigger a live scraper scan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline Spinner icon helper
function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
