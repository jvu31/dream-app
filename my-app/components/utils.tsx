import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useCallback } from 'react';

export function convertSecondsToMinutesAndSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  return `${minutes}:${formattedSeconds}`;
}

export function groupTags(tags) {
  const group = tags.reduce((acc, entry) => {
    if (!acc[entry.type]) {
      acc[entry.type] = [];
    }
    acc[entry.type].push(entry);
    return acc;
  }, {});

  return group;
}

export function parseMonth(time) {
  return new Date(time).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseDay(time) {
  const date = new Date(time);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return daysOfWeek[date.getDay()];
}

export function parseTime(time) {
  const date = new Date(time);
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${hours}:${minutes} ${ampm}`;
}

export function parseTimeToDate(timeStr: string): Date | null {
  if (!timeStr) return null;

  const today = new Date();
  const [hourStr, minuteStrPart] = timeStr.split(':');
  const [minuteStr, meridiem] = minuteStrPart.split(' ');

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;

  const combined = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    minute,
    0
  );

  return isNaN(combined.getTime()) ? null : combined;
}

export function removeSeconds(time) {
  const parts = time.split(':');
  if (parts.length < 2) return time;
  const minute = parts[1];
  const ampm = time.slice(-2);
  return `${parts[0]}:${minute} ${ampm}`;
}

// Darkens a hex value by a certain factor
export function darkenHexColor(hex, factor) {
  return (
    '#' +
    [1, 3, 5]
      .map((i) => {
        const channel = parseInt(hex.substr(i, 2), 16);
        const darker = Math.round(channel * (1 - factor));
        return darker.toString().padStart(2, '0');
      })
      .join('')
  );
}
