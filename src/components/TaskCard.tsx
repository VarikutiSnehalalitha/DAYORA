'use client';

import React, { useState } from 'react';
import { 
  Check, Clock, Calendar, AlertTriangle, 
  Folder, MoreHorizontal, Trash2, Edit2, 
  Repeat, Bell, CheckSquare, Sparkles 
} from 'lucide-react';
import { Task, Category, Project } from '@/types';
import { useDayora } from '@/hooks/useDayora';
import { fireTaskCompletionConfetti } from '@/lib/confetti';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  category?: Category;
  project?: Project;
  onEdit?: (task: Task) => void;
  onReschedule?: (task: Task) => void;
}

export function TaskCard({ task, category, project, onEdit, onReschedule }: TaskCardProps) {
  const { toggleTask, deleteTask, snoozeTask } = useDayora();
  const [menuOpen, setMenuOpen] = useState(false);

  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue';

  const handleToggle = () => {
    toggleTask(task.id);
    if (!isCompleted) {
      fireTaskCompletionConfetti();
    }
  };

  // Priority color styling
  const priorityStyles: Record<Task['priority'], string> = {
    urgent: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    high: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    medium: 'bg-theme-glow text-theme-primary border-theme-primary/30',
    low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  return (
    <div className={`
      group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200
      ${isCompleted 
        ? 'bg-theme-card/50 border-theme-border/60 opacity-60' 
        : isOverdue 
          ? 'bg-amber-500/5 border-amber-500/30 hover:border-amber-500/50 shadow-sm' 
          : 'bg-theme-card border-theme-border hover:border-theme-primary/40 hover:shadow-card'
      }
    `}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`
            mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0
            ${isCompleted 
              ? 'bg-theme-primary border-theme-primary text-white scale-95 shadow-sm' 
              : 'border-theme-border hover:border-theme-primary hover:bg-theme-glow/30'
            }
          `}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityStyles[task.priority]}`}>
              {task.priority}
            </span>

            {/* Overdue Badge */}
            {isOverdue && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/30 animate-pulse-subtle">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                Overdue
              </span>
            )}

            {/* Category */}
            {category && (
              <span 
                className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 border"
                style={{ 
                  backgroundColor: `${category.color}15`, 
                  borderColor: `${category.color}30`,
                  color: category.color 
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category.color }} />
                {category.name}
              </span>
            )}

            {/* Project */}
            {project && (
              <span className="text-[10px] font-medium text-theme-text-muted flex items-center gap-1">
                <Folder className="w-3 h-3" />
                {project.title}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className={`text-sm font-semibold tracking-tight transition-all ${
            isCompleted 
              ? 'line-through text-theme-text-muted' 
              : 'text-theme-text-primary'
          }`}>
            {task.title}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-theme-text-secondary line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Metadata Footer: Date, Time, Subtasks, Recurrence */}
          <div className="pt-1 flex items-center gap-3 text-[11px] text-theme-text-muted flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-theme-primary" />
              <span>{task.dueDate}</span>
            </span>

            {task.startTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-theme-primary" />
                <span>{task.startTime}</span>
              </span>
            )}

            {task.subtasks.length > 0 && (
              <span className="flex items-center gap-1 bg-theme-sidebar px-1.5 py-0.5 rounded border border-theme-border">
                <CheckSquare className="w-3 h-3" />
                <span>{completedSubtasks}/{task.subtasks.length}</span>
              </span>
            )}

            {task.recurrence && (
              <span className="flex items-center gap-1 text-theme-text-secondary" title={`Recurring: ${task.recurrence.frequency}`}>
                <Repeat className="w-3 h-3" />
                <span className="capitalize">{task.recurrence.frequency}</span>
              </span>
            )}

            {task.reminders && task.reminders.length > 0 && (
              <span className="flex items-center gap-1" title="Reminder configured">
                <Bell className="w-3 h-3 text-theme-primary" />
              </span>
            )}

            {task.tags.map(t => (
              <span key={t} className="text-theme-text-muted">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-sidebar transition-all opacity-80 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setMenuOpen(false)} 
              />
              <div className="absolute right-0 top-6 z-40 w-36 py-1 bg-theme-card rounded-xl border border-theme-border shadow-floating text-xs font-medium space-y-0.5 animate-fade-in">
                {onReschedule && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onReschedule(task);
                    }}
                    className="w-full px-3 py-1.5 text-left text-theme-text-primary hover:bg-theme-sidebar flex items-center gap-2"
                  >
                    <Calendar className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Reschedule</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    snoozeTask(task.id, 60);
                  }}
                  className="w-full px-3 py-1.5 text-left text-theme-text-primary hover:bg-theme-sidebar flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Snooze 1h</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    deleteTask(task.id);
                  }}
                  className="w-full px-3 py-1.5 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
