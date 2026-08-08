export const funMessages = {
  pending: [
    "Orey mama... nee payment ekkada?",
    "Bro, inka pending aa?",
    "Dabbulu marchipoyava?",
    "Seen lo pettesava? 👀",
    "Amount ekkada ra?",
    "Andaru kattaru... nuvvu migilav."
  ],
  partial: [
    "Half-ticket payment 😂",
    "Konchem vachindi mama.",
    "Almost there ra.",
    "Balance undi bro."
  ],
  paid: [
    "Kattesaadu ra. Legend!",
    "Mana vaadu 🫡",
    "Respect bro.",
    "Finallyyyy!"
  ],
  expense: [
    "Dabbulu ekkadiki poyayi ra?",
    "Malli expense aa?",
    "Mana budget ki RIP 😂",
    "Inko bill vachindi ra."
  ],
  loaders: [
    "Dabbulu count chestunnam... 💸",
    "Accounts set chestunnam ra...",
    "Wait mama, calculator busy undi. 😂",
    "Mana financial situation analyze chestunnam..."
  ],
  errors: {
    server: "😵 Something went wrong ra. Server tho mana friendship konchem weak ga undi.",
    network: "📡 Bro, internet tho fight ayyindi. Konchem tarvata try chey.",
    login: "😬 Login avvaledu ra. Phone number/password check chey."
  }
};

export const getRandomLoader = () => {
  const list = funMessages.loaders;
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};

export const getStatusFunnyText = (status, memberId) => {
  if (!memberId) return '';
  let hash = 0;
  const str = memberId.toString();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  
  if (status === 'PAID') {
    const list = [
      "Kattesaadu ra. Legend! 🫡",
      "Mana vaadu 🤝",
      "Respect bro.",
      "Finallyyyy! 🎉"
    ];
    return list[hash % list.length];
  } else if (status === 'PARTIAL') {
    const list = [
      "Inka konchem undi mama",
      "Half-ticket ra 😂",
      "Almost there ra.",
      "Balance pending bro."
    ];
    return list[hash % list.length];
  } else {
    const list = [
      "Ekkadunnav ra? 🔴",
      "Brooo... 😭",
      "Amount ekkada? 👀",
      "Seen lo pettesava? 📱",
      "Dabbulu marchipoyava?",
      "Ee manishi inka brathike unnada?"
    ];
    return list[hash % list.length];
  }
};
