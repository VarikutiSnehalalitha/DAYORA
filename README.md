# DAYORA – Advanced Smart To-Do List & Productivity Platform

> *"Make Time for What Matters."*

Dayora is a premium, modern, fully responsive productivity web application designed to help users organize their daily lives, manage personal and professional responsibilities, build enduring habits, and never forget important deadlines.

---

## 🌟 Key Capabilities & Architecture

### 1. 🎨 100-Color Architectural Palette & Theme Studio
Dayora includes the complete 100-color palette system extracted across 8 harmonic families:
- **Emerald & Green Collection**: Soft Emerald, Eucalyptus Jade, Mossy Jade, Faded Moss, Laurel Green, Willow Green, Fern Green, Warm Sage, Dusty Sage, Olive Mist, Soft Olive, Celadon.
- **Blue & Teal Collection**: Dusky Sapphire, Velvet Sapphire, Twilight Blue, Moonlit Teal, Muted Turquoise, Sea Glass, Soft Aquamarine.
- **Purple & Wine Collection**: Dusty Amethyst, Wisteria Jewel, Hushed Violet, Heathered Plum, Velvet Aubergine, Dusty Orchid, Antique Mauve, Mulberry Wine, Garnet Rose, Soft Burgundy, Dusty Ruby, Bluebell.
- **Neutral Collection**: Antique Ivory, Aged Linen, Warm Alabaster, Bone Cream, Oatmeal, Natural Flax, Raw Silk, Sandstone, Warm Taupe, Mushroom.
- **Brown Collection**: Mocha Mist, Cocoa Bean, Walnut, Chestnut, Roasted Chestnut, Hazelnut, Almond Brown, Caramel Earth, Burnished Tan, Camel, Soft Umber, Burnt Umber, Sepia, Weathered Cedar, Terracotta Earth, Clay Beige, Dusty Sienna, Russet, Copper Brown, Mahogany.
- **Rose & Peach Collection**: Dusty Rose, Antique Rose, Tea Rose, Old Rose, Blushwood, Faded Peony, Rosewood, Soft Coral, Muted Apricot, Apricot Cream.
- **Peach & Amber Collection**: Burnished Peach, Honeyed Peach, Dusty Salmon, Muted Terracotta, Old Terracotta, Burnt Peach, Cinnamon, Soft Cinnamon, Spiced Amber, Honey Amber.
- **Gold Collection**: Antique Gold, Soft Ochre, Mustard Silk, Golden Wheat, Harvest Gold, Toasted Saffron.

#### 10 Curated Predefined Themes:
1. **Emerald Garden** – Soft emerald and sage greens inspired by lush botanicals.
2. **Ocean Mist** – Muted turquoise and dusky sapphire for tranquil clarity.
3. **Lavender Dreams** – Dusty amethyst and hushed violet.
4. **Rosewood Romance** – Antique rose and soft burgundy evoking warmth.
5. **Vanilla Cream** – Aged linen, oatmeal, and warm alabaster soft neutrals.
6. **Mocha Atelier** – Mocha mist, walnut, and caramel earth for an executive touch.
7. **Sunset Peach** – Burnished peach, terracotta, and toasted amber glow.
8. **Golden Hour** – Antique gold, golden wheat, and soft ochre.
9. **Forest Calm** – Deep mossy jade, willow, and laurel greens.
10. **Midnight Plum** – Deep velvet aubergine and twilight violet dark mode.

#### Dynamic Theme Builder:
- Live color pickers for Primary, Secondary, Background, Sidebar, and Cards.
- Light, Dark, and Soft Neutral modes.
- Nature-inspired background textures: Architectural Dots, Woven Linen, Textured Paper, Ambient Aura Glow, and Minimal Solid.
- Save custom themes with instant persistence.

---

### 2. ⚡ Intelligent Reminder & Missed-Task Management
- **Automatic Missed Deadline Detection**: Scans scheduled deadlines and proactively identifies overdue tasks without requiring page reloads.
- **Resolution Modal & Prompt**: Asks the user: *"Did you complete this task or do you need more time?"*
  - **Quick Rescheduling**: Today Evening (5 PM), Tomorrow Morning (9 AM), This Weekend, or Custom Date/Time.
  - **Snooze**: +1 Hour or +30 Minutes.
  - **Mark Completed**: Plays harmonic chime and celebratory confetti.
  - **Cancel Task**: Mindful closure of obsolete items.
