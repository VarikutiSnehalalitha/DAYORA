'use client';

import React, { useState } from 'react';
import { 
  X, Sparkles, Calendar, Clock, Flag, 
  Folder, Tag, Bell, Repeat, CheckSquare, Plus, Trash2, ArrowRight
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { Priority, TaskStatus, Subtask, ReminderConfig, RecurrenceRule } from '@/types';
import { parseNaturalLanguageTask } from '@/lib/nlp';
import { format } from 'date-fns';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
}

export function TaskCreateModal({ isOpen, onClose, initialDate }: TaskCreateModalProps) {
  const { categories, projects, createTask } = useDayora();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Mode: "natural" vs "standard"
  const [naturalInput, setNaturalInput] = useState('');
  const [nlpPreview, setNlpPreview] = useState<ReturnType<typeof parseNaturalLanguageTask> | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(initialDate || todayStr);
  const [startDate, setStartDate] = useState(initialDate || todayStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [projectId, setProjectId] = useState<string>('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['work']);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [recurrenceFreq, setRecurrenceFreq] = useState<RecurrenceRule['frequency']>('none');
  const [reminderOffset, setReminderOffset] = useState<number>(15);

  if (!isOpen) return null;

  // Handle Natural Language Parse
  const handleParseNatural = () => {
    if (!naturalInput.trim()) return;
    const parsed = parseNaturalLanguageTask(naturalInput);
    setNlpPreview(parsed);

    // Populate standard form fields from parsed natural text
    setTitle(parsed.title);
    setDueDate(parsed.dueDate);
    if (parsed.startTime) {
      setStartTime(parsed.startTime);
    }
    setPriority(parsed.priority);
    if (parsed.tags.length > 0) {
      setTags(parsed.tags);
    }
    if (parsed.reminders.length > 0) {
      setReminderOffset(parsed.reminders[0].offsetMinutes);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        { id: 'sub-' + Date.now(), title: newSubtaskTitle.trim(), completed: false },
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const reminders: ReminderConfig[] = [
      {
        id: 'rem-' + Date.now(),
        offsetMinutes: reminderOffset,
        channel: 'both',
        triggered: false,
      },
    ];

    const recurrence: RecurrenceRule | undefined = recurrenceFreq !== 'none' ? {
      frequency: recurrenceFreq,
      interval: 1,
    } : undefined;

    const formattedSubtasks: Subtask[] = subtasks.map((s, idx) => ({
      id: s.id,
      taskId: '',
      title: s.title,
      completed: s.completed,
      order: idx,
    }));

    createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      startDate: startDate || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      priority,
      status,
      categoryId: categoryId || undefined,
      projectId: projectId || undefined,
      tags,
      estimatedMinutes: Number(estimatedMinutes) || 30,
      subtasks: formattedSubtasks,
      reminders,
      recurrence,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-theme-card border border-theme-border rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-floating overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-theme-border flex items-center justify-between bg-theme-sidebar/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-theme-primary/10 text-theme-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-text-primary">Create New Task</h2>
              <p className="text-xs text-theme-text-muted">Type in natural language or customize details below.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-card transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Smart Natural Language Box */}
          <div className="p-3.5 rounded-xl border border-theme-primary/30 bg-theme-glow/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-theme-primary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Natural Language Quick-Add
              </span>
              <span className="text-[10px] text-theme-text-muted font-normal">
                Press Enter to parse
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={naturalInput}
                onChange={e => setNaturalInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleParseNatural();
                  }
                }}
                placeholder="e.g. Complete sprint report tomorrow at 2 PM and remind me 30 mins before #urgent"
                className="flex-1 px-3 py-2 rounded-lg border border-theme-border bg-theme-card text-xs sm:text-sm text-theme-text-primary placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
              <button
                type="button"
                onClick={handleParseNatural}
                className="px-3 py-2 rounded-lg bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle transition-all whitespace-nowrap"
              >
                Parse
              </button>
            </div>

            {nlpPreview && (
              <div className="text-[11px] p-2 rounded-lg bg-theme-card/80 border border-theme-border/60 text-theme-text-secondary flex flex-wrap gap-2 items-center">
                <span className="font-semibold text-theme-primary">Identified:</span>
                {nlpPreview.matchedEntities.dateText && (
                  <span className="bg-theme-glow px-2 py-0.5 rounded text-theme-primary">
                    Date: {nlpPreview.matchedEntities.dateText}
                  </span>
                )}
                {nlpPreview.matchedEntities.timeText && (
                  <span className="bg-theme-glow px-2 py-0.5 rounded text-theme-primary">
                    Time: {nlpPreview.matchedEntities.timeText}
                  </span>
                )}
                {nlpPreview.matchedEntities.reminderText && (
                  <span className="bg-theme-glow px-2 py-0.5 rounded text-theme-primary">
                    Reminder: {nlpPreview.matchedEntities.reminderText}
                  </span>
                )}
                {nlpPreview.matchedEntities.priorityText && (
                  <span className="bg-theme-glow px-2 py-0.5 rounded text-theme-primary">
                    Priority: {nlpPreview.matchedEntities.priorityText}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-text-secondary">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What would you like to achieve?"
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-sm text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-theme-text-secondary">Description / Context</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key notes, links, or expectations..."
              className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-theme-primary resize-none"
            />
          </div>

          {/* Schedule Grid: Date, Time & Estimated */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-theme-primary" />
                Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-theme-primary" />
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-theme-primary" />
                Est. Minutes
              </label>
              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              />
            </div>
          </div>

          {/* Priority, Category, Project */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Priority */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-theme-primary" />
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">🚨 Urgent (P1)</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-theme-primary" />
                Category
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-theme-primary" />
                Project (Optional)
              </label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              >
                <option value="">None (Independent)</option>
                {projects.map(proj => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reminder & Recurrence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-theme-primary" />
                Reminder
              </label>
              <select
                value={reminderOffset}
                onChange={e => setReminderOffset(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              >
                <option value={0}>At scheduled time</option>
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={1440}>1 day before</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-theme-primary" />
                Recurrence
              </label>
              <select
                value={recurrenceFreq}
                onChange={e => setRecurrenceFreq(e.target.value as RecurrenceRule['frequency'])}
                className="w-full px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              >
                <option value="none">No Recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Every Weekday (Mon-Fri)</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every 2 Weeks</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-theme-text-secondary flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-theme-primary" />
                Subtasks / Checklist ({subtasks.length})
              </span>
            </label>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 p-2 rounded-xl bg-theme-sidebar/50 border border-theme-border">
                {subtasks.map(st => (
                  <div key={st.id} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-theme-card text-xs border border-theme-border">
                    <span className="truncate text-theme-text-primary">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="p-1 text-theme-text-muted hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask step..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-theme-border bg-theme-card text-xs text-theme-text-primary"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg border border-theme-border bg-theme-sidebar hover:bg-theme-card text-xs font-medium text-theme-text-primary flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-theme-text-secondary flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-theme-primary" />
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-theme-glow text-theme-primary text-xs font-medium flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="tag..."
                  className="w-20 px-2 py-0.5 rounded-md border border-theme-border bg-theme-card text-xs"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-theme-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-theme-border hover:bg-theme-sidebar text-xs font-semibold text-theme-text-secondary transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-semibold shadow-subtle hover:shadow transition-all"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
