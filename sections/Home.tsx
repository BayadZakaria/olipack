
import React from 'react';
import { ArrowRight, Leaf, Zap, Globe, Recycle } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
}

const Home: React.FC<HomeProps> = ({ onGetStarted }) => {
  return (
    <div className="space-y-12 animate-in">
      
      {/* HERO SECTION ORIGINALE */}
      <section className="bg-emerald-900 rounded-[2rem] text-white p-12 md:p-20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-lg border border-white/10">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Projet Greentech Maroc</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            OliPack <br/>
            <span className="text-emerald-400">Du déchet noir à l'or vert.</span>
          </h1>
          
          <p className="text-lg text-emerald-100/70 leading-relaxed">
            Une plateforme de gestion et de valorisation des margines pour une industrie oléicole durable et rentable.
          </p>

          <div className="pt-4">
            <button 
              onClick={onGetStarted}
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center transition-all transform hover:translate-x-1 group shadow-lg shadow-emerald-950"
            >
              ACCÉDER AU DASHBOARD <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Decoration discret */}
        <Recycle className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </section>

      {/* MÉTRIQUES CLÉS ÉPURÉES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HomeMetric icon={Zap} title="Smart Monitoring" desc="Suivi IoT des cuves en temps réel pour prévenir la pollution." />
        <HomeMetric icon={Recycle} title="Valorisation" desc="Transformation en pellets et bioplastiques PHA." />
        <HomeMetric icon={Globe} title="Impact Environnemental" desc="Protection des nappes phréatiques marocaines." />
      </div>
    </div>
  );
};

const HomeMetric: React.FC<{ icon: any, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors shadow-sm group">
    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
