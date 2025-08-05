import { Search, MessageSquare } from 'lucide-react';
import Button from './Button';

export type SearchTab = 'services' | 'requests';

interface SearchTabsProps {
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
}

const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => {
  return (
    <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
      <Button
        variant={activeTab === 'services' ? 'primary' : 'ghost'}
        size="sm"
        className="flex-1 justify-center gap-2"
        onClick={() => onTabChange('services')}
      >
        <Search className="h-4 w-4" />
        الخدمات المقدمة
      </Button>
      
      <Button
        variant={activeTab === 'requests' ? 'primary' : 'ghost'}
        size="sm"
        className="flex-1 justify-center gap-2"
        onClick={() => onTabChange('requests')}
      >
        <MessageSquare className="h-4 w-4" />
        طلبات الخدمات
      </Button>
    </div>
  );
};

export default SearchTabs; 