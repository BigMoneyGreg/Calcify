document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calcBtn");
  calcBtn.addEventListener("click", calculate);
});

function calculate() {
  const salary = parseFloat(document.getElementById("salary").value);
  const pensionPercent = parseFloat(document.getElementById("pension").value) || 0;
  const studentLoanPlan = document.getElementById("studentLoan").value;

  if (isNaN(salary) || salary <= 0) {
    alert("Please enter a valid salary.");
    return;
  }

  // UK 2025/26 income tax bands
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

  // Student Loan
  let studentLoan = 0;
  const loanThresholds = {
    plan1: 24390,
    plan2: 27295,
    plan4: 27660,
    postgrad: 21000
  };
  if (studentLoanPlan !== "none") {
    const threshold = loanThresholds[studentLoanPlan];
    const rate = studentLoanPlan === "postgrad" ? 0.06 : 0.09;
    studentLoan = Math.max(0, (salary - threshold) * rate);
  }

  const totalDeductions = tax + ni + pension + studentLoan;
  const takeHome = salary - totalDeductions;

  // Monthly values
  const monthlyTakeHome = takeHome / 12;
  const monthlyTax = tax / 12;
  const monthlyNI = ni / 12;
  const monthlyPension = pension / 12;
  const monthlyLoan = studentLoan / 12;

  // Display results
  document.getElementById("result").innerHTML = `
    <div class="bg-gray-100 rounded-lg p-4 space-y-2">
      <p>Annual take-home: <span class="text-green-700 font-bold">£${takeHome.toFixed(2)}</span></p>
      <p>Monthly take-home: <span class="text-green-700 font-semibold">£${monthlyTakeHome.toFixed(2)}</span></p>
      <hr class="my-2 border-gray-300">
      <p class="text-sm text-gray-600">Tax: £${tax.toFixed(2)} / £${monthlyTax.toFixed(2)} monthly</p>
      <p class="text-sm text-gray-600">National Insurance: £${ni.toFixed(2)} / £${monthlyNI.toFixed(2)} monthly</p>
      <p class="text-sm text-gray-600">Pension: £${pension.toFixed(2)} / £${monthlyPension.toFixed(2)} monthly</p>
      <p class="text-sm text-gray-600">Student Loan: £${studentLoan.toFixed(2)} / £${monthlyLoan.toFixed(2)} monthly</p>
    </div>
  `;

  // Show chart
  const chartContainer = document.getElementById("chart-container");
  chartContainer.classList.remove("hidden");

  const ctx = document.getElementById("breakdownChart").getContext("2d");
  if (window.breakdownChart) {
    window.breakdownChart.destroy();
  }

  window.breakdownChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Tax", "NI", "Pension", "Student Loan", "Take-home"],
      datasets: [{
        data: [tax, ni, pension, studentLoan, takeHome],
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#3b82f6",
          "#8b5cf6",
          "#22c55e"
        ],
      }]
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      }
    }
  });
}
