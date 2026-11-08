'use client';

import React, { useState } from 'react';
import { 
  FolderKanban, Plus, CheckCircle2, Clock, 
  Flag, ChevronRight, LayoutGrid, List, Layers, X, Edit, Trash2
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { Project, Task, TaskStatus, Priority } from '@/types';
import { TaskCard } from '@/components/TaskCard';

interface ProjectsViewProps {
  onOpenQuickAdd: () => void;
}

export function ProjectsView({ onOpenQuickAdd }: ProjectsViewProps) {
  const { projects, tasks, categories, createProject, updateProject, deleteProject, updateTask } = useDayora();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'milestones'>('kanban');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.name || 'Work & Strategy');
  const [newColor, setNewColor] = useState('#529871');
  const [newPriority, setNewPriority] = useState<Priority>('high');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const projectTasks = tasks.filter(t => t.projectId === activeProject?.id);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = createProject({
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      color: newColor,
      category: newCategory,
      priority: newPriority,
      status: 'active',
      milestones: [
        { id: 'm-' + Date.now(), projectId: '', title: 'Initial Sprint Planning', completed: true },
        { id: 'm-' + (Date.now() + 1), projectId: '', title: 'Core Implementation', completed: false },
      ],
    });

    setSelectedProjectId(created.id);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeProject) return;
    const updated = activeProject.milestones.map(m => {
      if (m.id === milestoneId) return { ...m, completed: !m.completed };
      return m;
    });
    updateProject(activeProject.id, { milestones: updated });
  };

  const handleMoveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'not_started', label: 'To Do', color: 'border-slate-400' },
    { id: 'in_progress', label: 'In Progress', color: 'border-theme-primary' },
    { id: 'waiting', label: 'Waiting / Blocked', color: 'border-amber-500' },
    { id: 'completed', label: 'Done', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            Projects & Strategic Initiatives
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Organize complex responsibilities into milestones, Kanban boards, and timelines.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs sm:text-sm font-semibold shadow-subtle flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Project Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {projects.map(proj => {
          const isSelected = proj.id === activeProject?.id;
          const pTasks = tasks.filter(t => t.projectId === proj.id);
          const pDone = pTasks.filter(t => t.status === 'completed').length;
          const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;

          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`
                px-4 py-3 rounded-2xl border text-left flex-shrink-0 min-w-[200px] transition-all
                ${isSelected 
                  ? 'bg-theme-card border-theme-primary ring-2 ring-theme-glow shadow-card' 
                  : 'bg-theme-card/60 border-theme-border hover:bg-theme-card hover:border-theme-primary/30'
                }
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: proj.color || 'var(--color-primary)' }} 
                />
                <span className="text-[10px] font-bold text-theme-primary">
                  {pct}% Done
                </span>
              </div>
              <h3 className="text-xs font-bold text-theme-text-primary truncate">
                {proj.title}
              </h3>
              <div className="w-full h-1 rounded-full bg-theme-sidebar mt-2 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: proj.color || 'var(--color-primary)' }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Project Details Card */}
      {activeProject && (
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-theme-glow text-theme-primary">
                  {activeProject.category}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-theme-sidebar text-theme-text-muted">
                  {activeProject.priority} Priority
                </span>
              </div>
              <h2 className="text-lg font-bold text-theme-text-primary">
                {activeProject.title}
              </h2>
              {activeProject.description && (
                <p className="text-xs text-theme-text-secondary max-w-2xl">
                  {activeProject.description}
                </p>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-theme-sidebar border border-theme-border text-xs">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban' ? 'bg-theme-card text-theme-primary shadow-subtle font-semibold' : 'text-theme-text-secondary'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'list' ? 'bg-theme-card text-theme-primary shadow-subtle font-semibold' : 'text-theme-text-secondary'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('milestones')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  viewMode === 'milestones' ? 'bg-theme-card text-theme-primary shadow-subtle font-semibold' : 'text-theme-text-secondary'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Milestones</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map(col => {
            const columnTasks = projectTasks.filter(t => t.status === col.id);

            return (
              <div 
                key={col.id}
                className="p-3.5 rounded-2xl bg-theme-sidebar/50 border border-theme-border space-y-3 min-h-[400px] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between pb-2 border-b border-theme-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-theme-text-primary">{col.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-theme-card text-theme-text-secondary border border-theme-border">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={onOpenQuickAdd}
                    className="p-1 rounded hover:bg-theme-card text-theme-text-muted hover:text-theme-primary transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="text-center py-10 text-[11px] text-theme-text-muted/60 border border-dashed border-theme-border/60 rounded-xl">
                      Empty column
                    </div>
                  ) : (
                    columnTasks.map(t => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-theme-card border border-theme-border shadow-subtle space-y-2 group hover:border-theme-primary/40 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-theme-text-primary">
                            {t.title}
                          </h4>
                        </div>

                        {t.dueDate && (
                          <div className="text-[10px] text-theme-text-muted flex items-center gap-1">
                            <Clock className="w-3 h-3 text-theme-primary" />
                            <span>{t.dueDate}</span>
                          </div>
                        )}

                        {/* Move status buttons */}
                        <div className="pt-1.5 border-t border-theme-border/60 flex items-center justify-between text-[10px] text-theme-text-muted">
                          <span>Move:</span>
                          <div className="flex items-center gap-1">
                            {col.id !== 'not_started' && (
                              <button 
                                onClick={() => handleMoveTaskStatus(t.id, 'not_started')}
                                className="px-1.5 py-0.5 rounded bg-theme-sidebar hover:bg-theme-border text-theme-text-secondary"
                              >
                                Todo
                              </button>
                            )}
                            {col.id !== 'in_progress' && (
                              <button 
                                onClick={() => handleMoveTaskStatus(t.id, 'in_progress')}
                                className="px-1.5 py-0.5 rounded bg-theme-sidebar hover:bg-theme-border text-theme-text-secondary"
                              >
                                Prog
                              </button>
                            )}
                            {col.id !== 'completed' && (
                              <button 
                                onClick={() => handleMoveTaskStatus(t.id, 'completed')}
                                className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={onOpenQuickAdd}
                  className="w-full py-1.5 rounded-xl border border-dashed border-theme-border bg-theme-card/50 hover:bg-theme-card text-xs font-medium text-theme-text-muted hover:text-theme-primary transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2.5">
          {projectTasks.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-theme-card border border-dashed border-theme-border text-xs text-theme-text-muted">
              No tasks currently assigned to this project.
            </div>
          ) : (
            projectTasks.map(t => (
              <TaskCard key={t.id} task={t} project={activeProject} />
            ))
          )}
        </div>
      )}

      {/* Milestones View */}
      {viewMode === 'milestones' && activeProject && (
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-theme-text-primary">
              Project Milestones & Key Objectives
            </h3>
          </div>

          <div className="space-y-2.5">
            {activeProject.milestones.map(m => (
              <div
                key={m.id}
                onClick={() => handleToggleMilestone(m.id)}
                className={`
                  p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                  ${m.completed ? 'bg-theme-sidebar/40 border-theme-border opacity-70' : 'bg-theme-card border-theme-border hover:border-theme-primary/50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-lg border flex items-center justify-center transition-all
                    ${m.completed ? 'bg-theme-primary border-theme-primary text-white' : 'border-theme-border'}
                  `}>
                    {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${m.completed ? 'line-through text-theme-text-muted' : 'text-theme-text-primary'}`}>
                      {m.title}
                    </h4>
                    {m.dueDate && (
                      <span className="text-[10px] text-theme-text-muted">Target: {m.dueDate}</span>
                    )}
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.completed ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {m.completed ? 'Achieved' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-lg p-5 shadow-floating space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="text-sm font-bold text-theme-text-primary">Create New Project</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-theme-text-muted hover:text-theme-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-theme-text-secondary">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-theme-text-secondary">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Project purpose, scope, and target outcomes..."
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-theme-text-secondary">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-theme-text-secondary">Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-theme-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-theme-border hover:bg-theme-sidebar font-semibold text-theme-text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-theme-primary text-white font-semibold hover:bg-theme-primary-hover shadow-subtle"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
