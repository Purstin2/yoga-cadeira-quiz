import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AgeSelection from './components/AgeSelection';
// Removido: import SexSelection from './components/SexSelection';
// Removido: import CommunityPage from './components/CommunityPage';
import GoalsSelection from './components/GoalsSelection';
import ChairYogaExperience from './components/ChairYogaExperience';
import TargetZones from './components/TargetZones';
import BodyType from './components/BodyType';
import DreamBody from './components/DreamBody';
import ActivityLevel from './components/ActivityLevel';
// Removido: import WalkingTime from './components/WalkingTime';
// Consolidado com ChairYogaExperience: import YogaLevel from './components/YogaLevel';
import SensitivityCheck from './components/SensitivityCheck';
import SupportStep from './components/SupportStep';
import AvailableTime from './components/AvailableTime';
import BMICalculator from './components/BMICalculator';
import ProfileSummary from './components/ProfileSummary';
import SalesPage from './components/SalesPage';
import Checkout from './components/Checkout';
import SuccessPage from './components/SuccessPage';
import ProgressBar from './components/ProgressBar';
//import ExitIntentModal from './components/ExitIntentModal';
// Importação do componente de navegação rápida para desenvolvedores (comentado)
// import QuickNav from './components/QuickNav';
import { QuizProvider } from './context/QuizContext';
import { trackPageView, trackEvent, PixelEvents } from './utils/analytics';

function App() {
  const location = useLocation();
  
  // Rastrear visualização de página quando a rota mudar
  useEffect(() => {
    // Rastrear visualização de página padrão
    trackPageView();
    
    // Rastrear evento específico de visualização de conteúdo com o caminho atual
    trackEvent(PixelEvents.VIEW_CONTENT, {
      content_name: location.pathname,
      content_category: 'page_view'
    });
    
    // Eventos específicos para etapas importantes do funil
    if (location.pathname === '/sales') {
      trackEvent('SalesPageView');
    } else if (location.pathname === '/checkout') {
      trackEvent(PixelEvents.INITIATE_CHECKOUT);
    } else if (location.pathname === '/success') {
      trackEvent(PixelEvents.PURCHASE);
    }
    
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      <QuizProvider>
        <ProgressBar />
        {/* Componente de navegação rápida para desenvolvedores (comentado) */}
        {/* <QuickNav /> */}
        
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AgeSelection />} />
            {/* Removido: <Route path="/sex-selection" element={<SexSelection />} /> */}
            {/* Removido: <Route path="/community" element={<CommunityPage />} /> */}
            <Route path="/goals" element={<GoalsSelection />} />
            <Route path="/body-type" element={<BodyType />} />
            <Route path="/dream-body" element={<DreamBody />} />
            <Route path="/target-zones" element={<TargetZones />} />
            <Route path="/chair-yoga-experience" element={<ChairYogaExperience />} />
            <Route path="/activity-level" element={<ActivityLevel />} />
            {/* Removido: <Route path="/walking-time" element={<WalkingTime />} /> */}
            {/* Consolidado: <Route path="/yoga-level" element={<YogaLevel />} /> */}
            <Route path="/sensitivity-check" element={<SensitivityCheck />} />
            <Route path="/support-step" element={<SupportStep />} />
            <Route path="/available-time" element={<AvailableTime />} />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/profile-summary" element={<ProfileSummary />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </QuizProvider>
    </div>
  );
}

export default App;