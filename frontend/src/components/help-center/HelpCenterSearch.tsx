import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../utils/cn';
import { FormInput } from "../ui";

interface HelpCenterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const HelpCenterSearch: React.FC<HelpCenterSearchProps> = ({
  value,
  onChange,
  placeholder = "البحث في مركز المساعدة...",
  className
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <FormInput
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-teal focus:border-transparent transition-all duration-300 text-right"
        aria-label="البحث في مركز المساعدة"
        variant="search"
      />
    </div>
  );
};

export default HelpCenterSearch; 