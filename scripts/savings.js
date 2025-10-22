document.addEventListener("DOMContentLoaded", () => {
  const calcBtn = document.getElementById("calcBtn");
  calcBtn.addEventListener("click", calculateSavings);
});

let savingsChart;

function calculateSavings() {
  const initialSavings = parseFloat(document.getElementById("initialSavings").value) || 0;
  const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
  const annualInterestRate = parseFloat(document.getElementById("interestRate").value) || 0;
  const years = parseInt(document.getElementById("years").value) || 0;

  if (years <= 0 || annualInterestRate < 0 || monthlyContribution < 0 || initialSavings < 0) {
    alert("Please enter valid inputs.");
    return;
  }

  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const months = years * 12;

  let totalSavings = initialSavings;
  const savingsOverTime = [totalSavings];

  for (let i = 1; i <= months; i++) {
    totalSavings += monthlyContribution;
    totalSavings += totalSavings * monthlyInterestRate;
    if (i % 12 === 0) {
      savingsOverTime.push(totalSavings);
    }
  }

  // Format numbers with commas
  const formatNumber = (num) => num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Display results
  document.getElementById("result").innerHTML = `
    <div class="results-box">
      <h2 class="text-lg font-bold">Results</h2>
      <p>
        <strong>Total Savings After ${years} Years:</strong> 
        <span class="text-green-600 font-bold">£${formatNumber(totalSavings)}</span>
      </p>
    </div>
  `;

  // Show chart
  const chartContainer = document.getElementById("chart-container");
  chartContainer.classList.remove("hidden");

  const ctx = document.getElementById("savingsChart").getContext("2d");

  // If the chart already exists, update its data
  if (savingsChart) {
    savingsChart.data.labels = Array.from({ length: years + 1 }, (_, i) => `${i}`);
    savingsChart.data.datasets[0].data = savingsOverTime;
    savingsChart.update();
  } else {
    // Create a new chart instance
    savingsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: years + 1 }, (_, i) => `${i}`),
        datasets: [{
          label: "Savings Over Time",
          data: savingsOverTime,
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
          x: { title: { display: true, text: "Years" } },
          y: { title: { display: true, text: "Total Savings (£)" } },
        }
      }
    });
  }
}