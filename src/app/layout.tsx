import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dayora – Advanced Smart To-Do List & Productivity Platform',
  description: 'Make Time for What Matters. Intelligent task management, smart reminders, missed-task escalation, habit tracking, and calming custom themes.',
  keywords: ['productivity', 'to-do list', 'smart reminders', 'missed tasks', 'habit tracker', 'focus mode', 'time blocking'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased selection:bg-theme-primary/20 selection:text-theme-primary">
        {children}
      </body>
    </html>
  );
}
