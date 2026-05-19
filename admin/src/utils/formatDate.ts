import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'PPP');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'PPP p');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatShortDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy');
};
