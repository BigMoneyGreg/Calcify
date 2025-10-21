document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calcBtn");
  calcBtn.addEventListener("click", calculate);
});

let breakdownChart;

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

  // Pension
  const pensionableEarnings = Math.max(0, salary);
  const pension = (pensionableEarnings * pensionPercent) / 100;

  // Tax calculation
  let taxableIncome = Math.max(0, salary - personalAllowance-pension);
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

  // Format numbers with commas
  const formatNumber = (num) => num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Display results
  document.getElementById("result").innerHTML = `
    <div class="results-box">
      <h2 class="text-lg font-bold">Results</h2>
      <p>
        <strong>Annual Take-Home:</strong> 
        <span class="text-green-600 font-bold">£${formatNumber(takeHome)}</span>
      </p>
      <p>
        <strong>Monthly Take-Home:</strong> 
        <span class="text-green-600 font-semibold">£${formatNumber(monthlyTakeHome)}</span>
      </p>
      <hr>
      <p class="text-sm">
        <strong>Tax:</strong> £${formatNumber(tax)} / £${formatNumber(monthlyTax)} monthly
      </p>
      <p class="text-sm">
        <strong>National Insurance:</strong> £${formatNumber(ni)} / £${formatNumber(monthlyNI)} monthly
      </p>
      <p class="text-sm">
        <strong>Pension:</strong> £${formatNumber(pension)} / £${formatNumber(monthlyPension)} monthly
      </p>
      <p class="text-sm">
        <strong>Student Loan:</strong> £${formatNumber(studentLoan)} / £${formatNumber(monthlyLoan)} monthly
      </p>
    </div>
  `;

  // Retrieve the footer text color from CSS variables
  const rootStyles = getComputedStyle(document.documentElement);
  const footerTextColor = rootStyles.getPropertyValue("--footer-text-color").trim();

  // Show chart
  const chartContainer = document.getElementById("chart-container");
  chartContainer.classList.remove("hidden");

  const ctx = document.getElementById("breakdownChart").getContext("2d");

  // If the chart already exists, update its data
  if (breakdownChart) {
    breakdownChart.data.datasets[0].data = [tax, ni, pension, studentLoan, takeHome];
    breakdownChart.update();
  } else {
    // Create a new chart instance
    breakdownChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Tax", "NI", "Pension", "Student Loan", "Take-home"],
        datasets: [{
          data: [tax, ni, pension, studentLoan, takeHome],
          backgroundColor: [
            "#ffcdd2", // Tax (Soft Pink)
            "#c8e6c9", // NI (Soft Green)
            "#bbdefb", // Pension (Soft Blue)
            "#e1bee7", // Student Loan (Soft Purple)
            "#fff9c4"  // Take-home (Soft Yellow)
          ],
          hoverBackgroundColor: [
            "#ef9a9a", // Tax (Darker Pink)
            "#a5d6a7", // NI (Darker Green)
            "#90caf9", // Pension (Darker Blue)
            "#ce93d8", // Student Loan (Darker Purple)
            "#fff59d"  // Take-home (Darker Yellow)
          ]
        }]
      },
      options: {
        plugins: {
          legend: { position: "bottom",
            labels: {
              color: footerTextColor // Set the labels' color to match the footer text color
            }
           },
        }
      }
    });
  }
}