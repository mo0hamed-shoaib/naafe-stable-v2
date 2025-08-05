import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="bg-light-cream shadow-sm border-b border-warm-cream lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-warm-cream transition-colors"
        >
          <Menu className="h-6 w-6 text-deep-teal" />
        </button>
        <h1 className="text-xl font-bold text-deep-teal">{title}</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>
    </header>
  );
};

export default Header;