export function calculateMonthsSince(startYear, startMonth) {
  const startDate = new Date(startYear, startMonth - 1, 1);
  const now = new Date();
  
  const yearsDiff = now.getFullYear() - startDate.getFullYear();
  const monthsDiff = now.getMonth() - startDate.getMonth();
  
  let totalMonths = yearsDiff * 12 + monthsDiff;
  
  if (totalMonths < 0) {
    totalMonths = 0;
  }
  
  if (totalMonths === 0) {
    totalMonths = 1;
  }
  
  return totalMonths;
}

export function formatPeriod(startYear, startMonth, isEnglish = false) {
  const monthsSince = calculateMonthsSince(startYear, startMonth);
  
  const monthNames = isEnglish 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const startMonthName = monthNames[startMonth - 1];
  const presentText = isEnglish ? 'Present' : 'Atual';
  
  let durationText;
  if (monthsSince < 12) {
    if (monthsSince === 1) {
      durationText = isEnglish ? '1 month' : '1 mês';
    } else {
      durationText = isEnglish ? `${monthsSince} months` : `${monthsSince} meses`;
    }
  } else {
    const years = Math.floor(monthsSince / 12);
    const remainingMonths = monthsSince % 12;
    
    if (remainingMonths === 0) {
      if (years === 1) {
        durationText = isEnglish ? '1 year' : '1 ano';
      } else {
        durationText = isEnglish ? `${years} years` : `${years} anos`;
      }
    } else {
      const yearsText = years === 1 ? (isEnglish ? '1 year' : '1 ano') : (isEnglish ? `${years} years` : `${years} anos`);
      const monthsText = remainingMonths === 1 ? (isEnglish ? '1 month' : '1 mês') : (isEnglish ? `${remainingMonths} months` : `${remainingMonths} meses`);
      durationText = isEnglish ? `${yearsText} and ${monthsText}` : `${yearsText} e ${monthsText}`;
    }
  }
  
  return `${startMonthName} ${startYear} - ${presentText} (${durationText})`;
}
