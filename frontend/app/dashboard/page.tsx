"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Database, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

const generateFeed = (id: number) => ({
  id: id.toString(),
  title: [
    "Climate bill passes Senate with bipartisan support",
    "Tech company announces major layoffs amid economic downturn",
    "New study links social media to anxiety in teenagers",
    "Government denies allegations of surveillance program",
    "Scientists discover potential cure for rare disease",
  ][id % 5],
  domain: ["reuters.com", "bbc.com", "cnn.com", "apnews.com", "nytimes.com"][id % 5],
  verdict: ["REAL", "FAKE", "UNCERTAIN"][id % 3],
  confidence: 70 + (id % 30),
  time: "12:00",
});

export default function Dashboard() {
  const [feed, setFeed] = useState(() => Array.from({ length: 6 }, (_, i) => generateFeed(i)));
  const [processed, setProcessed] = useState(10247);
  const [chartData, setChartData] = useState([
    { time: "10:00", real: 45, fake: 30, uncertain: 25 },
    { time: "10:30", real: 52, fake: 28, uncertain: 20 },
    { time: "11:00", real: 48, fake: 35, uncertain: 17 },
    { time: "11:30", real: 60, fake: 25, uncertain: 15 },
    { time: "12:00", real: 55, fake: 30, uncertain: 15 },
    { time: "12:30", real: 65, fake: 22, uncertain: 13 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => [generateFeed(Date.now()), ...prev.slice(0, 7)]);
      setProcessed((prev) => prev + Math.floor(Math.random() * 5) + 1);
      setChartData((prev) => [
        ...prev.slice(1),
        {
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          real: Math.floor(Math.random() * 30) + 40,
          fake: Math.floor(Math.random() * 20) + 20,
          uncertain: Math.floor(Math.random() * 15) + 10,
        },
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: "Real", value: 52 },
    { name: "Fake", value: 31 },
    { name: "Uncertain", value: 17 },
  ];

  const verdictColor = (v: string) =>
    v === "REAL" ? "text-green-400" : v === "FAKE" ? "text-red-400" : "text-yellow-400";

  const verdictBg = (v: string) =>
    v === "REAL" ? "bg-green-500/10 border-green-500/20" : v === "FAKE" ? "bg-red-500/10 border-red-500/20" : "bg-yellow-500/10 border-yellow-500/20";

  return (
    <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Live Dashboard</h1>
        <p className="text-slate-400 text-sm">Real-time Kafka pipeline monitoring</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Articles Processed", value: processed.toLocaleString(), icon: Database, color: "text-blue-400" },
          { label: "Kafka Throughput", value: "523/sec", icon: Zap, color: "text-cyan-400" },
          { label: "Avg Latency", value: "1.8s", icon: Clock, color: "text-purple-400" },
          { label: "Pipeline Uptime", value: "99.9%", icon: Activity, color: "text-green-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">{stat.label}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Line Chart */}
        <div className="col-span-2 glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-400" />
            Verdict Distribution Over Time
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="real" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fake" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="uncertain" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <h2 className="text-sm font-semibold text-white mb-4">Verdict Breakdown</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {pieData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-slate-400">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Feed */}
      <div className="glass rounded-2xl p-6 border border-white/5">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Activity size={16} className="text-green-400" />
          Live Article Feed
          <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </h2>
        <div className="space-y-2">
          {feed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-xl border ${verdictBg(item.verdict)}`}
            >
              <div className="flex items-center gap-3">
                {item.verdict === "REAL" ? (
                  <CheckCircle size={14} className="text-green-400 shrink-0" />
                ) : item.verdict === "FAKE" ? (
                  <AlertTriangle size={14} className="text-red-400 shrink-0" />
                ) : (
                  <Clock size={14} className="text-yellow-400 shrink-0" />
                )}
                <div>
                  <p className="text-sm text-white font-medium truncate max-w-md">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.domain}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-xs font-bold ${verdictColor(item.verdict)}`}>{item.verdict}</span>
                <span className="text-xs text-slate-400">{item.confidence}%</span>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}