- **Smart Follow-Up Escalation**: Follows up after 15m and 1 hour if pending (capped to prevent infinite notification spam).
- **Mindful Quiet Hours**: Suppresses all audio and alert chimes during rest hours (e.g. 10:00 PM – 7:00 AM).
- **Web Audio Engine**: Built-in harmonic sine/triangle bell chimes for task completions and alerts without external audio dependencies.

---

### 3. 🧠 Smart Natural Language Task Creation
- **Natural Language Parsing Engine**: Type sentences like:
  > *"Complete sprint review tomorrow at 2 PM and remind me 30 mins before #urgent"*
- Automatically extracts:
  - Task title
  - Due date (Today, Tomorrow, Day after tomorrow, Days of the week)
  - Time (AM/PM, 24h, at noon, morning, evening)
  - Reminder offset (minutes, hours, days)
  - Priority (Urgent, High, Medium, Low)
  - Category tags (#work, #fitness, #finance)
- Editable confirmation modal with subtasks checklist, recurrence, and estimated completion minutes.

---

### 4. 📅 Interactive Calendar & Time Blocking
- **Multi-View Modes**: Month Grid, Week Columns, and Chronological Agenda.
- **Interactive Day Selection**: Inspect and schedule tasks for any date.
- **Calendar Synchronization**: One-click **Export to .ICS** to import tasks into Google Calendar, Apple Calendar, or Outlook.
- Filter completed and overdue items.

---

### 5. 📂 Project Management & Kanban Boards
- **Kanban Board**: Move tasks across *To Do*, *In Progress*, *Waiting / Blocked*, and *Done*.
- **List View**: Detailed overview with category tags and deadlines.
- **Milestones Timeline**: Interactive project milestone tracker with real-time percentage completion calculation.

---

### 6. 🎯 Habit Tracker & Streaks
- **14-Day Consistency Matrix**: Click any day cell to toggle completion directly on the board.
- **Streak Counters**: Displays current streak (with flame badge) and longest streak.
- **Consistency Index**: 30-day percentage completion rate.
- Frequencies: Daily, Weekly, and Monthly.

---

### 7. 🧘 Zen Focus Mode (Pomodoro & Ambient Audio)
- Full-screen distraction-free workspace.
- **Pomodoro Timer**: 25m Pomodoro, 50m Deep Work, 5m Short Break, 15m Long Break.
- **Task Linker**: Anchor focus sessions to active tasks from your backlog.
- **Web Audio Ambient Generator**: Synthesizes real-time soothing soundscapes:
  - 🌧️ Calming Rain
  - 🌊 Ocean Waves (with slow 8s period modulation)
  - 🌲 Forest Breeze
  - ☕ Coffee Shop Hum
  - 💨 White Noise
- Session logging with celebration confetti.

---

### 8. 📊 Productivity Analytics & Data Export
- 7-day completion vs overdue comparison bar chart (Recharts).
- Priority distribution pie chart.
- Project execution breakdown meters.
- Metric scorecards: Completion Rate, Overdue Ratio, Total Focus Hours, Habit Consistency.
- **Export to CSV**: Instant data download.
- **Print / PDF Report**: Clean formatted export.

---

### 9. 🔔 Notification Center & 🔍 Global Search (Cmd+K)
- Comprehensive in-app drawer for reminders, overdue alerts, and daily morning/evening summaries.
- Browser Web Notifications API integration.
- Global Spotlight Search (Cmd+K / Ctrl+K) across titles, descriptions, and tags.

---

### 10. 👑 Free vs Pro Architecture
- **Free**: Task management, basic reminders, daily dashboard, basic themes, calendar, habit tracking.
- **Pro**: Unlimited custom themes, advanced escalation rules, natural language parsing, ambient focus soundscapes, advanced analytics with CSV/PDF export, calendar sync, JSON workspace backups.
- Includes 1-click Pro tier activation for frictionless demo evaluation.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with CSS variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Effects**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Date Utilities**: [date-fns](https://date-fns.org/)
- **Audio Synthesis**: Native Web Audio API (Synthesizers & Filters)

---

## 🚀 Getting Started

### 1. Start the Production Server
```bash
npm run start -- -p 3005
```
Or run the development server:
```bash
npm run dev -- -p 3005
```

### 2. Open the Application
Navigate to [http://localhost:3005](http://localhost:3005) in your web browser.

---

## 📄 License
MIT © Dayora Platform

