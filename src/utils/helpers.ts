export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const isBusinessOpen = (hours: Record<string, string>): boolean => {
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

  const dayHours = hours[dayOfWeek];
  if (!dayHours || dayHours.toLowerCase() === 'closed') {
    return false;
  }

  // Parse time range, e.g., "11:00 AM - 10:00 PM"
  const [openTime, closeTime] = dayHours.split(' - ').map(timeStr => {
    const [time, period] = timeStr.trim().split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalMinutes = hours * 60 + (minutes || 0);
    if (period.toUpperCase() === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      totalMinutes = 0;
    }
    return totalMinutes;
  });

  const isOpen = currentTime >= openTime && currentTime <= closeTime;
  return isOpen;
};

export const getBusinessStatus = (): boolean => {
  // Simple implementation - in a real app, this would check current time against hours
  // For mock purposes, assume all businesses are open
  return true;
};

export const debounce = <T extends (...args: never[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const formatPhoneNumber = (phone: string): string => {
  // Simple formatting - in a real app, use a proper phone number library
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};