'use client';

import React, { useState } from 'react';
import { 
  Palette, Sparkles, Check, RefreshCw, 
  Sun, Moon, Feather, Eye, Save, Trash2 
} from 'lucide-react';
import { useDayora } from '@/hooks/useDayora';
import { PREDEFINED_THEMES, COLOR_PALETTE, PALETTE_FAMILIES } from '@/lib/palette';
import { ThemeDefinition } from '@/types';

export function ThemeStudioView() {
  const { preferences, customThemes, updatePreferences, saveCustomTheme, resetToDefault } = useDayora();

  // Active theme selection
  const allThemes = [...PREDEFINED_THEMES, ...customThemes];
  const activeTheme = allThemes.find(t => t.id === preferences.themeId) || PREDEFINED_THEMES[0];

  // Selected Family filter for the 100-color palette browser
  const [activeFamily, setActiveFamily] = useState<string>('Emerald & Green');

  // Custom Theme Builder state
  const [customName, setCustomName] = useState('My Custom Theme');
  const [customPrimary, setCustomPrimary] = useState(activeTheme.colors.primary);
  const [customSecondary, setCustomSecondary] = useState(activeTheme.colors.secondary);
  const [customBg, setCustomBg] = useState(activeTheme.colors.background);
  const [customCard, setCustomCard] = useState(activeTheme.colors.backgroundCard);
  const [customSidebar, setCustomSidebar] = useState(activeTheme.colors.backgroundSidebar);
  const [customMode, setCustomMode] = useState<'light' | 'dark' | 'soft_neutral'>(activeTheme.mode);
  const [activeTexture, setActiveTexture] = useState<typeof preferences.activeBackgroundTexture>(preferences.activeBackgroundTexture);

  // Apply theme handler
  const handleSelectTheme = (themeId: string) => {
    updatePreferences({ themeId });
  };

  // Texture selector handler
  const handleSelectTexture = (texture: typeof preferences.activeBackgroundTexture) => {
    setActiveTexture(texture);
    updatePreferences({ activeBackgroundTexture: texture });
  };

  // Save new custom theme
  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const newTheme: ThemeDefinition = {
      id: 'custom-' + Date.now(),
      name: customName.trim() || 'Custom Theme',
      description: 'Personalized user theme created in Theme Studio.',
      family: 'Custom',
      mode: customMode,
      isCustom: true,
      colors: {
        primary: customPrimary,
        primaryHover: customPrimary,
        secondary: customSecondary,
        background: customBg,
        backgroundCard: customCard,
        backgroundSidebar: customSidebar,
        textPrimary: customMode === 'dark' ? '#F6F1F7' : '#1E2F23',
        textSecondary: customMode === 'dark' ? '#C5BAC9' : '#4A6353',
        textMuted: customMode === 'dark' ? '#8F8294' : '#7D9686',
        border: customMode === 'dark' ? '#3D2F44' : '#DCE6DF',
        accent: customPrimary,
        glow: `${customPrimary}25`,
      },
    };
    saveCustomTheme(newTheme);
  };

  const filteredPaletteColors = COLOR_PALETTE.filter(c => c.family === activeFamily);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-theme-text-primary tracking-tight">
            Theme Studio & Palette System
          </h1>
          <p className="text-xs text-theme-text-secondary">
            Experience 100 architectural palette colors, 10 aesthetic themes, and bespoke styling.
          </p>
        </div>

        <button
          onClick={resetToDefault}
          className="px-3.5 py-1.5 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-sidebar text-xs font-semibold text-theme-text-secondary hover:text-theme-primary flex items-center gap-1.5 transition-all shadow-subtle self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. Predefined Curated Aesthetic Themes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-theme-text-primary">
            Curated Themes ({PREDEFINED_THEMES.length})
          </h2>
          <span className="text-xs text-theme-primary font-semibold">
            Active: {activeTheme.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {PREDEFINED_THEMES.map(theme => {
            const isActive = activeTheme.id === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                className={`
                  p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group
                  ${isActive 
                    ? 'ring-2 ring-theme-primary shadow-floating border-theme-primary bg-theme-card' 
                    : 'border-theme-border bg-theme-card/70 hover:bg-theme-card hover:border-theme-primary/40'
                  }
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-text-primary">
                      {theme.name}
                    </span>
                    {isActive && (
                      <span className="w-4 h-4 rounded-full bg-theme-primary text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-theme-text-muted line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Color Swatch Circles */}
                <div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-theme-border/60">
                  <span className="w-4 h-4 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: theme.colors.primary }} />
                  <span className="w-4 h-4 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: theme.colors.secondary }} />
                  <span className="w-4 h-4 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: theme.colors.backgroundSidebar }} />
                  <span className="w-4 h-4 rounded-full shadow-xs border border-white/20" style={{ backgroundColor: theme.colors.background }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Background Texture / Ambience */}
      <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
        <div>
          <h2 className="text-base font-bold text-theme-text-primary">
            Background Surface & Texture
          </h2>
          <p className="text-xs text-theme-text-secondary">
            Select tactile, nature-inspired surface treatments for an organic feel.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          {[
            { id: 'none', label: 'Solid Minimal' },
            { id: 'subtle_dots', label: 'Architectural Dots' },
            { id: 'linen', label: 'Woven Linen' },
            { id: 'paper', label: 'Textured Paper' },
            { id: 'gradient', label: 'Soft Aura Glow' },
          ].map(tex => (
            <button
              key={tex.id}
              onClick={() => handleSelectTexture(tex.id as any)}
              className={`
                p-3 rounded-xl border text-center font-medium transition-all
                ${preferences.activeBackgroundTexture === tex.id 
                  ? 'border-theme-primary bg-theme-glow/30 text-theme-primary font-bold shadow-subtle' 
                  : 'border-theme-border bg-theme-sidebar/50 text-theme-text-secondary hover:bg-theme-card'
                }
              `}
            >
              {tex.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 100-Color Palette Reference Browser */}
      <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-theme-text-primary">
              100-Color Architectural Palette
            </h2>
            <p className="text-xs text-theme-text-secondary">
              Extracted from the master palette reference. Click any shade to copy hex or apply as accent.
            </p>
          </div>

          {/* Family Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            {PALETTE_FAMILIES.map(fam => (
              <button
                key={fam}
                onClick={() => setActiveFamily(fam)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeFamily === fam 
                    ? 'bg-theme-primary text-white font-bold shadow-subtle' 
                    : 'bg-theme-sidebar text-theme-text-secondary hover:bg-theme-border'
                }`}
              >
                {fam}
              </button>
            ))}
          </div>
        </div>

        {/* Color Swatch Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {filteredPaletteColors.map(color => (
            <div
              key={color.id}
              onClick={() => {
                setCustomPrimary(color.hex);
                navigator.clipboard?.writeText(color.hex);
              }}
              className="p-2.5 rounded-xl border border-theme-border bg-theme-sidebar/30 hover:bg-theme-card hover:border-theme-primary/40 cursor-pointer transition-all space-y-2 group"
            >
              <div 
                className="w-full h-12 rounded-lg shadow-inner border border-black/5" 
                style={{ backgroundColor: color.hex }} 
              />
              <div>
                <div className="text-xs font-semibold text-theme-text-primary truncate">
                  {color.name}
                </div>
                <div className="text-[10px] text-theme-text-muted font-mono">
                  {color.hex}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Custom Theme Creator */}
      <div className="p-5 rounded-2xl bg-theme-card border border-theme-border shadow-subtle space-y-5">
        <div>
          <h2 className="text-base font-bold text-theme-text-primary">
            Custom Theme Builder
          </h2>
          <p className="text-xs text-theme-text-secondary">
            Personalize your exact background, sidebar, card, and primary accents.
          </p>
        </div>

        <form onSubmit={handleSaveCustom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary">Theme Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-xs text-theme-text-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-theme-text-secondary">Mode</label>
              <select
                value={customMode}
                onChange={e => setCustomMode(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-background text-xs text-theme-text-primary"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="soft_neutral">Soft Neutral</option>
              </select>
            </div>
          </div>

          {/* Color pickers grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-2.5 rounded-xl border border-theme-border bg-theme-sidebar/40 space-y-1.5">
              <label className="text-[11px] font-semibold text-theme-text-muted block">Primary Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customPrimary}
                  onChange={e => setCustomPrimary(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono">{customPrimary}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-theme-border bg-theme-sidebar/40 space-y-1.5">
              <label className="text-[11px] font-semibold text-theme-text-muted block">Secondary Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customSecondary}
                  onChange={e => setCustomSecondary(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono">{customSecondary}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-theme-border bg-theme-sidebar/40 space-y-1.5">
              <label className="text-[11px] font-semibold text-theme-text-muted block">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBg}
                  onChange={e => setCustomBg(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono">{customBg}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-theme-border bg-theme-sidebar/40 space-y-1.5">
              <label className="text-[11px] font-semibold text-theme-text-muted block">Sidebar Surface</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customSidebar}
                  onChange={e => setCustomSidebar(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono">{customSidebar}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl border border-theme-border bg-theme-sidebar/40 space-y-1.5">
              <label className="text-[11px] font-semibold text-theme-text-muted block">Card Surface</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customCard}
                  onChange={e => setCustomCard(e.target.value)}
                  className="w-7 h-7 rounded border-0 cursor-pointer"
                />
                <span className="text-xs font-mono">{customCard}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-theme-border flex items-center justify-end gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-semibold hover:bg-theme-primary-hover shadow-subtle flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Custom Theme</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
