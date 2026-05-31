import React, { useState } from "react";
import { ShieldAlert, Fingerprint, Keyboard, Palette, Play, Sparkles, RefreshCw, CheckCircle, Code, HelpCircle, FileDown } from "lucide-react";
import { ScannerResult, ScannedViolation } from "../types";

export default function ScannerEngine() {
  const [siteUrl, setSiteUrl] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScannerResult | null>({
    score: 85,
    criticalViolations: [
      {
        element: "<button className='p-2 text-white bg-blue-300'>Add to Cart</button>",
        severity: "CRITICAL",
        wcagPrinciple: "Perceivable / Visual Contrast",
        description: "Button text contrast is 2.8:1, failing minimum WCAG AA threshold of 4.5:1.",
        remediation: "Double background shade opacity. Change class to bg-blue-800 or bg-indigo-700.",
      },
      {
        element: "<img src='rwanda_valley.png' />",
        severity: "CRITICAL",
        wcagPrinciple: "Robust / Alt Text Attributes",
        description: "Image component lacks alt text elements, forcing screen readers to skip vital visual context.",
        remediation: "Include structural alt descriptors, for example: alt='Sunrise over Rwandan agricultural tech valley'.",
      },
      {
        element: "div.expandable_menu_bar",
        severity: "WARNING",
        wcagPrinciple: "Operable / Focus outline",
        description: "Focus indicator rings are hidden globally via CSS, preventing keyboard-only users from locating elements.",
        remediation: "Ensure :focus outline classes are integrated into global themes instead of hidden.",
      },
    ],
    improvements: [
      "Ensure color alone is not utilized to convey status or error responses.",
      "Add explicit aria-labels on mobile menu icons and close dialog blocks.",
      "Incorporate responsive audio narrators on dynamic sliders.",
    ],
    deviceCompliance: {
      keyboardNavigation: "Fails: Tabindex loops are truncated inside secondary drawer items.",
      screenReaderOptimized: "90% Compliant: Structured ARIA-labels exist on body containers.",
      contrastGuidelines: "Needs Tuning: Visual metrics are safe, except for active button classes.",
    },
  });

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl && !sourceCode) return;

    setLoading(true);
    try {
      const resp = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteUrl, sourceCode }),
      });
      const data = await resp.json();
      if (data.success && data.reports) {
        setResults(data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity: ScannedViolation["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/15 border-red-500/20 text-red-400";
      case "WARNING":
        return "bg-amber-500/15 border-amber-500/20 text-amber-400";
      default:
        return "bg-emerald-500/15 border-emerald-500/20 text-emerald-400";
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="scanner-engine-panel">
      {/* File or URL target submitter */}
      <div className="xl:col-span-4 flex flex-col gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h2 className="font-display font-medium text-slate-100 text-sm">WCAG Multi-Engine Scan</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Audit your Africa fintech portal, government compliance nodes, or mobile e-commerce directories. Paste raw markup code or enter public URLs.
          </p>

          <form onSubmit={handleRunAudit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Scan Website URL Target</label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="e.g. https://safaricom.co.ke"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="text-center font-mono text-[10px] text-slate-600">— OR —</div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Audit HTML/JSX Code Fragment</label>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Paste code blocks here starting with <html>..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none h-32 font-mono resize-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!siteUrl && !sourceCode)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl py-3 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Auditing Code Components...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Run Accessibility Audit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic device compliance overview */}
        {results && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80">
            <h3 className="font-display font-medium text-slate-200 text-xs mb-3.5 flex items-center gap-2">
              <Fingerprint className="w-4.5 h-4.5 text-slate-400" /> Device Integrity Ledger
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Keyboard Navigation</span>
                <span className="text-slate-200">{results.deviceCompliance.keyboardNavigation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Screen Readers (NVDA)</span>
                <span className="text-slate-200">{results.deviceCompliance.screenReaderOptimized}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400">High Contrast Guidelines</span>
                <span className="text-slate-200">{results.deviceCompliance.contrastGuidelines}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results details panel */}
      <div className="xl:col-span-8 space-y-5">
        {results ? (
          <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 shadow-2xl space-y-6">
            {/* Visual Header Score Gauge */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                {/* Custom circular score dial using SVG */}
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke={results.score >= 90 ? "#10b981" : results.score >= 75 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="213.62"
                      strokeDashoffset={213.62 - (213.62 * results.score) / 100}
                    />
                  </svg>
                  <span className="absolute text-xl font-mono font-bold text-slate-100">{results.score}</span>
                </div>
                <div>
                  <h3 className="font-display font-medium text-slate-100 text-lg">Compliance Audit Overview</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analyzed under WCAG 2.2 AA standards criteria. Enterprise grade accessibility score calculated.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <span className="text-xs bg-slate-900 text-emerald-400 border border-slate-800 font-mono px-3 py-2 rounded-xl flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Approved Badge Grade
                </span>
                <button
                  onClick={() => alert("Downloading PDF Accessibility Compliance Report for standard audits.")}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl px-3 py-2 flex items-center gap-1 cursor-pointer"
                  title="PDF Download"
                >
                  <FileDown className="w-3.5 h-3.5" /> Download Report
                </button>
              </div>
            </div>

            {/* Critical Violations Listings */}
            <div className="space-y-4">
              <h4 className="font-display font-medium text-slate-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                🚨 Pinpointed Access Barriers
              </h4>

              <div className="space-y-3 font-sans">
                {results.criticalViolations.map((violation, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-2.5 ${getSeverityStyle(violation.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{violation.wcagPrinciple}</span>
                        <div className="font-semibold text-slate-100 text-[13.5px] mt-0.5">{violation.description}</div>
                      </div>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${getSeverityStyle(violation.severity)}`}>
                        {violation.severity}
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-sans uppercase font-bold mb-1">Target Element Code:</p>
                      <code className="text-[11px] text-rose-400 font-mono block break-all whitespace-pre-wrap">{violation.element}</code>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300">
                      <p className="text-[10px] text-emerald-400 font-mono uppercase font-bold mb-1">Recommended Remediation Line:</p>
                      <code className="text-[11.5px] text-emerald-300 font-mono block break-all whitespace-pre-wrap">{violation.remediation}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended improvements section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
                <h4 className="text-xs font-semibold text-indigo-400 mb-2.5 flex items-center gap-1">
                  💡 Additional Best Practices (AAA Suggestions)
                </h4>
                <ul className="space-y-2 text-xs">
                  {results.improvements.map((imp, idx) => (
                    <li key={idx} className="flex gap-2 items-start text-slate-300 leading-relaxed">
                      <span className="text-indigo-400 font-mono mt-0.5 shrink-0">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-950/10 to-slate-900 rounded-xl border border-indigo-500/10 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-indigo-400 mb-1 leading-none">Enterprise Compliance Verification</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    Your site can receive an official "Verified Accessible" emblem badge to publish on marketing channels, helping establish inclusive employment standards.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Yearly Subscription Access</span>
                  <span className="text-emerald-400 font-bold">$29 USD / month</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full">
            <ShieldAlert className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <h3 className="font-display font-medium text-slate-300 mb-1 text-sm">Auditor Engine Idle</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Paste source HTML or provide a live target URL, then select "Run Accessibility Audit" to parse WCAG barriers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
