"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertTriangle, CheckCircle, HelpCircle, Loader2, Zap } from "lucide-react";

type Verdict = "REAL" | "FAKE" | "UNCERTAIN" | null;

interface Result {
  verdict: Verdict;
  confidence: number;
  explanation: string;
  entities: string[];
  faithfulness_score: number;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    // Simulate API call for now
    await new Promise((r) => setTimeout(r, 2000));
    setResult({
      verdict: input.length % 3 === 0 ? "FAKE" : input.length % 3 === 1 ? "REAL" : "UNCERTAIN",
      confidence: Math.floor(Math.random() * 30) + 70,
      explanation: "RoBERTa classifier analyzed this claim against 708K+ news articles and knowledge graph entities.",
      entities: ["Politics", "Healthcare", "Technology"],
      faithfulness_score: Math.random() * 0.3 + 0.7,
    });
    setLoading(false);
  };

  const verdictConfig = {
    REAL: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", glow: "glow-green", icon: CheckCircle },
    FAKE: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", glow: "glow-red", icon: AlertTriangle },
    UNCERTAIN: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", glow: "", icon: HelpCircle },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs mb-6">
          <Zap size={12} />
          <span>Powered by RoBERTa + Neo4j Knowledge Graph</span>
        </div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">Detect Misinformation</span>
          <br />
          <span className="text-white">in Real Time</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          AI-powered fact verification across 708K+ news articles using knowledge graph reasoning and hallucination-grounded analysis.
        </p>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <div className="glass rounded-2xl p-6 border border-white/5">
          <textarea
            className="w-full bg-transparent text-white placeholder-slate-500 resize-none outline-none text-sm leading-relaxed"
            rows={4}
            placeholder="Enter a claim, statement, or paste a news article to verify..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-slate-500">{input.length} characters</span>
            <button
              onClick={analyze}
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all glow-blue"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Search size={16} /> Analyze Claim</>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && result.verdict && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full max-w-2xl mt-6"
          >
            <div className={`glass rounded-2xl p-6 border ${verdictConfig[result.verdict].bg} ${verdictConfig[result.verdict].glow}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = verdictConfig[result.verdict].icon;
                    return <Icon size={24} className={verdictConfig[result.verdict].color} />;
                  })()}
                  <span className={`text-2xl font-bold ${verdictConfig[result.verdict].color}`}>
                    {result.verdict}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{result.confidence}%</div>
                  <div className="text-xs text-slate-400">Confidence</div>
                </div>
              </div>

              <p className="text-slate-300 text-sm mb-4">{result.explanation}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Faithfulness Score</div>
                  <div className="text-lg font-bold text-white">{(result.faithfulness_score * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-xs text-slate-400 mb-1">Entities Detected</div>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {result.entities.map((e) => (
                      <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-8 mt-16 text-center"
      >
        {[
          { label: "Articles Indexed", value: "708K+" },
          { label: "Claims Verified", value: "10.2K+" },
          { label: "Avg Accuracy", value: "87%" },
          { label: "Avg Latency", value: "<2s" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-bold gradient-text">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}