function calculateSavings() {
    const amount = parseFloat(prompt("Enter initial savings (£):"));
    const rate = parseFloat(prompt("Enter annual interest rate (%):"));
    const years = parseInt(prompt("Enter years:"));
  
    if (isNaN(amount) || isNaN(rate) || isNaN(years)) {
      alert('Invalid input');
      return;
    }
  
    const finalAmount = amount * Math.pow(1 + rate/100, years);
    alert(`Estimated savings after ${years} years: £${finalAmount.toFixed(2)}`);
  }
  