import { format, addDays, nextDay, Day } from 'date-fns';
import { Priority, ReminderConfig } from '@/types';

export interface ParsedTaskResult {
  title: string;
  dueDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  priority: Priority;
  reminders: ReminderConfig[];
  tags: string[];
  notes?: string;
  matchedEntities: {
    dateText?: string;
    timeText?: string;
    priorityText?: string;
    reminderText?: string;
  };
}

export function parseNaturalLanguageTask(input: string): ParsedTaskResult {
  const text = input.trim();
  let cleanTitle = text;
  const now = new Date();
  
  let targetDate = format(now, 'yyyy-MM-dd');
  let startTime: string | undefined = undefined;
  let priority: Priority = 'medium';
  const reminders: ReminderConfig[] = [];
  const tags: string[] = [];

  const matchedEntities: ParsedTaskResult['matchedEntities'] = {};

  // 1. Extract Tags (e.g. #work #project)
  const tagMatches = text.match(/#([a-zA-Z0-9_-]+)/g);
  if (tagMatches) {
    tagMatches.forEach(tag => {
      tags.push(tag.replace('#', ''));
      cleanTitle = cleanTitle.replace(tag, '');
    });
  }

  // 2. Extract Priority
  if (/\b(urgent|asap|critical|p1)\b/i.test(text)) {
    priority = 'urgent';
    matchedEntities.priorityText = 'Urgent';
    cleanTitle = cleanTitle.replace(/\b(urgent|asap|critical|p1)\b/gi, '');
  } else if (/\b(high priority|important|p2)\b/i.test(text)) {
    priority = 'high';
    matchedEntities.priorityText = 'High Priority';
    cleanTitle = cleanTitle.replace(/\b(high priority|important|p2)\b/gi, '');
  } else if (/\b(low priority|minor|someday|p4)\b/i.test(text)) {
    priority = 'low';
    matchedEntities.priorityText = 'Low Priority';
    cleanTitle = cleanTitle.replace(/\b(low priority|minor|someday|p4)\b/gi, '');
  }

  // 3. Extract Reminders: "remind me [in / at / before]"
  const reminderMatch = text.match(/remind(?:\s+me)?(?:\s+(?:about|at|before))?\s+(\d+)\s*(mins?|minutes?|hours?|hrs?|days?)\s*(?:before)?/i);
  if (reminderMatch) {
    const val = parseInt(reminderMatch[1], 10);
    const unit = reminderMatch[2].toLowerCase();
    let offsetMinutes = 15;
    if (unit.startsWith('min')) offsetMinutes = val;
    else if (unit.startsWith('hour') || unit.startsWith('hr')) offsetMinutes = val * 60;
    else if (unit.startsWith('day')) offsetMinutes = val * 1440;

    reminders.push({
      id: 'rem-' + Date.now(),
      offsetMinutes,
      channel: 'both',
      triggered: false,
    });
    matchedEntities.reminderText = `${val} ${unit} before`;
    cleanTitle = cleanTitle.replace(reminderMatch[0], '');
  } else if (/remind me\b/i.test(text)) {
    // default 15 min reminder
    reminders.push({
      id: 'rem-' + Date.now(),
      offsetMinutes: 15,
      channel: 'both',
      triggered: false,
    });
    matchedEntities.reminderText = '15 minutes before';
    cleanTitle = cleanTitle.replace(/remind me\b/gi, '');
  }

  // 4. Extract Date
  if (/\b(?:the\s+)?day after tomorrow\b/i.test(cleanTitle)) {
    targetDate = format(addDays(now, 2), 'yyyy-MM-dd');
    matchedEntities.dateText = 'Day after tomorrow';
    cleanTitle = cleanTitle.replace(/\b(?:the\s+)?day after tomorrow\b/gi, '');
  } else if (/\btomorrow\b/i.test(cleanTitle)) {
    targetDate = format(addDays(now, 1), 'yyyy-MM-dd');
    matchedEntities.dateText = 'Tomorrow';
    cleanTitle = cleanTitle.replace(/\btomorrow\b/gi, '');
  } else if (/\btoday\b/i.test(cleanTitle)) {
    targetDate = format(now, 'yyyy-MM-dd');
    matchedEntities.dateText = 'Today';
    cleanTitle = cleanTitle.replace(/\btoday\b/gi, '');
  } else {
    // Days of the week e.g. "on Monday", "next Friday"
    const daysMap: Record<string, Day> = {
      sunday: 0, sunday_: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    const dayMatch = cleanTitle.match(/\b(?:on\s+|next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
    if (dayMatch) {
      const dayName = dayMatch[1].toLowerCase();
      const targetDay = daysMap[dayName];
      if (targetDay !== undefined) {
        const nextDate = nextDay(now, targetDay);
        targetDate = format(nextDate, 'yyyy-MM-dd');
        matchedEntities.dateText = dayMatch[0];
        cleanTitle = cleanTitle.replace(dayMatch[0], '');
      }
    }
  }

  // 5. Extract Time e.g. "at 10 AM", "at 3:30 pm", "at 14:00", "at noon"
  const timeMatch = cleanTitle.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridian = timeMatch[3]?.toLowerCase();

    if (meridian === 'pm' && hour < 12) hour += 12;
    if (meridian === 'am' && hour === 12) hour = 0;

    startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    matchedEntities.timeText = timeMatch[0];
    cleanTitle = cleanTitle.replace(timeMatch[0], '');
  } else if (/\bat noon\b/i.test(cleanTitle)) {
    startTime = '12:00';
    matchedEntities.timeText = 'at noon';
    cleanTitle = cleanTitle.replace(/\bat noon\b/gi, '');
  } else if (/\bin the morning\b/i.test(cleanTitle)) {
    startTime = '09:00';
    matchedEntities.timeText = 'morning (9:00 AM)';
    cleanTitle = cleanTitle.replace(/\bin the morning\b/gi, '');
  } else if (/\bin the afternoon\b/i.test(cleanTitle)) {
    startTime = '14:00';
    matchedEntities.timeText = 'afternoon (2:00 PM)';
    cleanTitle = cleanTitle.replace(/\bin the afternoon\b/gi, '');
  } else if (/\bin the evening\b/i.test(cleanTitle)) {
    startTime = '18:00';
    matchedEntities.timeText = 'evening (6:00 PM)';
    cleanTitle = cleanTitle.replace(/\bin the evening\b/gi, '');
  }

  // Clean remaining conjunctions like "and", "at", leading/trailing whitespace
  cleanTitle = cleanTitle
    .replace(/\s+and\s*$/i, '')
    .replace(/^\s*and\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Fallback if title became empty
  if (!cleanTitle) {
    cleanTitle = input.trim();
  }

  return {
    title: cleanTitle,
    dueDate: targetDate,
    startTime,
    priority,
    reminders,
    tags,
    matchedEntities,
  };
}
