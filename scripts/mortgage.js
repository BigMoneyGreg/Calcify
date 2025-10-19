function calculateMortgage() {
    const loan = parseFloat(document.getElementById('loan').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100 / 12; // monthly
    const term = parseFloat(document.getElementById('term').value) * 12; // months
  
    if (isNaN(loan) || isNaN(rate) || isNaN(term) || loan <= 0 || term <= 0) {
      alert('Please enter valid numbers.');
      return;
    }
  
    const monthly = (loan * rate) / (1 - Math.pow(1 + rate, -term));
    document.getElementById('result').innerHTML = `
      Estimated Monthly Payment: <span class="text-green-700 font-bold">£${monthly.toFixed(2)}</span>
    `;
  }
  