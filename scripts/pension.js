document.addEventListener("DOMContentLoaded", () => {
    const calcBtn = document.getElementById("calcBtn");
    calcBtn.addEventListener("click", calculatePension);
  });
  
  let pensionChart;
  
  function calculatePension() {
    const currentAge = parseInt(document.getElementById("currentAge").value) || 0;
    const retirementAge = parseInt(document.getElementById("retirementAge").value) || 0;
    const currentSavings = parseFloat(document.getElementById("currentSavings").value) || 0;
    const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    const annualGrowthRate = parseFloat(document.getElementById("annualGrowthRate").value) || 0;
  
    if (currentAge <= 0 || retirementAge <= currentAge || currentSavings < 0 || monthlyContribution < 0 || annualGrowthRate < 0) {
      alert("Please enter valid inputs.");
      return;
    }
  
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyGrowthRate = annualGrowthRate / 100 / 12;
  
    let totalSavings = currentSavings;
    const savingsOverTime = [totalSavings];
  
    for (let i = 1; i <= monthsToRetirement; i++) {
      totalSavings += monthlyContribution;
      totalSavings += totalSavings * monthlyGrowthRate;
  
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
          <strong>Total Savings at Retirement:</strong> 
          <span class="text-green-600 font-bold">£${formatNumber(totalSavings)}</span>
        </p>
      </div>
    `;
  
    // Show chart
    const chartContainer = document.getElementById("chart-container");
    chartContainer.classList.remove("hidden");
  
    const ctx = document.getElementById("pensionChart").getContext("2d");
  
    // Destroy the existing chart if it exists
    if (pensionChart) {
      pensionChart.destroy();
    }
  
    // Create a new chart instance
    pensionChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: yearsToRetirement + 1 }, (_, i) => `Year ${currentAge + i}`),
        datasets: [{
          label: "Projected Savings Over Time",
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
          x: { 
            title: { display: true, text: "Years" },
            ticks: { autoSkip: true }
          },
          y: { 
            title: { display: true, text: "Savings (£)" },
            min: 0
          }
        }
      }
    });
  }