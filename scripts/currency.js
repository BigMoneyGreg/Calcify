function convertCurrency() {
    const amount = parseFloat(prompt("Enter amount in GBP:"));
    if (isNaN(amount)) {
      alert("Invalid amount");
      return;
    }
  
    const currency = prompt("Convert to (USD/EUR/JPY):").toUpperCase();
    const rates = { USD: 1.25, EUR: 1.15, JPY: 175 };
  
    if (!rates[currency]) {
      alert("Currency not supported");
      return;
    }
  
    const converted = amount * rates[currency];
    alert(`£${amount} = ${converted.toFixed(2)} ${currency}`);
  }
  