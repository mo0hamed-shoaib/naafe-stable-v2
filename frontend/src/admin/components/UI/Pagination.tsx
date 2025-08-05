import Button from '../../../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationProps } from '../../types';

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6">
      <span className="text-sm text-[#0e1b18]">
        عرض {startItem} إلى {endItem} من {totalItems} نتيجة
      </span>
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-full h-9 w-9 p-0 flex items-center justify-center"
          aria-label="الصفحة السابقة"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {getPageNumbers().map((page, index) => (
          <span key={index}>
            {page === '...' ? (
              <span className="px-2 text-[#0e1b18]">...</span>
            ) : (
              <Button
                variant={currentPage === page ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={`rounded-full h-9 w-9 p-0 flex items-center justify-center font-semibold ${currentPage === page ? '' : 'text-[#0e1b18]'}`}
                aria-label={`الانتقال إلى الصفحة ${page}`}
              >
                {page}
              </Button>
            )}
          </span>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-full h-9 w-9 p-0 flex items-center justify-center"
          aria-label="الصفحة التالية"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;