'use client';

import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, AlertTriangle, 
  Calendar, ArrowUpDown, Tag, Folder, CheckCircle2 
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { TaskCard } from '@/components/TaskCard';
import { Task, Priority } from '@/types';

interface TasksViewProps {
  onOpenQuickAdd: () => void;
  onOpenMissedTasks: () => void;
}

export function TasksView({ onOpenQuickAdd, onOpenMissedTasks }: TasksViewProps) {
  const { tasks, categories, projects, tasksOverdue } = useDayora();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        const matchesTags = task.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      // Status Filter
      if (statusFilter === 'pending' && task.status === 'completed') return false;
      if (statusFilter === 'completed' && task.status !== 'completed') return false;
      if (statusFilter === 'overdue' && task.status !== 'overdue') return false;

      // Priority Filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Category Filter
      if (categoryFilter !== 'all' && task.categoryId !== categoryFilter) return false;

      // Project Filter
      if (projectFilter !== 'all' && task.projectId !== projectFilter) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityRank: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityRank[b.priority] - priorityRank[a.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, projectFilter, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            All Tasks & Responsibilities
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Manage your complete backlog, categories, and deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasksOverdue.length > 0 && (
            <button
              onClick={onOpenMissedTasks}
              className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-all flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{tasksOverdue.length} Missed</span>
            </button>
          )}

          <button
            onClick={onOpenQuickAdd}
            className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs sm:text-sm font-semibold shadow-subtle flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or #tag..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-theme-border bg-theme-background text-xs sm:text-sm text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>

          {/* Quick Status Filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-theme-sidebar border border-theme-border text-xs overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${statusFilter === 'all' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-secondary'}`}
            >
              All ({tasks.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${statusFilter === 'pending' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-secondary'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('overdue')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${statusFilter === 'overdue' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold' : 'text-theme-text-secondary'}`}
            >
              Overdue ({tasksOverdue.length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${statusFilter === 'completed' ? 'bg-theme-card text-theme-primary shadow-subtle' : 'text-theme-text-secondary'}`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Secondary dropdown filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-theme-border/60 text-xs">
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-background text-theme-text-secondary font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-background text-theme-text-secondary font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Project */}
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-background text-theme-text-secondary font-medium"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-1.5 text-theme-text-muted">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-2 py-1.5 rounded-lg border border-theme-border bg-theme-background text-theme-text-secondary font-medium"
            >
              <option value="date">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-theme-border bg-theme-card/40 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-theme-primary/40 mx-auto" />
            <h3 className="text-sm font-semibold text-theme-text-primary">
              No tasks found
            </h3>
            <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
              No tasks match your chosen filters. Create a new task or adjust search keywords.
            </p>
            <button
              onClick={onOpenQuickAdd}
              className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle transition-all"
            >
              Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const category = categories.find(c => c.id === task.categoryId);
            const project = projects.find(p => p.id === task.projectId);
            return (
              <TaskCard
                key={task.id}
                task={task}
                category={category}
                project={project}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
