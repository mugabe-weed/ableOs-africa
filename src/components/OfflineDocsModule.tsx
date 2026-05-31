import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  FileText,
  Save,
  Trash2,
  FilePlus,
  Compass,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  Calculator,
  Laptop
} from "lucide-react";
import { OfflineDocument } from "../types";

export default function OfflineDocsModule() {
  const [documents, setDocuments] = useState<OfflineDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState("");
  const [docCategory, setDocCategory] = useState<OfflineDocument["category"]>("Micro Note");
  const [docContent, setDocContent] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  // WCAG Contrast Checker State
  const [bgColor, setBgColor] = useState("#0f172a");
  const [fgColor, setFgColor] = useState("#38bdf8");
  const [contrastRatio, setContrastRatio] = useState<number | null>(null);
  const [contrastRating, setContrastRating] = useState<string>("");

  // Load default simulated data if localStorage is empty
  useEffect(() => {
    const stored = localStorage.getItem("aos_offline_docs");
    if (stored) {
      try {
        setDocuments(JSON.parse(stored));
      } catch (err) {
        console.error(err);
      }
    } else {
      const defaults: OfflineDocument[] = [
        {
          id: "doc-1",
          title: " Kigali Inclusive Transit Wayfinding Plan",
          category: "Business Blueprint",
          content: "TACTILE SPATIAL CALIBRATION DETAILS:\n- Procurement and positioning of 14 bluetooth locator guides near Kigali Bus Lanes.\n- Audio frequency tuning matched to Rwandan traffic ambient noise.\n- MTN MoMo billing sequence for taxi driver licenses set at 200 RWF / Month.",
          lastUpdated: "Today, 09:12 AM",
          synchronized: true
        },
        {
          id: "doc-2",
          title: "Safaricom Accessibility Tender Draft",
          category: "Regional Tender",
          content: "SUMMARY & SUBMISSION GUIDELINES:\n- Scope: Delivery of offline-first speech-to-tactile modules for agricultural communities in rural Kenya.\n- Target Region: Meru, Nakuru, and Eldoret nodes.\n- Value: $30,000 USD Grant Funding.",
          lastUpdated: "Yesterday, 04:30 PM",
          synchronized: false
        }
      ];
      setDocuments(defaults);
      localStorage.setItem("aos_offline_docs", JSON.stringify(defaults));
    }

    // Monitor real online status
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Save documents to localStorage and simulate sync
  const saveDocs = (newDocs: OfflineDocument[]) => {
    setDocuments(newDocs);
    localStorage.setItem("aos_offline_docs", JSON.stringify(newDocs));
  };

  // Create new blank document
  const handleCreateDocument = () => {
    const newDoc: OfflineDocument = {
      id: `doc-${Date.now()}`,
      title: "Untitled Notebook File",
      category: "Micro Note",
      content: "Type your notes, ideas, or proposals here. Your draft auto-saves locally in your browser workspace.",
      lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      synchronized: !simulatedOffline && isOnline
    };
    const updated = [newDoc, ...documents];
    saveDocs(updated);
    setSelectedDocId(newDoc.id);
    setDocTitle(newDoc.title);
    setDocCategory(newDoc.category);
    setDocContent(newDoc.content);
  };

  // Select document
  const handleSelectDoc = (doc: OfflineDocument) => {
    setSelectedDocId(doc.id);
    setDocTitle(doc.title);
    setDocCategory(doc.category);
    setDocContent(doc.content);
  };

  // Save edits
  const handleSaveEdits = () => {
    if (!selectedDocId) return;
    const updated = documents.map((doc) => {
      if (doc.id === selectedDocId) {
        return {
          ...doc,
          title: docTitle,
          category: docCategory,
          content: docContent,
          lastUpdated: "Just now",
          synchronized: !simulatedOffline && isOnline
        };
      }
      return doc;
    });
    saveDocs(updated);
  };

  // Delete document
  const handleDeleteDoc = (id: string) => {
    const updated = documents.filter((doc) => doc.id !== id);
    saveDocs(updated);
    if (selectedDocId === id) {
      setSelectedDocId(null);
      setDocTitle("");
      setDocContent("");
    }
  };

  // Push all unsynced documents to server simulation
  const handleSyncAll = () => {
    if (simulatedOffline || !isOnline) return;
    const synchronizedDocs = documents.map((doc) => ({
      ...doc,
      synchronized: true
    }));
    saveDocs(synchronizedDocs);
  };

  // Contrast Calculator Logic
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const parsedHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(parsedHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const getRelativeLuminance = (rgb: { r: number; g: number; b: number }) => {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  useEffect(() => {
    const rgbBg = hexToRgb(bgColor);
    const rgbFg = hexToRgb(fgColor);
    if (rgbBg && rgbFg) {
      const l1 = getRelativeLuminance(rgbFg);
      const l2 = getRelativeLuminance(rgbBg);
      const lMax = Math.max(l1, l2);
      const lMin = Math.min(l1, l2);
      const ratio = (lMax + 0.05) / (lMin + 0.05);
      const rounded = Math.round(ratio * 100) / 100;
      setContrastRatio(rounded);

      // Determine WCAG passing scores
      if (rounded >= 7) {
        setContrastRating("PASS AAA (Superior contrast)");
      } else if (rounded >= 4.5) {
        setContrastRating("PASS AA (Standard contrast compliance)");
      } else if (rounded >= 3) {
        setContrastRating("PASS AA LARGE ONLY (Small text fails)");
      } else {
        setContrastRating("FAIL (High accessibility strain)");
      }
    } else {
      setContrastRatio(null);
      setContrastRating("Invalid Hex codes");
    }
  }, [bgColor, fgColor]);

  // Network connection display helpers
  const effectiveOnline = isOnline && !simulatedOffline;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="offline-vault-panel">
      {/* Sidebar: Network status, diagnostic checks, USSD simulator */}
      <div className="lg:col-span-4 space-y-5">
        
        {/* Connection Widget */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-medium text-slate-100 flex items-center gap-2 text-sm">
              {effectiveOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Local Node Status: Online
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-rose-400 animate-bounce" />
                  Local Node Status: Offline
                </>
              )}
            </h3>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                effectiveOnline ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
              }`}
            >
              {effectiveOnline ? "CONNECTED" : "LOCAL CACHE MODE"}
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {effectiveOnline
              ? "Your client node is currently synchronized with the regional Africa cloud hub. AbleOS acts as a standard fast platform."
              : "Low-connectivity protection enabled! AbleOS triggers local Service Worker database routing. You can draft plans, compose templates, or work uninterrupted."}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSimulatedOffline(!simulatedOffline);
                // Trigger auto update for documents synchrony if moving online back
                if (simulatedOffline) {
                  const restoredDocs = documents.map(d => ({ ...d, synchronized: isOnline }));
                  setDocuments(restoredDocs);
                  localStorage.setItem("aos_offline_docs", JSON.stringify(restoredDocs));
                }
              }}
              className={`w-full text-xs font-semibold py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                simulatedOffline
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/20"
                  : "bg-slate-800 hover:bg-slate-700 text-rose-400 border-rose-500/15"
              }`}
            >
              {simulatedOffline ? "Restore Online Synced State" : "Simulate Low Bandwidth Disconnect"}
            </button>

            {!effectiveOnline && documents.some((d) => !d.synchronized) && (
              <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span className="text-[10px] text-indigo-300 leading-normal">
                  You have offline changes pending sync. When you restore online state, click "Sync Vault" below.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Local WCAG Contrast Tools */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <h3 className="font-display font-medium text-slate-100 flex items-center gap-2 text-xs mb-3">
            <Calculator className="w-4 h-4 text-indigo-300" /> Offline WCAG Contrast Ratio tool
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            A 100% client-side tool used to test interface readability when auditing regional site proposals with no telemetry or internet calls.
          </p>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Background Hex</label>
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 outline-none font-mono font-medium focus:border-indigo-500 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Foreground Hex</label>
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 outline-none font-mono font-medium focus:border-indigo-500 text-slate-100"
                />
              </div>
            </div>

            {/* Quick Palette Swapper */}
            <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none">
              <button
                onClick={() => { setBgColor("#0f172a"); setFgColor("#38bdf8"); }}
                className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded cursor-pointer shrink-0"
              >
                Twilight Slate
              </button>
              <button
                onClick={() => { setBgColor("#000000"); setFgColor("#facc15"); }}
                className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded cursor-pointer shrink-0"
              >
                Contrast Yellow
              </button>
              <button
                onClick={() => { setBgColor("#121212"); setFgColor("#ffffff"); }}
                className="text-[9px] bg-slate-900 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded cursor-pointer shrink-0"
              >
                Pure Standard BW
              </button>
            </div>

            {/* Contrast result badge */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 mt-2 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] text-slate-500 uppercase">Contrast Ratio</span>
                <span className="text-base font-mono font-bold text-emerald-400">{contrastRatio ? `${contrastRatio}:1` : "N/A"}</span>
              </div>
              <div
                className={`text-[10.5px] font-semibold flex items-center gap-1.5 ${
                  contrastRatio && contrastRatio >= 4.5 ? "text-emerald-400" : "text-amber-500"
                }`}
              >
                <span>{contrastRating}</span>
              </div>
            </div>

            {/* Simulated Live preview box */}
            <div
              className="p-3.5 rounded-xl border border-slate-800 text-center text-xs font-semibold"
              style={{ backgroundColor: bgColor, color: fgColor }}
            >
              Simulated Contrast Render Sample
            </div>
          </div>
        </div>

        {/* Offline USSD Telecom Simulator */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-medium text-slate-100 flex items-center gap-2 text-xs">
              <Laptop className="w-4.5 h-4.5 text-slate-400" /> Offline USSD/SMS Telecom Hub
            </h3>
            <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-500 font-mono px-1.5 py-0.5 rounded">GSM Proto</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            A sandbox for blind operators to access summaries of saved documents via offline GSM channels (*384# shortcodes) using zero battery data.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
            <p className="text-slate-500">// Simulated GPRS Packet Prompt</p>
            <p className="text-amber-400">dial (*288*72#):</p>
            <div className="bg-slate-950 p-2 border border-slate-800 text-xs rounded text-slate-100 select-none">
              <p className="font-semibold text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1">AbleOS Offline Telecom v1.2</p>
              <p>1. View Transit Wayfinding summary</p>
              <p>2. View Safaricom Draft summary</p>
              <p>3. Generate Invoice SMS string</p>
              <p className="text-slate-500">Reply code: [1-3]</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Column: Document workspace and offline list */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        
        {/* Document Grid & Creator Header */}
        <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <div>
            <h2 className="font-display font-medium text-slate-100 flex items-center gap-2 text-sm">
              <Compass className="w-4.5 h-4.5 text-indigo-400" /> Offline Protected Document Workspace
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">
              Active cached files: <strong className="text-slate-300 font-mono font-medium">{documents.length} files</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {documents.some(d => !d.synchronized) && effectiveOnline && (
              <button
                onClick={handleSyncAll}
                className="text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all animate-bounce"
              >
                <Zap className="w-3.5 h-3.5" /> Sync Vault Hub
              </button>
            )}
            <button
              onClick={handleCreateDocument}
              className="text-[11px] font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <FilePlus className="w-3.5 h-3.5" /> New Cache Draft
            </button>
          </div>
        </div>

        {/* Workspace Splitting Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-[500px]">
          
          {/* List of documents */}
          <div className="md:col-span-5 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-3 overflow-y-auto space-y-2">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                    selectedDocId === doc.id
                      ? "bg-indigo-500/10 border-indigo-500/50"
                      : "bg-slate-900/60 hover:bg-slate-800 border-slate-800/80 hover:border-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        doc.category === "Business Blueprint"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : doc.category === "Regional Tender"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-indigo-500/15 text-indigo-400"
                      }`}
                    >
                      {doc.category}
                    </span>
                    <span
                      className={`text-[9px] font-semibold ${
                        doc.synchronized ? "text-emerald-500" : "text-amber-500 animate-pulse"
                      }`}
                    >
                      {doc.synchronized ? "● SYNCED" : "● LOCAL CACHED"}
                    </span>
                  </div>

                  <h4 className="font-display font-medium text-slate-100 text-xs truncate leading-snug">{doc.title}</h4>
                  <p className="text-[10px] text-slate-500">Updated: {doc.lastUpdated}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 p-12 flex flex-col items-center">
                <FileText className="w-10 h-10 text-slate-700 mb-2" />
                <p className="text-xs font-semibold">Your Cached Vault is Empty.</p>
                <p className="text-[10px] text-slate-650 mt-1">Create a new local workspace document above.</p>
              </div>
            )}
          </div>

          {/* Active editor pane */}
          <div className="md:col-span-7 bg-slate-950/40 rounded-2xl border border-slate-800/80 p-4 flex flex-col justify-between">
            {selectedDocId ? (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-3 shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Workspace Document Editor</span>
                    <button
                      onClick={() => handleDeleteDoc(selectedDocId)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Cached draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Document Title</label>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => {
                          setDocTitle(e.target.value);
                          // Auto trigger edit tracking
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Module Category</label>
                      <select
                        value={docCategory}
                        onChange={(e) => setDocCategory(e.target.value as OfflineDocument["category"])}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 outline-none focus:border-indigo-500"
                      >
                        <option value="Business Blueprint">Business Blueprint</option>
                        <option value="Regional Tender">Regional Tender</option>
                        <option value="Micro Note">Micro Note</option>
                        <option value="Fintech Invoice">Fintech Invoice</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-h-0 pt-2">
                  <label className="block text-[10px] text-slate-500 mb-1">Document Content</label>
                  <textarea
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 outline-none resize-none font-mono focus:border-indigo-500 min-h-[160px]"
                    placeholder="Enter document outline..."
                  />
                </div>

                {/* Save controls */}
                <div className="pt-3 border-t border-slate-800 shrink-0 flex items-center justify-between">
                  <span className="text-[11px] text-indigo-400 flex items-center gap-1 leading-none font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved local storage
                  </span>

                  <button
                    onClick={handleSaveEdits}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl px-4 py-2 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes & Cache
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-8">
                <Compass className="w-12 h-12 text-slate-800 mb-3 animate-pulse" />
                <h4 className="font-display font-medium text-slate-300 mb-1 text-xs">No Workspace Item Selected</h4>
                <p className="text-[11px] text-slate-600 max-w-xs leading-relaxed">
                  Select a document from the left list to start viewing or editing cached templates offline.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
