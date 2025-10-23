document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#loanAmount, #interestRate, #loanTerm, #overpayment");
  inputs.forEach((input) => {
    input.addEventListener("input", calculateMortgage); // Update mortgage calculation on input change
  });
});

let mortgageChart;

// Function to display results dynamically
function displayResults(monthlyPayment, loanTermYears, message = "") {
  const resultContainer = document.getElementById("result");

  if (message) {
    resultContainer.innerHTML = `
      <div class="results-box">
        <p class="text-red-600 font-bold">${message}</p>
      </div>
    `;
  } else {
    resultContainer.innerHTML = `
      <div class="results-box">
        <p>
          <strong>Monthly Payment:</strong> 
          <span class="text-green-600 font-bold">£${monthlyPayment}</span>
        </p>
        <p>
          <strong>Loan Paid Off In:</strong> 
          <span class="text-green-600 font-bold">${loanTermYears} Years</span>
        </p>
      </div>
    `;
  }
}

// Function to create or update the chart
function updateChart(labels, data) {
  const chartContainer = document.getElementById("chart-container");
  chartContainer.classList.remove("hidden");

  const ctx = document.getElementById("mortgageChart").getContext("2d");

  if (mortgageChart) {
    // Update existing chart
    mortgageChart.data.labels = labels;
    mortgageChart.data.datasets[0].data = data;
    mortgageChart.update();
  } else {
    // Create a new chart
    mortgageChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Remaining Balance Over Time",
          data: data,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
        }]
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
        scales: {
          x: { 
            title: { display: true, text: "Years" },
            ticks: { autoSkip: true }
          },
          y: { 
            title: { display: true, text: "Remaining Balance (£)" },
            min: 0
          }
        }
      }
    });
  }
}

// Function to hide the chart and destroy it
function hideChart() {
  const chartContainer = document.getElementById("chart-container");
  chartContainer.classList.add("hidden");

  if (mortgageChart) {
    mortgageChart.destroy();
    mortgageChart = null;
  }
}

// Main mortgage calculation function
function calculateMortgage() {
  const loanAmount = parseFloat(document.getElementById("loanAmount").value) || 0;
  const annualInterestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const loanTerm = parseInt(document.getElementById("loanTerm").value) || 0;
  const overpayment = parseFloat(document.getElementById("overpayment").value) || 0;

  // Validate inputs
  if (loanTerm <= 0) {
    displayResults(null, null, "Please enter a valid loan term (greater than 0 years).");
    hideChart();
    return;
  }

  if (loanAmount === 0 || annualInterestRate === 0) {
    displayResults("0.00", "0");
    updateChart(["0"], [0]);
    return;
  }

  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  // Calculate monthly payment using the formula for an amortized loan
  const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

  let remainingBalance = loanAmount;
  const balancesOverTime = [remainingBalance];
  let totalInterestPaid = 0;

  for (let i = 1; i <= totalPayments; i++) {
    const interestPayment = remainingBalance * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment + overpayment;
    totalInterestPaid += interestPayment;
    remainingBalance -= principalPayment;

    if (remainingBalance <= 0) {
      balancesOverTime.push(0);
      break;
    }

    if (i % 12 === 0 || i === totalPayments) {
      balancesOverTime.push(Math.max(remainingBalance, 0));
    }
  }

  // Format numbers with commas
  const formatNumber = (num) => num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Display results
  displayResults(formatNumber(monthlyPayment), Math.ceil(balancesOverTime.length - 1));

  // Update chart
  const labels = Array.from({ length: balancesOverTime.length }, (_, i) => `${i}`);
  updateChart(labels, balancesOverTime);

  // Save yearly mortgage data to localStorage
  localStorage.setItem("yearlyMortgage", JSON.stringify(balancesOverTime));

  // Save loan paid off years to localStorage
  localStorage.setItem("loanPaidOffYears", Math.ceil(balancesOverTime.length - 1));
}
