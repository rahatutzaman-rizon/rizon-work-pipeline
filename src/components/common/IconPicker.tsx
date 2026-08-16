import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const IconComponent = (LucideIcons as Record<string, any>)[name] || LucideIcons.Folder;
  return <IconComponent {...props} />;
};

export const AVAILABLE_ICONS = [
  { name: 'Folder', label: 'Folder' },
  { name: 'GraduationCap', label: 'Graduation' },
  { name: 'Languages', label: 'Languages' },
  { name: 'BookOpen', label: 'Book' },
  { name: 'Bot', label: 'AI Agent' },
  { name: 'Database', label: 'Database' },
  { name: 'Cpu', label: 'Processor' },
  { name: 'Code2', label: 'Code' },
  { name: 'Terminal', label: 'Terminal' },
  { name: 'Sparkles', label: 'Sparkles' },
  { name: 'Layers', label: 'Layers' },
  { name: 'FileText', label: 'Document' },
  { name: 'CheckSquare', label: 'Task' },
  { name: 'Target', label: 'Target' },
  { name: 'Bookmark', label: 'Bookmark' },
  { name: 'Zap', label: 'Lightning' },
];

interface IconPickerProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
  return (
    <div className="grid grid-cols-8 gap-2 p-2 bg-slate-900/60 rounded-xl border border-slate-800 max-h-40 overflow-y-auto">
      {AVAILABLE_ICONS.map((ico) => {
        const isSelected = selectedIcon === ico.name;
        return (
          <button
            key={ico.name}
            type="button"
            onClick={() => onSelect(ico.name)}
            title={ico.label}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DynamicIcon name={ico.name} className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
};
