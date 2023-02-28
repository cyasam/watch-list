export const formatDate = (date: Date | string) => {
  if (typeof date === 'string' && date.length === 0) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};
