import React from 'react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="px-4 py-4 bg-white border-b border-gray-100">
      <div className="w-full flex justify-center items-center">
      </div>
    </header>
  );
};

export default Header;