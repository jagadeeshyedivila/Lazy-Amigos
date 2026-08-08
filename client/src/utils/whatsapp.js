export const generateWhatsAppReport = (dashboard) => {
  if (!dashboard) return '';

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthLabel = `${monthNames[dashboard.monthNum - 1]} ${dashboard.year}`;

  let text = `🏠 *LAZY AMIGOS*\n${monthLabel.toUpperCase()}\n\n`;
  text += `_"Evadu kattadu ra ee month?"_ 😂\n\n`;
  text += `💰 *Monthly:* ₹${dashboard.monthlyAmount.toLocaleString()}/member\n`;
  text += `👨‍👦‍👦 *Amigos:* ${dashboard.memberCount}\n\n`;
  text += `💵 *Total raavali:* ₹${dashboard.expectedCollection.toLocaleString()}\n`;
  text += `🤑 *Vachindi:* ₹${dashboard.collected.toLocaleString()}\n`;
  text += `🏃 *Inka raavali:* ₹${dashboard.pending.toLocaleString()}\n`;
  text += `━━━━━━━━━━━━━━\n\n`;

  text += `💸 *PAYMENT STATUS*\n\n`;
  dashboard.members.forEach((m) => {
    let emoji = '🔴';
    let statusText = 'Ekkadunnav ra?';
    
    if (m.status === 'PAID') {
      emoji = '✅';
      statusText = 'Kattesaadu ra. Legend. 🫡';
    } else if (m.status === 'PARTIAL') {
      emoji = '🟡';
      statusText = `Inka ₹${(m.finalPayable - m.paid).toLocaleString()} mama.`;
    }
    
    text += `${emoji} *${m.name}* — ₹${m.paid.toLocaleString()} / ₹${m.finalPayable.toLocaleString()}\n`;
    text += `   _${statusText}_\n\n`;
  });

  text += `━━━━━━━━━━━━━━\n\n`;
  text += `🧾 *DABBU EKADIKI POYINDI?*\n\n`;
  
  const roomExpenses = dashboard.expenses.filter((e) => e.expenseType === 'ROOM');
  if (roomExpenses.length > 0) {
    roomExpenses.forEach((e) => {
      let icon = '💡';
      const cat = e.category.toLowerCase();
      if (cat.includes('water')) icon = '💧';
      else if (cat.includes('gas') || cat.includes('cylinder')) icon = '🔥';
      else if (cat.includes('wifi') || cat.includes('internet')) icon = '🌐';
      else if (cat.includes('grocer') || cat.includes('food')) icon = '🛒';
      else if (cat.includes('clean') || cat.includes('broom')) icon = '🧹';
      
      const label = e.description || e.category;
      text += `${icon} *${label}* — ₹${e.amount.toLocaleString()}\n`;
    });
  } else {
    text += `😳 Wowww... Expenses zero ra!\n`;
  }
  
  text += `\n*Total Room Expenses:* ₹${dashboard.roomExpenses.toLocaleString()}\n`;
  text += `💸 *Room Balance:* ₹${dashboard.roomBalance.toLocaleString()}\n\n`;
  
  text += `━━━━━━━━━━━━━━\n\n`;
  text += `👤 *OWN EXPENSES*\n\n`;
  
  const ownExpenses = dashboard.expenses.filter((e) => e.expenseType === 'OWN');
  if (ownExpenses.length > 0) {
    const grouped = {};
    ownExpenses.forEach((e) => {
      const name = e.paidBy?.name || 'Unknown';
      grouped[name] = (grouped[name] || 0) + e.amount;
    });

    Object.entries(grouped).forEach(([name, amt]) => {
      text += `👤 *${name}* — ₹${amt.toLocaleString()}\n`;
    });
  } else {
    text += `No personal own expenses recorded.\n`;
  }
  
  text += `\n*Total Own Expenses:* ₹${dashboard.ownExpenses.toLocaleString()}\n`;
  text += `━━━━━━━━━━━━━━\n\n`;
  text += `😂 Ee month financial meeting ikkadatitho samaptam.\n\n`;
  text += `— Lazy Amigos`;

  return text;
};

export const shareToWhatsApp = (reportText) => {
  const encodedText = encodeURIComponent(reportText);
  window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
};
