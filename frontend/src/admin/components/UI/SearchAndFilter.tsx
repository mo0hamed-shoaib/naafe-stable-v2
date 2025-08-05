import { FormInput } from "../../../components/ui";
import UnifiedSelect from "../../../components/ui/UnifiedSelect";
import { Search } from 'lucide-react';
import { forwardRef } from 'react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: Array<{ value: string; label: string }>;
  placeholder?: string;
  isLoading?: boolean;
}

const SearchAndFilter = forwardRef<HTMLInputElement, SearchAndFilterProps>(({
  searchTerm,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  placeholder = 'بحث...',
  isLoading = false
}, ref) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <FormInput
          label="بحث"
          icon={<Search className="h-5 w-5 text-soft-teal" />}
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="bg-white"
          disabled={isLoading}
          ref={ref}
        />
      </div>
      <div className="flex-1 min-w-[180px] max-w-sm w-full">
        <label className="block text-sm font-semibold text-text-primary mb-2">تصفية حسب الحالة</label>
        <UnifiedSelect
          value={filterValue}
          onChange={onFilterChange}
          options={filterOptions}
          placeholder="تصفية حسب الحالة"
          label={undefined}
          className="w-full"
        />
      </div>
    </div>
  );
});

SearchAndFilter.displayName = 'SearchAndFilter';

export default SearchAndFilter;