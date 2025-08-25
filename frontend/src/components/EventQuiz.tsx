'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface QuizAnswer {
  eventType: string;
  theme: string;
}

const eventTypes = [
  { id: 'wedding', name: 'Düğün', icon: '💒', description: 'Düğün ve nişan organizasyonları' },
  { id: 'henna', name: 'Kına', icon: '🕯️', description: 'Kına gecesi ve özel kutlamalar' },
  { id: 'birthday', name: 'Doğum Günü', icon: '🎂', description: 'Doğum günü ve yıldönümleri' },
  { id: 'baby', name: 'Bebek', icon: '👶', description: 'Bebek duğümü ve baby shower' },
  { id: 'housewarming', name: 'Ev Yemeği', icon: '🏠', description: 'Ev yemeği ve yeni ev kutlamaları' }
];

const themes = [
  { id: 'romantic', name: 'Romantik', icon: '💕', description: 'Aşk ve romantizm temalı' },
  { id: 'elegant', name: 'Zarif', icon: '✨', description: 'Şık ve sofistike tasarım' },
  { id: 'vintage', name: 'Vintage', icon: '🕰️', description: 'Retro ve nostaljik' },
  { id: 'modern', name: 'Modern', icon: '🚀', description: 'Çağdaş ve minimalist' },
  { id: 'nature', name: 'Doğa', icon: '🌿', description: 'Organik ve doğal' }
];

export default function EventQuiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswer>({ eventType: '', theme: '' });
  const [isCompleted, setIsCompleted] = useState(false);

  const handleEventTypeSelect = (eventType: string) => {
    setAnswers(prev => ({ ...prev, eventType }));
    setCurrentStep(2);
  };

  const handleThemeSelect = (theme: string) => {
    setAnswers(prev => ({ ...prev, theme }));
    setIsCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentStep(1);
    setAnswers({ eventType: '', theme: '' });
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Mükemmel Seçim!
          </h3>
          <p className="text-gray-600 mb-6">
            <strong>{eventTypes.find(e => e.id === answers.eventType)?.name}</strong> için{' '}
            <strong>{themes.find(t => t.id === answers.theme)?.name}</strong> temalı ürünlerimizi keşfedin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link 
              href={`/products?event=${answers.eventType}&theme=${answers.theme}`}
              className="btn-primary px-8 py-3"
            >
              Ürünleri Keşfet
            </Link>
            <button 
              onClick={resetQuiz}
              className="btn-secondary px-8 py-3"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gradient-pink via-gradient-purple to-gradient-blue rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Etkinlik Konsept Tasarımcısı
        </h2>
        <p className="text-white/90 text-lg">
          {currentStep === 1 
            ? 'Etkinlik türünü seçin' 
            : 'Tema tercihinizi belirleyin'
          }
        </p>
        
        {/* Progress Bar */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
        </div>
      </div>

      {currentStep === 1 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {eventTypes.map((event) => (
            <motion.button
              key={event.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEventTypeSelect(event.id)}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-200 border border-white/20"
            >
              <div className="text-4xl mb-3">{event.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{event.name}</h3>
              <p className="text-white/80 text-sm">{event.description}</p>
            </motion.button>
          ))}
        </motion.div>
      )}

      {currentStep === 2 && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {themes.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleThemeSelect(theme.id)}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-200 border border-white/20"
            >
              <div className="text-4xl mb-3">{theme.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{theme.name}</h3>
              <p className="text-white/80 text-sm">{theme.description}</p>
            </motion.button>
          ))}
        </motion.div>
      )}

      {currentStep === 2 && (
        <div className="text-center mt-6">
          <button 
            onClick={() => setCurrentStep(1)}
            className="text-white/80 hover:text-white transition-colors underline"
          >
            ← Geri Dön
          </button>
        </div>
      )}
    </div>
  );
}
