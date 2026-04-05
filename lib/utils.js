export function getCurrentFestival() {
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  
  // Navratri (October 1-15)
  if (month === 10 && day >= 1 && day <= 15) return 'Navratri';
  
  // Diwali (November 1-14)
  if (month === 11 && day >= 1 && day <= 14) return 'Diwali';
  
  // Holi (March 20-30)
  if (month === 3 && day >= 20 && day <= 30) return 'Holi';
  
  // Eid (December 20 onwards - approximate)
  if (month === 12 && day >= 20) return 'Eid';
  
  // Christmas (December 20-31)
  if (month === 12 && day >= 20 && day <= 31) return 'Christmas';
  
  // New Year (January 1-5)
  if (month === 1 && day <= 5) return 'New Year';
  
  return null;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(price);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
