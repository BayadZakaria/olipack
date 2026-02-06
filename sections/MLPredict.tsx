
import React, { useState, useEffect } from 'react';
import { BrainCircuit, History, Database, Loader2, CheckCircle2 } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { db } from '../services/db';

const MLPredict: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const load = async () => {
    const h = await db.getPredictionHistory();
    setHistory(h);
    const points = [];
    for (let i = 0; i < 24; i++) {
      points.push({ time: i + 'h', ph: 4.5 + Math.random() * 0.5 });
    }
    setData(points);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await db.savePrediction({ site: 'Beni Mellal', ph_value: 4.6, quality_score: 95, status: 'Optimisé' });
      await load();
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-emerald-900">
          <BrainCircuit className="text-emerald-500" /> OliPack Predict ML
        </h1>
        <button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
          {isSaving ? <Loader2 className="animate-spin" /> : <Database />} Sauvegarder
        </button>
      </div>
      
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[3, 6]} />
            <Tooltip />
            <Area type="monotone" dataKey="ph" stroke="#10b981" fill="#ecfdf5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><History /> Historique Cloud</h2>
        <div className="space-y-4">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold">{h.site}</span>
              <span className="text-emerald-600 font-black">{h.quality_score}%</span>
              <span className="text-xs text-slate-400">{new Date(h.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MLPredict;
