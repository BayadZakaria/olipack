
import React from 'react';
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Wallet, 
  FlaskConical, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const Strategy: React.FC = () => {
  const financialData = [
    { month: 'Jan', revenue: 35200, profit: 12900 },
    { month: 'Feb', revenue: 38000, profit: 14500 },
    { month: 'Mar', revenue: 42000, profit: 18000 },
    { month: 'Apr', revenue: 41000, profit: 17200 },
    { month: 'May', revenue: 45000, profit: 21000 },
    { month: 'Jun', revenue: 48000, profit: 23500 },
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-500">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Stratégie & Réalisme Économique</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          OliPack suit une approche en deux temps pour minimiser les risques et financer l'innovation de pointe par le cash-flow immédiat.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-emerald-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Phase 1</span>
              <Clock className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Le "Cash-Flow" (Années 1-3)</h2>
            <p className="text-emerald-100 text-sm mb-6">Produit : Granulés de biomasse (Bio-charbon)</p>
            <ul className="space-y-3">
              {[
                "Presse à granulés low-cost",
                "Marché local (Hammams, Fours)",
                "Logistique Python optimisée",
                "Revenus rapides pour la R&D"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </div>

        <div className="bg-slate-800 text-white p-8 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-blue-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Phase 2</span>
              <FlaskConical className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">La Vision Innovation (Années 3-5)</h2>
            <p className="text-slate-300 text-sm mb-6">Produit : Bioplastique PHA biodégradable</p>
            <ul className="space-y-3">
              {[
                "Achat de bioréacteurs avancés",
                "Exportation (Marché Européen)",
                "Remplacement du plastique pétro-sourcé",
                "Impact environnemental maximal"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </div>
      </div>

      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="text-emerald-600" />
              Simulation Financière Mensuelle
            </h2>
            <p className="text-sm text-slate-500">Estimations basées sur une production de 22 tonnes / mois (1 machine)</p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-medium">Revenu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                <span className="text-xs font-medium">Bénéfice</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financialData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                formatter={(val) => `${val} DH`}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2} fillOpacity={0.1} fill="#34d399" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Coût de Revient</p>
            <p className="text-2xl font-bold text-slate-800">0,90 DH <span className="text-sm font-normal text-slate-500">/ kg</span></p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Prix de Vente</p>
            <p className="text-2xl font-bold text-emerald-600">1,60 DH <span className="text-sm font-normal text-slate-500">/ kg</span></p>
          </div>
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Bénéfice Net Estimé</p>
            <p className="text-2xl font-bold text-emerald-700">+ 12 900 DH <span className="text-sm font-normal text-emerald-500">/ mois</span></p>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Target className="text-emerald-600" />
          Écosystème & Protection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "OMPIC", desc: "Marque OliPack déposée", color: "bg-red-50 text-red-600" },
            { title: "BMDA", desc: "Code Python protégé", color: "bg-blue-50 text-blue-600" },
            { title: "UM6P", desc: "Partenaire R&D", color: "bg-emerald-50 text-emerald-600" },
            { title: "Tamwilcom", desc: "Soutien Innov Idea", color: "bg-orange-50 text-orange-600" },
          ].map((item, idx) => (
            <div key={idx} className={`${item.color} p-4 rounded-xl border border-current border-opacity-10`}>
              <h4 className="font-bold text-sm mb-1">{item.title}</h4>
              <p className="text-xs opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Strategy;
