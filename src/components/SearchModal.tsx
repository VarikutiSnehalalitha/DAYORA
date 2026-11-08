'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, X, CheckSquare, Calendar, 
  Clock, AlertTriangle, ArrowRight, Tag, Folder 
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { Task } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTask?: (task: Task) => void;
}

export function SearchModal({ isOpen, onClose, onSelectTask }: SearchModalProps) {
  const { tasks, categories, projects, toggleTask } = useDayora();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'today' | 'overdue' | 'high_priority'>('all');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const results = tasks.filter(task => {
    if (filterType === 'today' && task.dueDate !== todayStr) return false;
    if (filterType === 'overdue' && task.status !== 'overdue') return false;
    if (filterType === 'high_priority' && task.priority !== 'urgent' && task.priority !== 'high') return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const titleMatch = task.title.toLowerCase().includes(q);
    const descMatch = task.description?.toLowerCase().includes(q);
    const tagMatch = task.tags.some(t => t.toLowerCase().includes(q));
    return titleMatch || descMatch || tagMatch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-xl shadow-floating overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-theme-border flex items-center gap-3">
          <Search className="w-5 h-5 text-theme-primary flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or #tags..."
            className="flex-1 bg-transparent text-sm sm:text-base text-theme-text-primary placeholder:text-theme-text-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-primary transition-all"
          >
            <kbd className="text-[10px] bg-theme-sidebar px-1.5 py-0.5 rounded border border-theme-border">
              ESC
            </kbd>
          </button>
        </div>

        {/* Filter Quick Pills */}
        <div className="px-4 py-2 bg-theme-sidebar/40 border-b border-theme-border flex items-center gap-1.5 text-xs overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterType === 'all' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('today')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterType === 'today' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            Due Today
          </button>
          <button
            onClick={() => setFilterType('overdue')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterType === 'overdue' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            Overdue
          </button>
          <button
            onClick={() => setFilterType('high_priority')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${filterType === 'high_priority' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-muted hover:text-theme-text-primary'}`}
          >
            High & Urgent
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {results.length === 0 ? (
            <div className="text-center py-12 text-xs text-theme-text-muted">
              No matching tasks found.
            </div>
          ) : (
            results.map(task => {
              const cat = categories.find(c => c.id === task.categoryId);

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    if (onSelectTask) onSelectTask(task);
                  }}
                  className="p-3 rounded-xl border border-theme-border/60 hover:border-theme-primary/40 bg-theme-sidebar/30 hover:bg-theme-sidebar flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${task.priority === 'urgent' ? 'bg-rose-500/15 text-rose-700' : 'bg-theme-glow text-theme-primary'}`}>
                        {task.priority}
                      </span>
                      {cat && (
                        <span className="text-[10px] text-theme-text-muted">
                          {cat.name}
                        </span>
                      )}
                      {task.status === 'overdue' && (
                        <span className="text-[10px] font-bold text-amber-600">
                          Overdue
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xs font-semibold truncate ${task.status === 'completed' ? 'line-through text-theme-text-muted' : 'text-theme-text-primary'}`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-theme-text-muted flex-shrink-0">
                    <span>{task.dueDate}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={`w-5 h-5 rounded border flex items-center justify-center ${task.status === 'completed' ? 'bg-theme-primary text-white border-theme-primary' : 'border-theme-border'}`}
                    >
                      {task.status === 'completed' && <CheckSquare className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-theme-border bg-theme-sidebar/50 text-[11px] text-theme-text-muted flex items-center justify-between">
          <span>{results.length} result{results.length !== 1 ? 's' : ''} found</span>
          <span>Tip: Use #tag to filter by tags</span>
        </div>
      </div>
    </div>
  );
}
