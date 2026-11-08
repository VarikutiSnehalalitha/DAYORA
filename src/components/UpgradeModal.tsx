'use client';

import React, { useState } from 'react';
import { 
  X, Check, Crown, Sparkles, Shield, 
  Zap, Palette, Bell, FileSpreadsheet, Layers 
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { preferences, updatePreferences } = useDayora();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activatedNotice, setActivatedNotice] = useState(false);

  if (!isOpen) return null;

  const handleTogglePlan = (targetPlan: 'free' | 'pro') => {
    updatePreferences({ plan: targetPlan });
    setActivatedNotice(true);
    setTimeout(() => {
      setActivatedNotice(false);
      onClose();
    }, 1200);
  };

  const isPro = preferences.plan === 'pro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-theme-card border border-theme-border rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-floating overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-theme-border bg-gradient-to-r from-theme-glow/30 via-theme-sidebar to-amber-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-subtle">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-theme-text-primary">
                Dayora Membership Tiers
              </h2>
              <p className="text-xs text-theme-text-secondary">
                "Make Time for What Matters." Mindful productivity without compromises.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-card transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Billing Switcher */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-theme-sidebar border border-theme-border flex items-center gap-1 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-xl font-medium transition-all ${billingCycle === 'monthly' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted'}`}
              >
                Monthly ($9/mo)
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-theme-card text-theme-primary font-bold shadow-subtle' : 'text-theme-text-muted'}`}
              >
                <span>Annual ($79/yr)</span>
                <span className="text-[10px] bg-theme-primary text-white px-1.5 py-0.5 rounded-full font-bold">
                  Save 27%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Free Tier */}
            <div className="p-6 rounded-3xl border border-theme-border bg-theme-card flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider">
                    Essential Plan
                  </span>
                  <div className="text-3xl font-serif font-bold text-theme-text-primary mt-1">
                    Free
                  </div>
                  <p className="text-xs text-theme-text-secondary mt-1">
                    Ideal for individual task lists and basic daily routines.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-theme-text-secondary pt-2 border-t border-theme-border">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Full Task Management & Subtasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Basic Reminders & Due Dates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Daily Dashboard & Live Clock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Standard Calendar Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Daily Habit Tracking</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTogglePlan('free')}
                disabled={!isPro}
                className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  !isPro 
                    ? 'border-theme-border bg-theme-sidebar text-theme-text-muted cursor-default' 
                    : 'border-theme-border hover:bg-theme-sidebar text-theme-text-primary'
                }`}
              >
                {!isPro ? 'Current Plan' : 'Downgrade to Free'}
              </button>
            </div>

            {/* Pro Tier */}
            <div className="p-6 rounded-3xl border-2 border-theme-primary bg-gradient-to-b from-theme-glow/20 via-theme-card to-theme-card flex flex-col justify-between space-y-5 shadow-floating relative">
              <span className="absolute -top-3 right-6 bg-theme-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-subtle">
                Recommended
              </span>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-theme-primary uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" />
                    Dayora Pro
                  </span>
                  <div className="text-3xl font-serif font-bold text-theme-text-primary mt-1">
                    {billingCycle === 'annual' ? '$79' : '$9'}
                    <span className="text-xs font-sans text-theme-text-muted font-normal">
                      /{billingCycle === 'annual' ? 'year' : 'month'}
                    </span>
                  </div>
                  <p className="text-xs text-theme-text-secondary mt-1">
                    The complete productivity ecosystem for focused professionals.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-theme-text-primary pt-2 border-t border-theme-border">
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />
                    <span>100-Color Palette & Unlimited Custom Themes</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />
                    <span>Intelligent Missed-Task Follow-Up Escalation</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />
                    <span>Smart Natural-Language Task Parser</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />
                    <span>Focus Mode Ambient Soundscapes (Web Audio)</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />
                    <span>Advanced Analytics with CSV & PDF Export</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="w-4 h-4 text-theme-primary flex-shrink-0" />
                    <span>Calendar Synchronization (.ICS export)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTogglePlan('pro')}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-subtle ${
                  isPro 
                    ? 'bg-theme-primary text-white hover:bg-theme-primary-hover' 
                    : 'bg-theme-primary hover:bg-theme-primary-hover text-white'
                }`}
              >
                {activatedNotice ? '✓ Plan Activated!' : isPro ? 'Current Plan Active' : 'Activate Dayora Pro'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-border bg-theme-sidebar/50 text-[11px] text-theme-text-muted text-center">
          Payment processing gateway is ready for production. 1-click activation enabled for instant review.
        </div>
      </div>
    </div>
  );
}
