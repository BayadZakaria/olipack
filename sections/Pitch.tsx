
import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Quote } from 'lucide-react';

const Pitch: React.FC = () => {
  const slides = [
    {
      time: "00-15s",
      title: "Le Constat",
      content: "Imaginez un instant un producteur d'huile d'olive à Beni Mellal. Il regarde ses cuves déborder de 'margines', ce liquide noir et toxique. Il est coincé : s'il le jette, il pollue et prend une amende. Pour lui, c'est un déchet coûteux. C'est là que j'interviens.",
      bg: "bg-slate-900"
    },
    {
      time: "15-35s",
      title: "La Solution",
      content: "Moi, je n'ai pas vu de déchets. J'ai vu de la donnée et de la matière première. J'ai créé OliPack. C'est une startup qui combine industrie verte et Python. Ma plateforme IoT détecte le stock de déchets, optimise la collecte logistique, et permet la transformation de ce poison en énergie propre.",
      bg: "bg-emerald-900"
    },
    {
      time: "35-60s",
      title: "Vision & Stratégie",
      content: "Ma stratégie est pragmatique. Je commence par transformer ces déchets en Granulés de chauffage pour générer du cash immédiat. Avec ces bénéfices, je financerai la Phase 2 : La production de Bioplastique. OliPack, c'est l'ambition écologique financée par le réalisme économique.",
      bg: "bg-emerald-700"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="h-[80vh] flex flex-col space-y-8 animate-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pitch Mode</h1>
          <p className="text-slate-500">60 secondes pour convaincre.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-30"
            disabled={currentSlide === 0}
          >
            <ChevronLeft />
          </button>
          <button 
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 disabled:opacity-30"
            disabled={currentSlide === slides.length - 1}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className={`flex-1 ${slides[currentSlide].bg} rounded-3xl p-12 text-white flex flex-col justify-center transition-all duration-500 relative overflow-hidden`}>
        <Quote className="absolute top-10 right-10 w-32 h-32 opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <span className="bg-white/20 px-4 py-1 rounded-full font-mono text-sm border border-white/20">
              {slides[currentSlide].time}
            </span>
            <h2 className="text-2xl font-bold opacity-80 uppercase tracking-widest">{slides[currentSlide].title}</h2>
          </div>
          
          <p className="text-3xl md:text-5xl font-serif leading-tight italic">
            "{slides[currentSlide].content}"
          </p>
          
          <div className="pt-12">
            <p className="text-emerald-400 font-bold text-xl">— Zakaria Bayad</p>
            <p className="text-white/60">Fondateur d'OliPack</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-12 bg-emerald-600' : 'w-4 bg-slate-200'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Pitch;
