import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface RelatedArticle {
  title: string;
  description: string;
  href: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  className?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, className }) => {
  return (
    <section className={cn("mt-12", className)}>
      <h2 className="text-xl lg:text-2xl font-bold text-text-primary mb-6">مقالات ذات صلة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {articles.map((article, index) => (
          <Link
            key={index}
            to={article.href}
            className="block p-4 lg:p-6 bg-light-cream rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 hover:border-deep-teal/20"
          >
            <h3 className="text-base lg:text-lg font-semibold text-text-primary mb-2 hover:text-deep-teal transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-sm lg:text-base text-text-secondary">{article.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles; 