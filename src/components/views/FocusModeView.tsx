'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, 
  Maximize2, Minimize2, Sparkles, CheckCircle2, 
  Clock, CloudRain, Trees, Coffee, Wind, Waves, Target
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { ambientSound } from '@/lib/audio';
import { fireTaskCompletionConfetti } from '@/lib/confetti';

interface FocusModeViewProps {
  onExit?: () => void;
}

export function FocusModeView({ onExit }: FocusModeViewProps) {
  const { tasks, logFocusSession } = useDayora();

  // Mode durations in minutes
  const MODES = {
    pomodoro: 25,
    short_break: 5,
    long_break: 15,
    deep_work: 50,
  };

  const [activeMode, setActiveMode] = useState<keyof typeof MODES>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(MODES.pomodoro * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'forest' | 'coffee_shop' | 'white_noise' | 'waves'>('none');
  const [volume, setVolume] = useState<number>(0.5);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Timer Tick Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Completed session
      setIsRunning(false);
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      logFocusSession({
        durationMinutes: MODES[activeMode],
        type: activeMode,
        ambientSound: activeSound,
        completed: true,
        taskId: selectedTaskId || undefined,
        taskTitle: selectedTask?.title || undefined,
      });
      fireTaskCompletionConfetti();
      setTimeLeft(MODES[activeMode] * 60);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, activeMode, selectedTaskId, activeSound, logFocusSession, tasks]);

  // Ambient sound change effect
  useEffect(() => {
    if (activeSound === 'none') {
      ambientSound.stop();
    } else {
      ambientSound.play(activeSound, volume);
    }
    return () => {
      ambientSound.stop();
    };
  }, [activeSound]);

  // Volume change effect
  useEffect(() => {
    ambientSound.setVolume(volume);
  }, [volume]);

  const switchMode = (mode: keyof typeof MODES) => {
    setActiveMode(mode);
    setIsRunning(false);
    setTimeLeft(MODES[mode] * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODES[activeMode] * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalSeconds = MODES[activeMode] * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  const pendingTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'cancelled');

  return (
    <div className={`
      relative rounded-3xl border border-theme-border bg-theme-card p-6 sm:p-12 transition-all duration-300 shadow-floating flex flex-col items-center justify-between min-h-[640px]
      ${isFullScreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''}
    `}>
      {/* Top Bar: Controls & Sound Switcher */}
      <div className="w-full flex items-center justify-between flex-wrap gap-4 border-b border-theme-border/60 pb-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-theme-sidebar border border-theme-border text-xs">
          <button
            onClick={() => switchMode('pomodoro')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${activeMode === 'pomodoro' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-secondary'}`}
          >
            Pomodoro (25m)
          </button>
          <button
            onClick={() => switchMode('deep_work')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${activeMode === 'deep_work' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-secondary'}`}
          >
            Deep Work (50m)
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${activeMode === 'short_break' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-secondary'}`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${activeMode === 'long_break' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-secondary'}`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Ambient Sounds Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-theme-sidebar border border-theme-border text-xs">
            <button
              onClick={() => setActiveSound('none')}
              className={`p-1.5 rounded-xl ${activeSound === 'none' ? 'bg-theme-card text-theme-primary' : 'text-theme-text-muted'}`}
              title="Silent"
            >
              <VolumeX className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSound('rain')}
              className={`p-1.5 rounded-xl ${activeSound === 'rain' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted'}`}
              title="Calming Rain"
            >
              <CloudRain className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSound('waves')}
              className={`p-1.5 rounded-xl ${activeSound === 'waves' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted'}`}
              title="Ocean Waves"
            >
              <Waves className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSound('forest')}
              className={`p-1.5 rounded-xl ${activeSound === 'forest' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted'}`}
              title="Forest Breeze"
            >
              <Trees className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveSound('coffee_shop')}
              className={`p-1.5 rounded-xl ${activeSound === 'coffee_shop' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted'}`}
              title="Coffee Shop"
            >
              <Coffee className="w-4 h-4" />
            </button>
          </div>

          {activeSound !== 'none' && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-theme-primary cursor-pointer"
              title="Sound volume"
            />
          )}

          {/* Full Screen Toggle */}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-xl border border-theme-border bg-theme-sidebar hover:bg-theme-card text-theme-text-secondary transition-all"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Focus'}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center: Big Animated Circular Timer Display */}
      <div className="py-8 flex flex-col items-center justify-center space-y-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Circular SVG Progress */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-theme-sidebar"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="var(--color-primary)"
              strokeWidth="5"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Time text in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tighter text-theme-text-primary">
              {timeFormatted}
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-theme-text-muted">
              {activeMode.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Task Linker Pill */}
        <div className="w-full max-w-md">
          <label className="text-[11px] font-semibold text-theme-text-muted mb-1 block text-center">
            Link Focus Session to a Task:
          </label>
          <select
            value={selectedTaskId}
            onChange={e => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-sidebar text-xs text-theme-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-theme-primary text-center"
          >
            <option value="">No task linked (Free focus)</option>
            {pendingTasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl border border-theme-border hover:bg-theme-sidebar text-theme-text-muted hover:text-theme-text-primary transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3.5 rounded-2xl bg-theme-primary hover:bg-theme-primary-hover text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-card hover:shadow-floating transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Zen Quote */}
      <div className="text-center text-xs text-theme-text-muted italic max-w-sm pt-4 border-t border-theme-border/60">
        "One single breath, one single task. Make Time for What Matters."
      </div>
    </div>
  );
}
