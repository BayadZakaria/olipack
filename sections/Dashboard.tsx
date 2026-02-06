import React, { useState, useEffect, useRef } from 'react';
import { 
  Droplets, 
  Thermometer, 
  Waves, 
  AlertTriangle, 
  CheckCircle, 
  Truck, 
  QrCode,
  MapPin,
  RefreshCcw,
  Volume2,
  VolumeX,
  BellRing
} from 'lucide-react';
import { db } from '../services/db';

const Dashboard: React.FC = () => {
  const regions = ["Beni Mellal", "Meknès", "Marrakech"];
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [niveau, setNiveau] = useState(75);
  const [isCollecting, setIsCollecting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [temp, setTemp] = useState(24.2);
  const [ph, setPh] = useState(4.5);
  
  const [isMuted, setIsMuted] = useState(false);
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(prev => parseFloat((prev + (Math.random() - 0.5) * 0.2).toFixed(1)));
      setPh(prev => parseFloat(Math.max(3.8, Math.min(5.2, prev + (Math.random() - 0.5) * 0.05)).toFixed(1)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCollect = async () => {
    setIsCollecting(true);
    setTimeout(async () => {
      const collectionData = {
        timestamp: new Date().toISOString(),
        region: selectedRegion,
        volume: 2500,
        ph: ph,
        temp: temp
      };
      try {
        await db.saveCollectionEvent(collectionData);
      } finally {
        setIsCollecting(false);
        setNiveau(15);
        setShowQR(true);
      }
    }, 2000);
  };

  const isCritical = niveau > 80;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MapPin className="text-emerald-600" />
            Monitoring : <span className="text-emerald-700">{selectedRegion}</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">
              {isCritical ? "ALERTE NIVEAU CRITIQUE" : "Flux de données stable"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl border transition-all ${isMuted ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedRegion === r ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={Thermometer} label="Température" value={`${temp} °C`} color="text-orange-600" bgColor="bg-orange-50" />
        <MetricCard icon={Droplets} label="Acidité (pH)" value={ph.toString()} color="text-blue-600" bgColor="bg-blue-50" />
        <MetricCard 
          icon={isCritical ? BellRing : CheckCircle} 
          label="Statut Système" 
          value={isCritical ? "CRITIQUE" : "OPTIMAL"} 
          color={isCritical ? "text-red-600" : "text-emerald-600"} 
          bgColor={isCritical ? "bg-red-50" : "bg-emerald-50"} 
          animate={isCritical}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-800">
            <Waves className="text-emerald-600" />
            Niveau de la Cuve (IoT)
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-full md:w-48 h-80 bg-slate-100 border-[6px] border-slate-200 rounded-b-[3rem] rounded-t-2xl flex items-end overflow-hidden shadow-inner">
              <div 
                className={`w-full transition-all duration-1000 relative ${isCritical ? 'bg-gradient-to-t from-red-700 to-red-500' : 'bg-gradient-to-t from-emerald-700 to-emerald-500'}`} 
                style={{ height: `${niveau}%` }}
              >
                <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 animate-pulse"></div>
                <div className="waves absolute -top-8 left-0 right-0 h-8 opacity-30 bg-white"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center font-black text-4xl drop-shadow-md">
                <span className={niveau > 50 ? 'text-white' : 'text-slate-700'}>{niveau}%</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-8">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4">Simulateur Capteur</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={niveau} 
                  onChange={(e) => setNiveau(parseInt(e.target.value))} 
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-emerald-600" 
                />
              </div>

              {isCritical && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-pulse flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" /> 
                  <p className="text-red-700 text-xs font-bold">ALERTE : Seuil de sécurité dépassé.</p>
                </div>
              )}

              <button
                disabled={!isCritical || isCollecting}
                onClick={handleCollect}
                className={`w-full py-5 px-6 rounded-[1.5rem] font-black flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${isCritical ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
              >
                {isCollecting ? <RefreshCcw className="animate-spin" /> : <Truck className="w-5 h-5" />}
                {isCollecting ? 'SYNCHRONISATION...' : 'LANCER LA COLLECTE'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
            <QrCode className="text-emerald-600" /> Traçabilité Blockchain
          </h2>

          {showQR ? (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 inline-block">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=OliPack-Lot-${Date.now()}`} alt="QR Code" className="w-40 h-40" />
              </div>
              <div>
                <h3 className="font-black text-emerald-900 text-lg uppercase tracking-tighter">Passeport Numérique Généré</h3>
                <p className="text-slate-400 text-xs mt-2">Ce lot est désormais certifié pour la valorisation.</p>
              </div>
              <button onClick={() => setShowQR(false)} className="text-emerald-600 text-xs font-black hover:underline uppercase tracking-widest">Nouveau Lot</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 opacity-30">
              <QrCode className="w-24 h-24 text-slate-300" />
              <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed">
                Le certificat de traçabilité sera généré automatiquement à la fin de la collecte.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: any; label: string; value: string; color: string; bgColor: string; animate?: boolean }> = ({ icon: Icon, label, value, color, bgColor, animate }) => (
  <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all group ${animate ? 'ring-2 ring-red-500 ring-offset-4' : 'hover:border-emerald-200'}`}>
    <div className={`${bgColor} ${color} p-4 rounded-2xl group-hover:scale-110 transition-transform ${animate ? 'animate-pulse' : ''}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
    </div>
  </div>
);

export default Dashboard;