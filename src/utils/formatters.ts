
/**
 * Format a number as a currency string
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

/**
 * Format a date as a string
 * @param date The date to format
 * @param format The format to use (default: short)
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: format === 'short' ? '2-digit' : 'long', 
    day: 'numeric' 
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Calculate the percentage of a budget used
 * @param used Amount used
 * @param total Total budget amount
 * @returns Percentage used (0-100)
 */
export const calculatePercentage = (used: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
};

/**
 * Get a color based on a percentage value (red for high, green for low)
 * @param percentage The percentage value (0-100)
 * @returns CSS color string
 */
export const getColorFromPercentage = (percentage: number): string => {
  if (percentage >= 90) return 'text-red-500';
  if (percentage >= 75) return 'text-orange-500';
  if (percentage >= 50) return 'text-yellow-500';
  return 'text-green-500';
};

/**
 * Get a background color based on a percentage value
 * @param percentage The percentage value (0-100)
 * @returns CSS background color class
 */
export const getBgColorFromPercentage = (percentage: number): string => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * Get a CSS class for a transaction category
 * @param category The category name
 * @returns CSS class string
 */
export const getCategoryClass = (category: string): string => {
  return `category-badge category-badge-${category}`;
};

/**
 * Get a human-readable name for a category
 * @param category The category key
 * @returns Human-readable category name
 */
export const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    food: 'Food & Groceries',
    transport: 'Transportation',
    utilities: 'Bills & Utilities',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    health: 'Health & Medical',
    other: 'Other'
  };
  
  return categoryMap[category] || category;
};
