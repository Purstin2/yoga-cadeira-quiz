// src/components/ProgressBar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';

const ProgressBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getNextRoute } = useQuiz();
  const currentPath = location.pathname;
  
  // Mapeamento atualizado das rotas de seleção (removidas sex-selection, community, walking-time, yoga-level)
  const selectionRoutes = [
    '/',                     // AgeSelection
    '/goals',                // GoalsSelection
    '/body-type',            // BodyType
    '/dream-body',           // DreamBody
    '/target-zones',         // TargetZones
    '/chair-yoga-experience',// ChairYogaExperience (consolidada com YogaLevel)
    '/activity-level',       // ActivityLevel
    '/sensitivity-check',    // SensitivityCheck
    '/support-step',         // SupportStep
    '/exercise-style',       // ExerciseStylePreference
    '/available-time',       // AvailableTime
    '/bmi-calculator',       // BMICalculator
  ];
  
  // Total de etapas de seleção
  const totalSteps = selectionRoutes.length;
  
  // Calcular o progresso atual
  const currentIndex = selectionRoutes.indexOf(currentPath);
  const progressPercentage = currentIndex >= 0 
    ? Math.max(5, Math.min(100, ((currentIndex + 1) / totalSteps) * 100)) 
    : 0;
  
  // Função para voltar à página anterior
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Função para avançar à próxima página
  const handleGoForward = () => {
    navigate(getNextRoute(currentPath));
  };
  
  // Se não for uma página de seleção, não mostrar a barra
  if (currentIndex < 0) {
    return null;
  }
  
  // Verificar se é a última página de seleção
  const isLastStep = currentIndex === selectionRoutes.length - 1;
  
  return (
    <div className="px-4 py-3.5 bg-[#F7F3FF] border-b border-gray-100 sticky top-0 z-20">
      <div className="w-full max-w-sm mx-auto flex justify-center items-center py-1">
        {/* Barra de progresso centralizada e compacta */}
        <div className="w-full h-2 bg-[#E9E0F4] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#7432B4]"
            initial={{ width: `${progressPercentage > 5 ? progressPercentage - 10 : 0}%` }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;