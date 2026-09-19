import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { PageView } from '../types';

export interface BreadcrumbItem {
  label: string;
  view?: PageView;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (view: PageView) => void;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  onNavigate,
  className = ''
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-1.5 text-xs text-slate-500 font-medium ${className}`}
    >
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-1 hover:text-[#0F172A] transition-colors py-1 cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            {isLast || !item.view ? (
              <span className="text-amber-600 font-semibold py-1">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => onNavigate(item.view!)}
                className="hover:text-[#0F172A] transition-colors py-1 cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
