import React from 'react';
import { useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="px-4 py-4 bg-white border-b border-gray-100">
      <div className="w-full flex justify-center items-center">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-[#7432B4]" />
          <span className="text-lg font-bold text-[#2D1441]">Yoga na Cadeira</span>
        </div>
      </div>
    </header>
  );
};

export default Header;