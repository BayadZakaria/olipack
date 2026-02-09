
import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Droplets, 
  Beaker, 
  Dna, 
  Waves, 
  CheckCircle2, 
  Timer, 
  Activity, 
  AlertCircle,
  BarChart,
  RefreshCw,
  Zap,
  History,
  FileBadge,
  Download,
  Trash2,
  Coffee,
  Microscope,
  // Add missing Info import
  Info
} from 'lucide-react';

interface TreatmentRecord {
  id: string;
  date: string;
  ingredients: { yeast: number; sugar: number; water: number; nutrients: number };
  efficiency: number;
  status: 'Succès' | 'Incomplet';
}

const QualityControl: React.FC = () => {
  // État des ingrédients basés sur la nouvelle recette
  const [water, setWater] = useState(1000); // L'Eau (Base) - Litres
  const [sugar, setSugar] = useState(75);   // Le Sucre (Énergie) - Grammes (scalé en kg pour l'UI)
  const [yeast, setYeast] = useState(10);   // La Khamira (Levure) - Grammes
  const [nutrients, setNutrients] = useState(20); // Marc de café / Nutriments - Grammes
  
  const [neutralization, setNeutralization] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phase, setPhase] = useState<'IDLE' | 'MIXING' | 'FERMENTATION' | 'READY'>('IDLE');
  const [history, setHistory] = useState<TreatmentRecord[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('olipack_quality_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      const initialHistory: TreatmentRecord[] = [
        { id: 'TR-9021', date: '2025-05-12 10:30', ingredients: { yeast: 10, sugar: 80, water: 1000, nutrients: 15 }, efficiency: 94.2, status: 'Succès' },
        { id: 'TR-9019', date: '2025-05-11 16:45', ingredients: { yeast: 8, sugar: 60, water: 1000, nutrients: 10 }, efficiency: 89.1, status: 'Succès' },
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
          const next = prev + 2;
          if (next >= 30 && next < 80) setPhase('FERMENTATION');
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

  // Nouvelle formule d'efficacité basée sur la fermentation (Yeast + Sugar)
  const efficiency = parseFloat(Math.min(99.9, (yeast * 4 + (sugar/10) * 2 + (nutrients/5) * 1 + 30)).toFixed(1));

  const saveToHistory = (progress: number) => {
    const newRecord: TreatmentRecord = {
      id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      ingredients: { yeast, sugar, water, nutrients },
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
            <FlaskConical className="text-emerald-600" />
            Bio-Qualité : Fermentation Contrôlée
          </h1>
          <p className="text-slate-500">Optimisation du processus biologique (Levure + Sucre + Nutriments).</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Bioréacteur OliPack #01</span>
           </div>
        </div>
      </header>

      {/* Recette Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IngredientCard 
          icon={Droplets} 
          label="L'Eau (Base)" 
          value={`${water} L`} 
          color="text-blue-500" 
          bgColor="bg-blue-50"
          onUpdate={(val) => setWater(val)}
          max={2000}
          subtitle="Eau tiède (Base)"
        />
        <IngredientCard 
          icon={Zap} 
          label="Le Sucre (Énergie)" 
          value={`${sugar} g`} 
          color="text-amber-500" 
          bgColor="bg-amber-50"
          onUpdate={(val) => setSugar(val)}
          max={200}
          subtitle="Nourriture levure"
        />
        <IngredientCard 
          icon={Microscope} 
          label="La Khamira (Levure)" 
          value={`${yeast} g`} 
          color="text-emerald-500" 
          bgColor="bg-emerald-50"
          onUpdate={(val) => setYeast(val)}
          max={20}
          subtitle="Agent actif"
        />
        <IngredientCard 
          icon={Coffee} 
          label="Marc de Café / Bio" 
          value={`${nutrients} g`} 
          color="text-orange-700" 
          bgColor="bg-orange-50"
          onUpdate={(val) => setNutrients(val)}
          max={100}
          subtitle="Boost enzymatique"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Bioréacteur View */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Beaker className="text-emerald-600" /> État de la Fermentation
            </h2>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                phase === 'READY' ? 'bg-emerald-100 text-emerald-700' : 
                phase === 'IDLE' ? 'bg-slate-100 text-slate-500' : 'bg-amber-100 text-amber-700 animate-pulse'
              }`}>
                {phase === 'IDLE' ? 'En attente' : phase === 'MIXING' ? 'Mélange des nutriments' : phase === 'FERMENTATION' ? 'Fermentation active' : 'Processus Terminé'}
              </span>
            </div>
          </div>

          <div className="relative h-72 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 mb-8 flex items-end shadow-inner">
            <div 
              className="w-full bg-gradient-to-t from-emerald-900 via-emerald-700 to-emerald-500 transition-all duration-700 relative"
              style={{ height: `${40 + (neutralization * 0.5)}%` }}
            >
              {isProcessing && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute bottom-0 w-2 h-2 bg-white/30 rounded-full animate-bounce"
                      style={{ 
                        left: `${Math.random() * 100}%`, 
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random() * 2}s`,
                        opacity: Math.random()
                      }}
                    ></div>
                  ))}
                </div>
              )}
              <div className="absolute -top-4 left-0 right-0 h-6 bg-emerald-400/20 blur-sm animate-pulse"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-6xl font-black text-white drop-shadow-lg mb-2">{neutralization}%</p>
              <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                Activité Biologique
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startTreatment}
              disabled={isProcessing || phase === 'READY'}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                isProcessing ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 
                phase === 'READY' ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FlaskConical className="w-5 h-5" />}
              {phase === 'READY' ? 'Traitement Réussi' : 'Activer la Bio-Digestion'}
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

        {/* Efficiency and Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart className="text-emerald-500 w-5 h-5" />
              Équilibre de la Recette
            </h3>
            <div className="text-center p-8 bg-slate-50 rounded-3xl mb-6 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-5xl font-black text-emerald-600">{efficiency}%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Score Qualité OliPack</p>
              </div>
              <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
            </div>
            <div className="space-y-4">
               <ProgressBar label="Activité Microbienne" value={efficiency > 90 ? 95 : 80} color="bg-emerald-500" />
               <ProgressBar label="Biodégradation Phénols" value={efficiency - 5} color="bg-blue-500" />
               <ProgressBar label="Stabilité Thermique" value={88} color="bg-cyan-500" />
            </div>
          </div>

          {phase === 'READY' && (
            <div className="bg-emerald-950 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl animate-in zoom-in-95 duration-500">
               <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="bg-emerald-500 p-2 rounded-xl">
                     <FileBadge className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm">Lot Bio-Certifié</h3>
                     <p className="text-[10px] text-emerald-300">Phase de maturation activée</p>
                   </div>
                 </div>
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-white/10">
                   <Download className="w-3 h-3" /> Rapport de Fermentation
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
            Historique des Bio-Traitements
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
                <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Recette (E/S/L/N)</th>
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
                    {record.ingredients.water}L / {record.ingredients.sugar}g / {record.ingredients.yeast}g / {record.ingredients.nutrients}g
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
                    Aucun traitement enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recette Details UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Info className="text-blue-500" /> Détails de la Recette
          </h3>
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">01</div>
              <p className="text-xs text-slate-600"><strong>L'Eau (Base) :</strong> 1 Litre d'eau tiède (non bouillante pour ne pas tuer la levure).</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 font-bold text-xs">02</div>
              <p className="text-xs text-slate-600"><strong>Le Sucre (Énergie) :</strong> 50g à 100g de sucre (ou mélasse). Nourriture pour la fermentation.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xs">03</div>
              <p className="text-xs text-slate-600"><strong>La Khamira (Levure) :</strong> 1 sachet de levure boulangère (7g à 10g). Agent actif.</p>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 font-bold text-xs">04</div>
              <p className="text-xs text-slate-600"><strong>Optionnel (Nutriments) :</strong> Marc de café ou résidus organiques fins pour l'activité enzymatique.</p>
            </li>
          </ul>
        </div>

        <div className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center">
           <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="text-emerald-400" />
                Note Scientifique
              </h3>
              <p className="text-sm text-emerald-100 leading-relaxed italic">
                "La température de l'eau est cruciale. Une eau trop chaude désactiverait la Khamira, stoppant net la biodégradation des margines. OliPack monitore la température en temps réel pour garantir la survie des agents biologiques."
              </p>
           </div>
           <Dna className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5" />
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
  max: number,
  subtitle?: string
}> = ({ icon: Icon, label, value, color, bgColor, onUpdate, max, subtitle }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-all hover:shadow-md group">
    <div className="flex items-center gap-4 mb-4">
      <div className={`${bgColor} ${color} p-4 rounded-2xl transition-transform group-hover:scale-110`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h4 className={`text-xl font-black ${color}`}>{value}</h4>
        {subtitle && <p className="text-[9px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <input 
      type="range" 
      min="0" 
      max={max} 
      step={label.includes('Levure') ? 1 : 10}
      value={parseInt(value)} 
      onChange={(e) => onUpdate(parseInt(e.target.value))}
      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
    />
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
