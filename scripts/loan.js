function calculateLoan() {
    const principal = parseFloat(prompt("Enter loan amount (£):"));
    const rate = parseFloat(prompt("Annual interest rate (%):"));
    const term = parseInt(prompt("Term in years:"));
  
    if (isNaN(principal) || isNaN(rate) || isNaN(term)) {
      alert('Invalid input');
      return;
    }
  
    const monthlyRate = rate / 100 / 12;
    const months = term * 12;
    const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  
    alert(`Monthly Payment: £${monthlyPayment.toFixed(2)}`);
  }
  