'use client';

import React, { useState } from 'react';
import { 
  Settings, Bell, Moon, Clock, Shield, 
  Download, Crown, CheckCircle2, User, Sparkles, Volume2
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';

interface SettingsViewProps {
  onOpenUpgradeModal: () => void;
}

export function SettingsView({ onOpenUpgradeModal }: SettingsViewProps) {
  const { preferences, updatePreferences, tasks, projects, habits } = useDayora();

  const [name, setName] = useState(preferences.name);
  const [email, setEmail] = useState(preferences.email);
  const [timezone, setTimezone] = useState(preferences.timezone);
  const [timeFormat, setTimeFormat] = useState(preferences.timeFormat);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(preferences.quietHoursEnabled);
  const [quietHoursStart, setQuietHoursStart] = useState(preferences.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(preferences.quietHoursEnd);
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);
  const [smartFollowUpEnabled, setSmartFollowUpEnabled] = useState(preferences.smartFollowUpEnabled);
  const [followUpIntervalMinutes, setFollowUpIntervalMinutes] = useState(preferences.followUpIntervalMinutes);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      name,
      email,
      timezone,
      timeFormat,
      quietHoursEnabled,
      quietHoursStart,
      quietHoursEnd,
      soundEnabled,
      smartFollowUpEnabled,
      followUpIntervalMinutes,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  // Export full JSON workspace backup
  const handleExportJSON = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      user: { name, email },
      preferences,
      tasks,
      projects,
      habits,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dayora-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Manage your personal profile, quiet hours, escalation rules, and data backups.
          </p>
        </div>

        {savedNotice && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-fade-in">
            ✓ Preferences Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Profile Information */}
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-theme-border/60 pb-3">
            <User className="w-4 h-4 text-theme-primary" />
            <h2 className="text-sm font-bold text-theme-text-primary">Personal Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-theme-text-secondary">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-theme-text-secondary">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-theme-text-secondary">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-theme-text-secondary">Clock Display Format</label>
              <select
                value={timeFormat}
                onChange={e => setTimeFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary"
              >
                <option value="12h">12-Hour (AM / PM)</option>
                <option value="24h">24-Hour (Military / ISO)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Notification Rules & Quiet Hours */}
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-theme-border/60 pb-3">
            <Bell className="w-4 h-4 text-theme-primary" />
            <h2 className="text-sm font-bold text-theme-text-primary">
              Intelligent Reminders, Quiet Hours & Escalation
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Audio chimes toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-theme-sidebar/50 border border-theme-border">
              <div className="space-y-0.5">
                <span className="font-bold text-theme-text-primary flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-theme-primary" />
                  Pleasant Sound Chimes
                </span>
                <p className="text-[11px] text-theme-text-muted">
                  Harmonic bells upon task completion and gentle double-chime for approaching deadlines.
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-theme-primary rounded focus:ring-theme-primary cursor-pointer"
              />
            </div>

            {/* Smart Follow up toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-theme-sidebar/50 border border-theme-border">
              <div className="space-y-0.5">
                <span className="font-bold text-theme-text-primary">
                  Smart Missed-Task Follow-Up Engine
                </span>
                <p className="text-[11px] text-theme-text-muted">
                  Automatically escalate unfinished tasks at set intervals (does not repeat indefinitely).
                </p>
              </div>
              <input
                type="checkbox"
                checked={smartFollowUpEnabled}
                onChange={e => setSmartFollowUpEnabled(e.target.checked)}
                className="w-4 h-4 text-theme-primary rounded focus:ring-theme-primary cursor-pointer"
              />
            </div>

            {/* Follow up interval */}
            {smartFollowUpEnabled && (
              <div className="space-y-1 pl-1">
                <label className="font-semibold text-theme-text-secondary">Follow-Up Escalation Interval</label>
                <select
                  value={followUpIntervalMinutes}
                  onChange={e => setFollowUpIntervalMinutes(Number(e.target.value))}
                  className="w-full sm:w-64 px-3 py-1.5 rounded-xl border border-theme-border bg-theme-background text-theme-text-primary font-medium"
                >
                  <option value={15}>15 Minutes after deadline</option>
                  <option value={30}>30 Minutes after deadline</option>
                  <option value={60}>1 Hour after deadline</option>
                </select>
              </div>
            )}

            {/* Quiet Hours */}
            <div className="p-3.5 rounded-xl border border-theme-border bg-theme-sidebar/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-theme-text-primary flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-theme-primary" />
                    Mindful Quiet Hours Window
                  </span>
                  <p className="text-[11px] text-theme-text-muted">
                    Suppress all notification chimes during rest hours so your sleep is protected.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={quietHoursEnabled}
                  onChange={e => setQuietHoursEnabled(e.target.checked)}
                  className="w-4 h-4 text-theme-primary rounded focus:ring-theme-primary cursor-pointer"
                />
              </div>

              {quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-theme-text-muted">Quiet Start</label>
                    <input
                      type="time"
                      value={quietHoursStart}
                      onChange={e => setQuietHoursStart(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-background text-theme-text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-theme-text-muted">Quiet End</label>
                    <input
                      type="time"
                      value={quietHoursEnd}
                      onChange={e => setQuietHoursEnd(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-background text-theme-text-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Data Portability & Backup */}
        <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-theme-text-primary flex items-center gap-1.5">
              <Download className="w-4 h-4 text-theme-primary" />
              Backup Workspace Data
            </h3>
            <p className="text-xs text-theme-text-muted">
              Export your full workspace, habits, and tasks into an offline JSON backup.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-4 py-2 rounded-xl border border-theme-border bg-theme-sidebar hover:bg-theme-card text-xs font-semibold text-theme-text-primary transition-all self-start sm:self-auto"
          >
            Export Backup (.JSON)
          </button>
        </div>

        {/* 4. Plan & Upgrades Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-theme-glow/30 to-amber-500/10 border border-theme-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-bold text-theme-text-primary">
                Current Plan: {preferences.plan.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-theme-text-secondary">
              Unlimited custom themes, smart escalation rules, and priority support.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenUpgradeModal}
            className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle transition-all self-start sm:self-auto"
          >
            Manage Subscription
          </button>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-white text-xs sm:text-sm font-semibold shadow-card transition-all"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
