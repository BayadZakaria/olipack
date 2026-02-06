
import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Droplet, 
  Beaker, 
  Milk, 
  Waves, 
  CheckCircle2, 
  Timer, 
  Activity, 
  AlertCircle,
  BarChart,
  RefreshCw,
  Wind,
  History,
  FileBadge,
  Download,
  Trash2
} from 'lucide-react';

interface TreatmentRecord {
  id: string;
  date: string;
  ingredients: { milk: number; sugar: number; water: number };
  efficiency: number;
  status: 'Succès' | 'Incomplet';
}

const QualityControl: React.FC = () => {
  // État des ingrédients (en litres ou kg)
  const [milk, setMilk] = useState(150);
  const [sugar, setSugar] = useState(45);
  const [water, setWater] = useState(1200);
  
  const [neutralization, setNeutralization] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phase, setPhase] = useState<'IDLE' | 'MIXING' | 'REACTION' | 'READY'>('IDLE');
  const [history, setHistory] = useState<TreatmentRecord[]>([]);

  // Simulation de l'historique initial
  useEffect(() => {
    const savedHistory = localStorage.getItem('olipack_quality_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      const initialHistory: TreatmentRecord[] = [
        { id: 'TR-8821', date: '2025-05-10 14:30', ingredients: { milk: 120, sugar: 30, water: 1000 }, efficiency: 92.4, status: 'Succès' },
        { id: 'TR-8819', date: '2025-05-09 09:15', ingredients: { milk: 140, sugar: 40, water: 1100 }, efficiency: 95.1, status: 'Succès' },
      ];
      setHistory(initialHistory);
      localStorage.setItem('olipack_quality_history', JSON.stringify(initialHistory));
    }
  }, []);

  const startTreatment = () => {
    setIsProcessing(true);
    setPhase('MIXING');
    setNeutralization(0);
  };

  useEffect(() => {
    let interval: any;
    if (isProcessing && neutralization < 100) {
      interval = setInterval(() => {
        setNeutralization(prev => {
          const next = prev + 2; // Accéléré pour la démo
          if (next >= 30 && next < 80) setPhase('REACTION');
          if (next >= 100) {
            setPhase('READY');
            setIsProcessing(false);
            saveToHistory(100);
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isProcessing, neutralization]);

  const efficiency = parseFloat(Math.min(99.9, (milk * 0.4 + sugar * 0.2 + (water/100) * 0.1 + 40)).toFixed(1));

  const saveToHistory = (progress: number) => {
    const newRecord: TreatmentRecord = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      ingredients: { milk, sugar, water },
      efficiency: efficiency,
      status: progress >= 100 ? 'Succès' : 'Incomplet'
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('olipack_quality_history', JSON.stringify(updatedHistory));
  };

  const deleteHistory = () => {
    if(confirm("Effacer l'historique des traitements ?")) {
      setHistory([]);
      localStorage.removeItem('olipack_quality_history');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FlaskConical className="text-cyan-600" />
            Suivi du Nettoyage Biologique
          </h1>
          <p className="text-slate-500">Contrôle admin du processus de neutralisation (Lait + Sucre + Eau).</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Réacteur Actif : #04</span>
           </div>
        </div>
      </header>

      {/* Inputs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <IngredientCard 
          icon={Milk} 
          label="Lait (Agent Neutralisant)" 
          value={`${milk} L`} 
          color="text-blue-500" 
          bgColor="bg-blue-50"
          onUpdate={(val) => setMilk(val)}
          max={500}
        />
        <IngredientCard 
          icon={Wind} 
          label="Sucre (Substrat Carbone)" 
          value={`${sugar} Kg`} 
          color="text-amber-500" 
          bgColor="bg-amber-50"
          onUpdate={(val) => setSugar(val)}
          max={200}
        />
        <IngredientCard 
          icon={Droplet} 
          label="Eau de Dilution" 
          value={`${water} L`} 
          color="text-cyan-500" 
          bgColor="bg-cyan-50"
          onUpdate={(val) => setWater(val)}
          max={5000}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Reactor View */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Beaker className="text-cyan-600" /> État de la Réaction
            </h2>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                phase === 'READY' ? 'bg-emerald-100 text-emerald-700' : 
                phase === 'IDLE' ? 'bg-slate-100 text-slate-500' : 'bg-cyan-100 text-cyan-700 animate-pulse'
              }`}>
                {phase === 'IDLE' ? 'En attente' : phase === 'MIXING' ? 'Mélange ingredients' : phase === 'REACTION' ? 'Réaction Bio-Chimique' : 'Lot Purifié & Prêt'}
              </span>
            </div>
          </div>

          <div className="relative h-72 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 mb-8 flex items-end shadow-inner">
            {/* Visual simulation of the liquid */}
            <div 
              className="w-full bg-gradient-to-t from-emerald-900 via-emerald-700 to-emerald-500 transition-all duration-700 relative"
              style={{ height: `${55 + (neutralization * 0.35)}%` }}
            >
              {/* Reaction bubbles */}
              {isProcessing && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bottom-0 w-3 h-3 bg-white/40 rounded-full animate-bounce"
                      style={{ 
                        left: `${Math.random() * 100}%`, 
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        opacity: Math.random()
                      }}
                    ></div>
                  ))}
                </div>
              )}
              {/* Liquid surface wave effect */}
              <div className="absolute -top-4 left-0 right-0 h-6 bg-emerald-400/30 blur-sm animate-pulse"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-6xl font-black text-white drop-shadow-lg mb-2">{neutralization}%</p>
              <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                Niveau de Neutralisation
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startTreatment}
              disabled={isProcessing || phase === 'READY'}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                isProcessing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                phase === 'READY' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-200'
              }`}
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FlaskConical className="w-5 h-5" />}
              {phase === 'READY' ? 'Traitement Réussi' : 'Lancer le Cycle de Nettoyage'}
            </button>
            <button
              onClick={() => { setNeutralization(0); setPhase('IDLE'); }}
              className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-colors"
              title="Réinitialiser"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Efficiency and Statistics */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart className="text-emerald-500 w-5 h-5" />
              Efficacité du Dosage
            </h3>
            <div className="text-center p-8 bg-slate-50 rounded-3xl mb-6 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-5xl font-black text-emerald-600">{efficiency}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Qualité Sortie Estimée</p>
              </div>
              <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            </div>
            <div className="space-y-4">
               <ProgressBar label="Stabilisation pH" value={88} color="bg-emerald-500" />
               <ProgressBar label="Réduction Polyphénols" value={efficiency - 5} color="bg-blue-500" />
               <ProgressBar label="Clarification Liquide" value={efficiency - 10} color="bg-cyan-500" />
            </div>
          </div>

          {phase === 'READY' && (
            <div className="bg-emerald-900 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl animate-in zoom-in-95 duration-500">
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="bg-emerald-500 p-2 rounded-xl">
                     <FileBadge className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm">Certificat de Conformité</h3>
                     <p className="text-[10px] text-emerald-300">Prêt pour Phase 2 (Bioplastique)</p>
                   </div>
                 </div>
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10">
                   <Download className="w-3 h-3" /> Télécharger Rapport (.PDF)
                 </button>
               </div>
               <Waves className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
            </div>
          )}
        </div>
      </div>

      {/* History Log */}
      <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
            <History className="text-slate-400" />
            Historique des Nettoyages (Admin)
          </h2>
          <button 
            onClick={deleteHistory}
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID Lot</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date / Heure</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Dosage (L/S/E)</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Efficacité</th>
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length > 0 ? history.map((record) => (
                <tr key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 text-sm font-bold text-slate-700">{record.id}</td>
                  <td className="py-4 text-xs text-slate-500">{record.date}</td>
                  <td className="py-4 text-xs font-mono text-slate-600">
                    {record.ingredients.milk}L / {record.ingredients.sugar}Kg / {record.ingredients.water}L
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-bold text-emerald-600">{record.efficiency}%</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter ${
                      record.status === 'Succès' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 italic text-sm">
                    Aucun traitement enregistré pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology Reminder */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
           <div>
             <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
               <AlertCircle className="w-6 h-6 text-cyan-400" /> 
               Protocole Scientifique OliPack
             </h3>
             <p className="text-sm text-slate-400 leading-relaxed italic">
               "Le nettoyage par bio-digestion utilise les protéines du lait et les glucides du sucre pour catalyser la décomposition des phénols des margines. L'ajout d'eau contrôlé prévient la surchauffe thermique du réacteur."
             </p>
           </div>
           <div className="flex flex-wrap gap-4">
             <div className="flex-1 min-w-[140px] p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
               <Timer className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
               <p className="text-[10px] uppercase font-bold text-white/60 mb-1">Cycle Moyen</p>
               <p className="text-lg font-bold">4.5 Heures</p>
             </div>
             <div className="flex-1 min-w-[140px] p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
               <Waves className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
               <p className="text-[10px] uppercase font-bold text-white/60 mb-1">Consommation H2O</p>
               <p className="text-lg font-bold">-25% vs Comp.</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

const IngredientCard: React.FC<{ 
  icon: any, 
  label: string, 
  value: string, 
  color: string, 
  bgColor: string,
  onUpdate: (val: number) => void,
  max: number
}> = ({ icon: Icon, label, value, color, bgColor, onUpdate, max }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-cyan-200 transition-all hover:shadow-md group">
    <div className="flex items-center gap-4 mb-4">
      <div className={`${bgColor} ${color} p-4 rounded-2xl transition-transform group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h4 className={`text-xl font-black ${color}`}>{value}</h4>
      </div>
    </div>
    <input 
      type="range" 
      min="0" 
      max={max} 
      step={label.includes('Sucre') ? 5 : 50}
      value={parseInt(value)} 
      onChange={(e) => onUpdate(parseInt(e.target.value))}
      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-600"
    />
    <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-400">
      <span>0</span>
      <span>{max} MAX</span>
    </div>
  </div>
);

const ProgressBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1 uppercase tracking-tighter">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
      <div 
        className={`h-full ${color} transition-all duration-1000 ease-out`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default QualityControl;
