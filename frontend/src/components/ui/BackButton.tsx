import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface BackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  to, 
  className = '',
  children = 'العودة'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={`gap-2 text-deep-teal border-deep-teal hover:bg-deep-teal hover:text-white transition-colors ${className}`}
    >
      <ArrowRight className="h-4 w-4" />
      {children}
    </Button>
  );
};

export default BackButton; 