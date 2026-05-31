import React, { useState } from "react";
import { Terminal, Copy, Key, ShieldCheck, Check, Plus, Code, RefreshCw, BarChart2, Cpu } from "lucide-react";
import { initialDeveloperKeys } from "../data/mockData";
import { DeveloperApiKey } from "../types";

export default function ApiPlatform() {
  const [keys, setKeys] = useState<DeveloperApiKey[]>(initialDeveloperKeys);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [activePlayground, setActivePlayground] = useState<"ocr" | "tts" | "compliance">("ocr");
  const [newLabel, setNewLabel] = useState("");
  const [showAddKey, setShowAddKey] = useState(false);

  // Playground simulated outputs
  const [playgroundText, setPlaygroundText] = useState("");
  const [playgroundOutput, setPlaygroundOutput] = useState("");
  const [playgroundLoading, setPlaygroundLoading] = useState(false);

  const handleCreateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    const keyVal = `aos_live_${Math.random().toString(16).substring(2, 12)}${Math.random().toString(16).substring(2, 12)}`;
    const added: DeveloperApiKey = {
      id: `dev-key-${Date.now()}`,
      key: keyVal,
      label: newLabel,
      createdOn: new Date().toISOString().split("T")[0],
      callsThisMonth: 0,
      status: "Active",
    };
    setKeys((prev) => [...prev, added]);
    setNewLabel("");
    setShowAddKey(false);
  };

  const handleRevokeKey = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: k.status === "Active" ? "Revoked" : "Active" } : k))
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleRunPlaygroundSample = async () => {
    setPlaygroundLoading(true);
    setPlaygroundOutput("");
    
    // Simulating quick process delays
    setTimeout(() => {
      let output = "";
      if (activePlayground === "ocr") {
        output = `{\n  "status": "success",\n  "extracted_text": "Sina Mobility Hub Ltd Kigali. Total invoice outline: RWF 14,000.",\n  "confidence": 0.992,\n  "language": "kinyadv",\n  "elements": [\n    { "word": "Sina", "box": [12, 45, 24, 80] },\n    { "word": "Kigali", "box": [50, 45, 75, 80] }\n  ]\n}`;
      } else if (activePlayground === "tts") {
        output = `{\n  "status": "success",\n  "audio_format": "audio/wav",\n  "binary_length": 48200,\n  "sample_rate_hz": 24000,\n  "duration_seconds": 2.4,\n  "playback_url": "https://api.ableos.org/v2/tts/stream/aes34ba.wav"\n}`;
      } else {
        output = `{\n  "status": "compliant",\n  "compliance_rating": "AA",\n  "score": 93,\n  "critical_violations": [],\n  "scanned_elements_count": 52,\n  "recommendations": [\n    "Optimize contrast ratio on footer text of secondary menus."\n  ]\n}`;
      }
      setPlaygroundOutput(output);
      setPlaygroundLoading(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="api-platform-panel">
      {/* Dev Documentation and Playground */}
      <div className="xl:col-span-7 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-indigo-400" />
            <h2 className="font-display font-medium text-slate-100 text-sm">Developer API Playground</h2>
          </div>

          {/* Playground Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-3 mb-4">
            {(["ocr", "tts", "compliance"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setActivePlayground(mode);
                  setPlaygroundOutput("");
                  setPlaygroundText("");
                }}
                className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activePlayground === mode
                    ? "bg-indigo-600/15 text-indigo-300 border-indigo-500/20 font-semibold"
                    : "bg-transparent text-slate-400 hover:text-slate-300 border-transparent"
                }`}
              >
                {mode === "ocr" ? "📄 OCR Image Scan" : mode === "tts" ? "🔊 Text-To-Speech (TTS)" : "♿ Compliance Scan API"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">
                {activePlayground === "ocr"
                  ? "Image Input Source URL or base64 data"
                  : activePlayground === "tts"
                  ? "Enter sentence text to vocalize"
                  : "Copy HTML code chunk to audit"}
              </label>
              <textarea
                value={playgroundText}
                onChange={(e) => setPlaygroundText(e.target.value)}
                placeholder={
                  activePlayground === "ocr"
                    ? "https://ableos.org/assets/receipt.png"
                    : activePlayground === "tts"
                    ? "Welcome to Kigali. Standard payment dispatch is complete."
                    : "<main><img src='kigali.jpg'><h1 class='text-sm text-[#000]'>African tech hub</h1></main>"
                }
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none h-20 font-mono resize-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-between items-center bg-slate-900/60 px-3 py-2 rounded-xl text-[10.5px]">
              <span className="text-slate-500 font-mono">
                {activePlayground === "ocr"
                  ? "Endpoint: POST /api/v2/ocr/scan"
                  : activePlayground === "tts"
                  ? "Endpoint: POST /api/v2/tts/synthesize"
                  : "Endpoint: POST /api/v2/wcag/audit"}
              </span>
              <span className="text-indigo-400">Rate cost: $0.001 per query</span>
            </div>

            <button
              onClick={handleRunPlaygroundSample}
              disabled={playgroundLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {playgroundLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running API Query...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4" /> Issue Test API Payload
                </>
              )}
            </button>

            {/* Playground Response */}
            {playgroundOutput && (
              <div className="space-y-1 pt-2">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Response Payload (JSON):</span>
                <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-mono leading-relaxed overflow-x-auto select-all">
                  {playgroundOutput}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Strategy and Gateway Documentation */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
          <h3 className="font-display font-medium text-slate-200 text-xs mb-3 flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-slate-400" /> B2B Monetization Structure / Enterprise Scale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Free Dev Sandbox</p>
              <p className="text-slate-200 font-bold font-mono text-base mt-1">1,000</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Free Calls/Mo</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 text-center">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Growth API Tier</p>
              <p className="text-indigo-400 font-bold font-mono text-base mt-1">$49/Mo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Up to 100K queries</p>
            </div>
            <div className="p-3 bg-slate-900/50 rounded-xl border border-indigo-500/10 text-center bg-indigo-500/5">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">SaaS Enterprise</p>
              <p className="text-emerald-400 font-bold font-mono text-base mt-1">$299/Mo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Unlimited compilation scale</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Credentials Registry Column */}
      <div className="xl:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-4.5 h-4.5 text-indigo-400" />
              <h3 className="font-display font-medium text-slate-100 text-sm">Key Credentials Registry</h3>
            </div>
            <button
              onClick={() => setShowAddKey(true)}
              className="text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Generate Key
            </button>
          </div>

          {/* New Key Form Modal */}
          {showAddKey && (
            <form onSubmit={handleCreateKeySubmit} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 mb-4 space-y-3 animate-fade-in">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Key Label Name</label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. My Safaricom USSD portal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-1.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddKey(false)}
                  className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg hover:bg-slate-705 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-500 cursor-pointer"
                >
                  Validate
                </button>
              </div>
            </form>
          )}

          {/* Connected Keys List */}
          <div className="space-y-3">
            {keys.map((k) => (
              <div key={k.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <ShieldCheck className={`w-3.5 h-3.5 ${k.status === "Active" ? "text-emerald-400" : "text-rose-500"}`} />
                    {k.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      k.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    {k.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                  <span className="font-mono text-slate-400 truncate max-w-[200px]">{k.key}</span>
                  <button
                    onClick={() => copyToClipboard(k.key, k.id)}
                    className="text-slate-500 hover:text-slate-300 shrink-0 cursor-pointer"
                    title="Copy Key Token"
                  >
                    {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Created: {k.createdOn}</span>
                  <span>Month calls: <strong className="font-mono text-indigo-400">{k.callsThisMonth}</strong> / 10K limit</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    {k.status === "Active" ? "Revoke Access" : "Re-activate Access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Query Traffic Volume Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-sm space-y-3 text-sm">
          <h3 className="flex items-center gap-1.5 font-display font-medium text-slate-300 text-xs">
            <BarChart2 className="w-4 h-4 text-indigo-400" /> API Gateway Health
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Average Gateway Latency</span>
                <span className="text-emerald-400 font-bold">42 ms (Stable)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1">
                <div className="bg-emerald-500 h-1 rounded-full" style={{ width: "95%" }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Total System Calls (Daily)</span>
                <span className="text-indigo-400 font-bold">140,294 calls</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1">
                <div className="bg-indigo-500 h-1 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
