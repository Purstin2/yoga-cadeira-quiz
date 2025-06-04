import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Heart, Star, Dumbbell, Trophy } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import AnimatedPage from './AnimatedPage';

const ActivityLevel: React.FC = () => {
  const navigate = useNavigate();
  const { preserveUtmParams } = useQuiz();
  const [selected, setSelected] = useState<string | null>(null);

  const levels = [
    {
      id: 'sedentary',
      label: 'Sedentário',
      description: 'Pouco ou nenhum exercício',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'lightly',
      label: 'Pouco ativo',
      description: 'Exercícios leves 1-2 dias por semana',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'moderately',
      label: 'Moderadamente ativo',
      description: 'Exercícios moderados 3-5 dias por semana',
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: 'very',
      label: 'Muito ativo',
      description: 'Exercícios intensos 6-7 dias por semana',
      icon: <Dumbbell className="w-5 h-5" />,
    },
    {
      id: 'highly',
      label: 'Altamente ativo',
      description: 'Exercícios diários intensos e trabalho físico',
      icon: <Trophy className="w-5 h-5" />,
    },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => {
      navigate(preserveUtmParams('/sensitivity-check'));
    }, 300);
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col items-center px-4">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#2D1441] mt-6 mb-6 text-center">
              Qual é seu nível de atividade?
            </h2>

            <div className="space-y-4">
              {levels.map((level) => (
                <motion.button
                  key={level.id}
                  onClick={() => handleSelect(level.id)}
                  className={`w-full p-4 flex items-center gap-4 rounded-xl border transition-all ${
                    selected === level.id
                      ? 'border-[#7432B4] bg-[#7432B4]/5'
                      : 'border-gray-200 hover:border-[#7432B4] hover:bg-[#7432B4]/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selected === level.id
                      ? 'bg-[#7432B4] text-white'
                      : 'bg-[#7432B4]/10 text-[#7432B4]'
                  }`}>
                    {level.icon}
                  </div>
                  <div className="text-left">
                    <span className="text-gray-800 group-hover:text-[#2D1441] font-medium block">
                      {level.label}
                    </span>
                    <span className="text-gray-500 text-sm block">
                      {level.description}
                    </span>
                  </div>
                  {selected === level.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-5 h-5 bg-[#7432B4] rounded-full flex items-center justify-center text-white text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ActivityLevel;