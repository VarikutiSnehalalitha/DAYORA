'use client';

import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Plus, Clock, CheckCircle2, AlertTriangle, Download, 
  Layers, Filter, ExternalLink
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { Task } from '@/types';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isToday, addDays, subDays 
} from 'date-fns';

interface CalendarViewProps {
  onOpenQuickAdd: (date?: string) => void;
  onOpenMissedTasks: () => void;
}

export function CalendarView({ onOpenQuickAdd, onOpenMissedTasks }: CalendarViewProps) {
  const { tasks, categories, rescheduleTask, toggleTask } = useDayora();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Month grid calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Weekly interval calculations
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Filter tasks based on settings
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (!showCompleted && t.status === 'completed') return false;
      return true;
    });
  }, [tasks, showCompleted]);

  // Tasks for selected day in month view
  const selectedDayTasks = useMemo(() => {
    const sStr = format(selectedDate, 'yyyy-MM-dd');
    return filteredTasks.filter(t => t.dueDate === sStr);
  }, [filteredTasks, selectedDate]);

  // Next / Previous navigation
  const handlePrev = () => {
    if (calendarMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (calendarMode === 'week') setCurrentDate(subDays(currentDate, 7));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (calendarMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (calendarMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  // Export to iCalendar (.ics) format
  const handleExportICS = () => {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dayora//Productivity Platform//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ];

    filteredTasks.forEach(task => {
      const cleanDate = task.dueDate.replace(/-/g, '');
      const timePart = (task.startTime || '09:00').replace(':', '') + '00';
      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:dayora-${task.id}@dayora.app`);
      icsContent.push(`DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss'Z'")}`);
      icsContent.push(`DTSTART:${cleanDate}T${timePart}`);
      icsContent.push(`SUMMARY:${task.title}`);
      if (task.description) icsContent.push(`DESCRIPTION:${task.description.replace(/\n/g, ' ')}`);
      icsContent.push('STATUS:CONFIRMED');
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');
    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dayora-schedule-${format(new Date(), 'yyyy-MM-dd')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            Schedule & Time Blocking
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Visualize your responsibilities and seamlessly reschedule with clarity.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Export to Calendar */}
          <button
            onClick={handleExportICS}
            className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-sidebar text-xs font-semibold text-theme-text-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-subtle"
            title="Download iCal file to import into Google Calendar or Apple Calendar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .ICS</span>
          </button>

          {/* Quick Add */}
          <button
            onClick={() => onOpenQuickAdd(format(selectedDate, 'yyyy-MM-dd'))}
            className="px-3.5 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs font-semibold shadow-subtle flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Task</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher and Month Nav */}
      <div className="p-4 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-theme-sidebar p-1 rounded-xl border border-theme-border">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-theme-card text-theme-text-primary transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-theme-card text-theme-text-primary transition-all"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-theme-card text-theme-text-primary transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-theme-text-primary">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle completed tasks */}
          <label className="flex items-center gap-1.5 text-xs text-theme-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={e => setShowCompleted(e.target.checked)}
              className="rounded border-theme-border text-theme-primary focus:ring-theme-primary"
            />
            <span>Show Completed</span>
          </label>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-theme-sidebar border border-theme-border text-xs">
            {(['month', 'week', 'agenda'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setCalendarMode(mode)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
                  calendarMode === mode 
                    ? 'bg-theme-card text-theme-primary shadow-subtle font-semibold' 
                    : 'text-theme-text-secondary hover:text-theme-text-primary'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Main Grid */}
      {calendarMode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: 7-Column Month Matrix */}
          <div className="lg:col-span-3 p-4 sm:p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-3">
            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-theme-text-muted pb-2 border-b border-theme-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, idx) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isCurrentDay = isToday(day);
                const dayTasks = filteredTasks.filter(t => t.dueDate === dayStr);
                const hasOverdue = dayTasks.some(t => t.status === 'overdue');

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      min-h-[75px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between
                      ${isSelected 
                        ? 'border-theme-primary ring-2 ring-theme-glow bg-theme-glow/20' 
                        : isCurrentMonth 
                          ? 'border-theme-border/60 bg-theme-card hover:bg-theme-sidebar/50' 
                          : 'border-transparent bg-theme-sidebar/20 opacity-40'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`
                        text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center
                        ${isCurrentDay ? 'bg-theme-primary text-white font-bold shadow-sm' : 'text-theme-text-primary'}
                      `}>
                        {format(day, 'd')}
                      </span>

                      {hasOverdue && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Overdue tasks" />
                      )}
                    </div>

                    {/* Task Pills */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {dayTasks.slice(0, 2).map(t => {
                        const cat = categories.find(c => c.id === t.categoryId);
                        return (
                          <div
                            key={t.id}
                            className={`
                              text-[10px] px-1.5 py-0.5 rounded truncate font-medium border
                              ${t.status === 'completed' 
                                ? 'line-through opacity-50 bg-theme-sidebar text-theme-text-muted border-transparent' 
                                : t.status === 'overdue'
                                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-200 border-amber-500/30'
                                  : 'bg-theme-sidebar/90 text-theme-text-primary border-theme-border'
                              }
                            `}
                            style={cat && t.status !== 'completed' ? { borderLeftColor: cat.color, borderLeftWidth: '3px' } : {}}
                          >
                            {t.title}
                          </div>
                        );
                      })}
                      {dayTasks.length > 2 && (
                        <span className="text-[9px] text-theme-text-muted font-bold pl-1">
                          +{dayTasks.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Day Task Detail Sidebar */}
          <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <h3 className="text-sm font-bold text-theme-text-primary">
                  {format(selectedDate, 'EEEE, MMM d')}
                </h3>
                <p className="text-[11px] text-theme-text-muted">
                  {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>

              <button
                onClick={() => onOpenQuickAdd(format(selectedDate, 'yyyy-MM-dd'))}
                className="p-1.5 rounded-lg bg-theme-primary/10 text-theme-primary hover:bg-theme-primary hover:text-white transition-all"
                title="Add task for this day"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[460px]">
              {selectedDayTasks.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <CalendarIcon className="w-8 h-8 text-theme-text-muted/40 mx-auto" />
                  <p className="text-xs text-theme-text-muted">No scheduled tasks for this day.</p>
                  <button
                    onClick={() => onOpenQuickAdd(format(selectedDate, 'yyyy-MM-dd'))}
                    className="text-xs font-semibold text-theme-primary hover:underline"
                  >
                    + Schedule something
                  </button>
                </div>
              ) : (
                selectedDayTasks.map(t => (
                  <div
                    key={t.id}
                    className={`
                      p-3 rounded-xl border text-xs space-y-1.5 transition-all
                      ${t.status === 'completed' 
                        ? 'bg-theme-sidebar/40 border-theme-border/60 opacity-60' 
                        : t.status === 'overdue'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-theme-card border-theme-border hover:border-theme-primary/40'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-theme-text-primary truncate max-w-[170px]">
                        {t.title}
                      </span>
                      <button
                        onClick={() => toggleTask(t.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center ${t.status === 'completed' ? 'bg-theme-primary text-white border-theme-primary' : 'border-theme-border'}`}
                      >
                        {t.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-theme-text-muted">
                      {t.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-theme-primary" />
                          {t.startTime}
                        </span>
                      )}
                      <span className="uppercase font-bold tracking-wide">
                        {t.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Weekly View */}
      {calendarMode === 'week' && (
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map(day => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayTasks = filteredTasks.filter(t => t.dueDate === dayStr);
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={dayStr}
                  className={`p-3 rounded-xl border min-h-[300px] flex flex-col justify-between ${
                    isCurrentDay ? 'border-theme-primary bg-theme-glow/10' : 'border-theme-border bg-theme-sidebar/30'
                  }`}
                >
                  <div className="border-b border-theme-border/60 pb-2 mb-2 text-center">
                    <div className="text-[11px] font-semibold text-theme-text-muted uppercase">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-sm font-bold mt-0.5 ${isCurrentDay ? 'text-theme-primary' : 'text-theme-text-primary'}`}>
                      {format(day, 'MMM d')}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        className="p-2 rounded-lg bg-theme-card border border-theme-border shadow-subtle text-xs space-y-1"
                      >
                        <div className="font-semibold text-theme-text-primary truncate">
                          {t.title}
                        </div>
                        {t.startTime && (
                          <div className="text-[10px] text-theme-text-muted flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-theme-primary" />
                            {t.startTime}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenQuickAdd(dayStr)}
                    className="w-full mt-2 py-1 rounded-lg border border-dashed border-theme-border hover:border-theme-primary text-[11px] font-medium text-theme-text-muted hover:text-theme-primary transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Agenda View */}
      {calendarMode === 'agenda' && (
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <h3 className="text-sm font-bold text-theme-text-primary">
            Chronological Task Agenda
          </h3>
          <div className="divide-y divide-theme-border">
            {filteredTasks
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map(t => (
                <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-theme-primary">
                        {t.dueDate}
                      </span>
                      {t.startTime && (
                        <span className="text-xs text-theme-text-muted">
                          at {t.startTime}
                        </span>
                      )}
                      {t.status === 'overdue' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className={`text-sm font-medium ${t.status === 'completed' ? 'line-through text-theme-text-muted' : 'text-theme-text-primary'}`}>
                      {t.title}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      t.status === 'completed' 
                        ? 'bg-theme-sidebar text-theme-text-muted border-theme-border' 
                        : 'bg-theme-primary text-white border-theme-primary hover:bg-theme-primary-hover shadow-subtle'
                    }`}
                  >
                    {t.status === 'completed' ? 'Done' : 'Mark Done'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
