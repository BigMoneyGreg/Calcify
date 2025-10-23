document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#currentAge, #retirementAge, #currentSavings, #monthlyContribution, #annualGrowthRate");
  inputs.forEach((input) => {
    input.addEventListener("input", updatePensionGraph); // Update graph on input change
  });

  // Set the default value for monthly contribution from takehome.js
  updateMonthlyContributionFromLocalStorage();

  // Listen for changes to localStorage and update the monthly contribution dynamically
  window.addEventListener("storage", (event) => {
    if (event.key === "monthlyPensionContribution") {
      updateMonthlyContributionFromLocalStorage();
      updatePensionGraph(); // Recalculate the pension graph with the updated value
    }
  });
});

let pensionChart;

// Function to update the monthly contribution input from localStorage
function updateMonthlyContributionFromLocalStorage() {
  const monthlyPensionContribution = parseFloat(localStorage.getItem("monthlyPensionContribution")) || 0;
  console.log("Retrieved monthlyPensionContribution:", monthlyPensionContribution);
  document.getElementById("monthlyContribution").value = monthlyPensionContribution.toFixed(2);
}

function updatePensionGraph() {
  const currentAge = parseInt(document.getElementById("currentAge").value) || 0;
  const retirementAge = parseInt(document.getElementById("retirementAge").value) || 0;
  const currentSavings = parseFloat(document.getElementById("currentSavings").value) || 0;
  const monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
  const annualGrowthRate = parseFloat(document.getElementById("annualGrowthRate").value) || 0;

  // Save currentAge and retirementAge to localStorage
  localStorage.setItem("currentAge", currentAge);
  localStorage.setItem("retirementAge", retirementAge);

  // Calculate years until retirement
  const years = retirementAge - currentAge;

  if (years <= 0) {
    document.getElementById("result").innerHTML = `
      <div class="results-box">
        <p class="text-red-600 font-bold">Please enter a valid current age and retirement age.</p>
      </div>
    `;
    return;
  }

  // Calculate monthly growth rate
  const monthlyGrowthRate = annualGrowthRate / 100 / 12;
  let totalPension = currentSavings;
  const pensionOverTime = [totalPension];

  for (let i = 1; i <= years * 12; i++) {
    totalPension += monthlyContribution;
    totalPension += totalPension * monthlyGrowthRate;
    if (i % 12 === 0) {
      pensionOverTime.push(totalPension);
    }
  }

  // Save yearly pension data to localStorage
  localStorage.setItem("yearlyPension", JSON.stringify(pensionOverTime));

  // Save total pension to localStorage
  localStorage.setItem("totalPension", totalPension);

  // Update the graph dynamically
  const ctx = document.getElementById("pensionChart").getContext("2d");

  if (pensionChart) {
    pensionChart.data.labels = Array.from({ length: years + 1 }, (_, i) => currentAge + i);
    pensionChart.data.datasets[0].data = pensionOverTime;
    pensionChart.update();
  } else {
    pensionChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: years + 1 }, (_, i) => currentAge + i),
        datasets: [
          {
            label: "Pension Over Time",
            data: pensionOverTime,
            borderColor: "#4caf50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
        scales: {
          x: { title: { display: true, text: "Age" } },
          y: { title: { display: true, text: "Pension (£)" } },
        },
      },
    });
  }
}