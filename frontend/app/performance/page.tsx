"use client";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { Award, Target, Zap, Shield } from "lucide-react";

const confusionMatrix = [
  { label: "True → True", value: 89, color: "#22c55e" },
  { label: "True → False", value: 6, color: "#ef4444" },
  { label: "True → Uncertain", value: 5, color: "#f59e0b" },
  { label: "False → False", value: 84, color: "#22c55e" },
  { label: "False → True", value: 9, color: "#ef4444" },
  { label: "False → Uncertain", value: 7, color: "#f59e0b" },
];

const classMetrics = [
  { class: "True", precision: 88, recall: 91, f1: 89 },
  { class: "Half-True", precision: 72, recall: 68, f1: 70 },
  { class: "False", precision: 85, recall: 83, f1: 84 },
];

const radarData = [
  { metric: "Faithfulness", value: 87 },
  { metric: "Precision", value: 85 },
  { metric: "Recall", value: 83 },
  { metric: "F1 Score", value: 84 },
  { metric: "Adversarial", value: 91 },
  { metric: "Calibration", value: 79 },
];

const epochData = [
  { epoch: "Epoch 1", loss: 1.42, f1: 61 },
  { epoch: "Epoch 2", loss: 0.98, f1: 74 },
  { epoch: "Epoch 3", loss: 0.71, f1: 84 },
];

export default function Performance() {
  return (
    <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Model Performance</h1>
        <p className="text-slate-400 text-sm">RoBERTa fine-tuned on 10,240 LIAR dataset samples</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Weighted F1", value: "84.2%", icon: Award, color: "text-blue-400", glow: "glow-blue" },
          { label: "Adversarial Detection", value: "91.3%", icon: Shield, color: "text-green-400", glow: "glow-green" },
          { label: "Faithfulness Score", value: "87.1%", icon: Target, color: "text-cyan-400", glow: "" },
          { label: "Avg Inference", value: "1.8s", icon: Zap, color: "text-purple-400", glow: "" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass rounded-2xl p-5 border border-white/5 ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">{stat.label}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Training Curve */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4">Training Loss & F1 per Epoch</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={epochData}>
              <XAxis dataKey="epoch" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }} />
              <Bar dataKey="f1" fill="#3b82f6" radius={[4, 4, 0, 0]} name="F1 Score" />
              <Bar dataKey="loss" fill="#ef4444" radius={[4, 4, 0, 0]} name="Loss" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4">Model Capability Radar</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 10 }} />
              <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per Class Metrics */}
      <div className="glass rounded-2xl p-6 border border-white/5 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">Per-Class Metrics</h2>
        <div className="grid grid-cols-3 gap-4">
          {classMetrics.map((c) => (
            <div key={c.class} className="bg-white/5 rounded-xl p-4">
              <div className="text-sm font-semibold text-white mb-3">{c.class}</div>
              {[
                { label: "Precision", value: c.precision, color: "bg-blue-500" },
                { label: "Recall", value: c.recall, color: "bg-cyan-500" },
                { label: "F1", value: c.f1, color: "bg-green-500" },
              ].map((m) => (
                <div key={m.label} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="text-white">{m.value}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full">
                    <div className={`h-full ${m.color} rounded-full`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="text-sm font-semibold text-white mb-4">Prediction Breakdown</h2>
        <div className="grid grid-cols-3 gap-3">
          {confusionMatrix.map((item) => (
            <div key={item.label} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">{item.label}</span>
              <span className="text-lg font-bold" style={{ color: item.color }}>{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}