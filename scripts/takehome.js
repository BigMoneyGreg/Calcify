function calculate() {
    const salary = parseFloat(document.getElementById('salary').value);
    if (isNaN(salary) || salary <= 0) {
      alert('Please enter a valid salary.');
      return;
    }
  
    // UK tax year 2025/26 example bands
    const personalAllowance = 12570;
    const basicRateLimit = 37700;
    const higherRateLimit = 125140;
  
    let taxableIncome = Math.max(0, salary - personalAllowance);
    let tax = 0;
  
    if (taxableIncome <= basicRateLimit) {
      tax = taxableIncome * 0.2;
    } else if (taxableIncome <= higherRateLimit) {
      tax = basicRateLimit * 0.2 + (taxableIncome - basicRateLimit) * 0.4;
    } else {
      tax = basicRateLimit * 0.2 + (higherRateLimit - basicRateLimit) * 0.4 + (taxableIncome - higherRateLimit) * 0.45;
    }
  
    // Simple NI calculation
    const niThreshold = 12570;
    const niRate = 0.12;
    const ni = salary > niThreshold ? (salary - niThreshold) * niRate : 0;
  
    const takeHome = salary - tax - ni;
  
    document.getElementById('result').innerHTML = `
      <p>Estimated annual take-home: <span class="text-green-700 font-bold">£${takeHome.toFixed(2)}</span></p>
      <p class="text-sm text-gray-500">(After income tax and NI)</p>
    `;
  }
  