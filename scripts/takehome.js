document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#salary, #pension, #studentLoan, #monthlySpend");
  inputs.forEach((input) => {
    input.addEventListener("input", updateGraph); // Update graph on input change
  });
});

let breakdownChart;

function updateGraph() {
  const salary = parseFloat(document.getElementById("salary").value) || 0;
  const pensionPercent = parseFloat(document.getElementById("pension").value) || 0;
  const studentLoanPlan = document.getElementById("studentLoan").value;
  const monthlySpend = parseFloat(document.getElementById("monthlySpend").value) || 0;

  // UK 2025/26 income tax bands
  const personalAllowance = 12570;
  const basicRateLimit = 37700;
  const higherRateLimit = 125140;

  // Pension
  const pensionableEarnings = Math.max(0, salary);
  const annualPensionContribution = (pensionableEarnings * pensionPercent) / 100;
  const monthlyPensionContribution = annualPensionContribution / 12;

  // Save the monthly pension contribution to localStorage
  localStorage.setItem("monthlyPensionContribution", monthlyPensionContribution);

  // Tax calculation
  let taxableIncome = Math.max(0, salary - personalAllowance - pension);
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
  const uel = 50270; // Upper Earnings Limit
  const niRate = 0.08; // 8% below UEL
  const niRateAboveUEL = 0.02; // 2% above UEL
  let ni = 0;
  if (salary > niThreshold) {
    const niEarnings = Math.min(salary, uel) - niThreshold;
    ni = niEarnings * niRate;
    if (salary > uel) {
      ni += (salary - uel) * niRateAboveUEL;
    }
  }

  // Student Loan
  let studentLoan = 0;
  const loanThresholds = {
    plan1: 26065,
    plan2: 28470,
    plan4: 32745,
    plan5: 25000,
    postgrad: 21000,
  };
  if (studentLoanPlan !== "none") {
    const threshold = loanThresholds[studentLoanPlan];
    const rate = studentLoanPlan === "postgrad" ? 0.06 : 0.09;
    studentLoan = Math.max(0, (salary - threshold) * rate);
  }

  const totalDeductions = tax + ni + pension + studentLoan + monthlySpend * 12;
  const takeHome = salary - totalDeductions;

  // Calculate monthly take-home pay
  const monthlyTakeHome = takeHome / 12;

  // Format numbers with commas
  const formatNumber = (num) =>
    num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Display annual and monthly take-home pay and remaining disposable income
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = `
    <div class="results-box">
      <p>
        <strong>Annual Take-Home Pay:</strong> 
        <span class="text-green-600 font-bold">£${formatNumber(takeHome)}</span>
      </p>
      <p>
        <strong>Monthly Take-Home Pay:</strong> 
        <span class="text-green-600 font-bold">£${formatNumber(monthlyTakeHome)}</span>
      </p>
    </div>
  `;

  // Update chart dynamically
  const chartContainer = document.getElementById("chart-container");
  chartContainer.classList.remove("hidden");

  const ctx = document.getElementById("breakdownChart").getContext("2d");

  if (breakdownChart) {
    breakdownChart.data.datasets[0].data = [tax, ni, pension, studentLoan, monthlySpend, takeHome];
    breakdownChart.update();
  } else {
    breakdownChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Tax", "NI", "Pension", "Student Loan", "Monthly Spend", "Take-home"],
        datasets: [
          {
            data: [tax, ni, pension, studentLoan, takeHome],
            backgroundColor: [
              "#D1CCED", // Tax (red/pink)
              "#FFFEDB", // NI (blue)
              "#F5CBDC", // Pension (Soft Blue)
              "#CBEBF7", // Student Loan (Soft Purple)
              "#FFDBD1", // Monthly Spend (Soft Orange or Grey)
              "#DCF7DE", // Take-home (Soft Yellow)
            ],
            hoverBackgroundColor: [
              "#B3A1E0", // Tax (darker red/pink)
              "#FFF5A3", // NI (darker blue)
              "#F1A8B9", // Pension (darker Soft Blue)
              "#9FE1EB", // Student Loan (darker Soft Purple)
              "#FFA78A", // Monthly Spend (darker Soft Orange or Grey)
              "#A8E6B1", // Take-home (darker Soft Yellow)
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                const navTextColor = getComputedStyle(document.documentElement).getPropertyValue("--nav-text-color").trim();
                return chart.data.labels.map((label, index) => ({
                  text: label,
                  fillStyle: dataset.hoverBackgroundColor[index],
                  strokeStyle: dataset.hoverBackgroundColor[index],
                  fontColor: navTextColor,
                  lineWidth: 1,
                  hidden: !chart.getDataVisibility(index),
                  index: index,
                }));
              },
            },
          },
        },
      },
    });
  }

  // Save yearly take-home pay to localStorage
  const yearlyTakeHome = Array.from({ length: 1 }, () => takeHome); // Assuming takeHome is annual
  localStorage.setItem("yearlyTakeHome", JSON.stringify(yearlyTakeHome));

  // Save annual take-home pay to localStorage
  localStorage.setItem("annualTakeHome", takeHome);

  // Manually trigger the storage event to notify total-position.js
  window.dispatchEvent(new Event("storage"));
}