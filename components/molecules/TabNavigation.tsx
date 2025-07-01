import React from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex items-center gap-6 mb-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-3 px-1 text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === tab.id
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
              {tab.count.toLocaleString()}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};