function calculate() {
  const salary = parseFloat(document.getElementById('salary').value);
  const pensionPercent = parseFloat(document.getElementById('pension').value) || 0;
  const studentLoanPlan = document.getElementById('studentLoan').value;

  if (isNaN(salary) || salary <= 0) {
    alert('Please enter a valid salary.');
    return;
  }

  // UK tax year 2025/26 example bands
  const personalAllowance = 12570;
  const basicRateLimit = 37700;
  const higherRateLimit = 125140;

  // Tax calculation
  let taxableIncome = Math.max(0, salary - personalAllowance);
  let tax = 0;
  if (taxableIncome <= basicRateLimit) {
    tax = taxableIncome * 0.2;
  } else if (taxableIncome <= higherRateLimit) {
    tax = basicRateLimit * 0.2 + (taxableIncome - basicRateLimit) * 0.4;
  } else {
    tax = basicRateLimit * 0.2 + (higherRateLimit - basicRateLimit) * 0.4 + (taxableIncome - higherRateLimit) * 0.45;
  }

  // National Insurance
  const niThreshold = 12570;
  const niRate = 0.12;
  const ni = salary > niThreshold ? (salary - niThreshold) * niRate : 0;

  // Pension
  const pension = (salary * pensionPercent) / 100;

  // Student loan calculation
  let studentLoan = 0;
  const annualIncomes = {
    plan1: 24390,
    plan2: 27295,
    plan4: 27660,
    postgrad: 21000
  };
  if (studentLoanPlan !== 'none') {
    const threshold = annualIncomes[studentLoanPlan];
    const rate = studentLoanPlan === 'postgrad' ? 0.06 : 0.09;
    studentLoan = Math.max(0, (salary - threshold) * rate);
  }

  const totalDeductions = tax + ni + pension + studentLoan;
  const takeHome = salary - totalDeductions;

  // Update result text
  document.getElementById('result').innerHTML = `
    <p>Estimated annual take-home: <span class="text-green-700 font-bold">£${takeHome.toFixed(2)}</span></p>
    <p class="text-sm text-gray-500">(After tax, NI, pension & student loan)</p>
  `;

  // Chart
  const ctx = document.getElementById('breakdownChart').getContext('2d');
  if (window.breakdownChart) window.breakdownChart.destroy();

  window.breakdownChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Tax', 'NI', 'Pension', 'Student Loan', 'Take-home'],
      datasets: [{
        data: [tax, ni, pension, studentLoan, takeHome],
        backgroundColor: [
          '#ef4444', // red
          '#f97316', // orange
          '#3b82f6', // blue
          '#8b5cf6', // purple
          '#22c55e'  // green
        ],
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
      }
    }
  });
}
