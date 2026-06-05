export const sendWhatsApp = (phone, message) => {
  if (window.confirm('Send WhatsApp message to ' + phone + '?')) {
    const url = 'https://wa.me/91' + phone + '?text=' + encodeURIComponent(message);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};