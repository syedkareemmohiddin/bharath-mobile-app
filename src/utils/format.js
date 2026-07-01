const istOffset = 5.5 * 60 * 60000;

export const fmtDate = (d) => {
  if (!d) return '';
  const ist = new Date(new Date(d).getTime() + istOffset);
  return ist.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const fmtTime = (d) => {
  if (!d) return '';
  const ist = new Date(new Date(d).getTime() + istOffset);
  return ist.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

export const fmtDateTime = (d) => d ? fmtDate(d) + ' ' + fmtTime(d) : '';