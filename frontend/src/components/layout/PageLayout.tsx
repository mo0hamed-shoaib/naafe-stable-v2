
import { cn } from '../../utils/helpers';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumb from '../Breadcrumb';
import { User } from '../../types';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  onSearch?: (query: string) => void;
  searchValue?: string;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showBreadcrumb?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

const PageLayout = ({
  children,
  title,
  subtitle,
  breadcrumbItems,
  onSearch,
  searchValue,
  className,
  showHeader = true,
  showFooter = true,
  showBreadcrumb = true,
  user,
  onLogout
}: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-warm-cream">
      {showHeader && (
        <Header 
          onSearch={onSearch} 
          searchValue={searchValue} 
          user={user}
          onLogout={onLogout}
        />
      )}
      
      <main className={cn("container mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-8", className)}>
        {(showBreadcrumb && breadcrumbItems) && (
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
            {(title || subtitle) && (
              <div className="mt-4">
                {title && (
                  <h1 className="text-4xl font-extrabold tracking-tight text-deep-teal sm:text-5xl">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-3 text-lg text-text-secondary">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout; 