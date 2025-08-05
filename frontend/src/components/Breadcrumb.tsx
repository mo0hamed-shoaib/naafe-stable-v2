
import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    active?: boolean;
  }>;
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="text-sm breadcrumbs">
      <ul className="flex items-center gap-2 text-text-secondary">
        {items.map((item, index) => (
          <Fragment key={index}>
            <li>
              {item.href ? (
                <a href={item.href} className="hover:text-deep-teal transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className={item.active ? 'text-text-primary' : 'text-text-secondary'}>
                  {item.label}
                </span>
              )}
            </li>
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 text-text-secondary" />
            )}
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;