document.addEventListener("DOMContentLoaded", () => {
  let yearlyTakeHome = [];
  let yearlySavings = [];
  let yearlyMortgage = [];
  let yearlyPension = [];
  let years = [];
  let totalPositionsChart;

  // Function to fetch yearly data
  function fetchYearlyData() {
    const currentAge = parseInt(localStorage.getItem("currentAge")) || 0;
    const retirementAge = parseInt(localStorage.getItem("retirementAge")) || 0;
    const annualTakeHome = parseFloat(localStorage.getItem("annualTakeHome")) || 0;

    // Generate years dynamically based on currentAge and retirementAge
    const totalYears = retirementAge - currentAge;
    years = Array.from({ length: totalYears + 1 }, (_, i) => currentAge + i);

    // Calculate cumulative yearly take-home pay
    yearlyTakeHome = Array.from({ length: totalYears + 1 }, (_, i) => annualTakeHome * (i + 1));

    yearlySavings = JSON.parse(localStorage.getItem("yearlySavings")) || [];
    yearlyMortgage = JSON.parse(localStorage.getItem("yearlyMortgage")) || [];
    yearlyPension = JSON.parse(localStorage.getItem("yearlyPension")) || [];

    console.log("Fetched currentAge:", currentAge);
    console.log("Fetched retirementAge:", retirementAge);
    console.log("Generated years:", years);
    console.log("Cumulative yearlyTakeHome:", yearlyTakeHome);
    console.log("Fetched yearlySavings:", yearlySavings);
    console.log("Fetched yearlyMortgage:", yearlyMortgage);
    console.log("Fetched yearlyPension:", yearlyPension);
  }

  // Function to update the graph dynamically
  function updateGraph() {
    const ctx = document.getElementById("totalPositionsChart").getContext("2d");

    if (totalPositionsChart) {
      totalPositionsChart.data.labels = years;
      totalPositionsChart.data.datasets[0].data = yearlyTakeHome;
      totalPositionsChart.data.datasets[1].data = yearlySavings;
      totalPositionsChart.data.datasets[2].data = yearlyMortgage;
      totalPositionsChart.data.datasets[3].data = yearlyPension;
      totalPositionsChart.update();
    } else {
      totalPositionsChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: years,
          datasets: [
            {
              label: "Cumulative Take-Home Pay",
              data: yearlyTakeHome,
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.2)",
              fill: false,
            },
            {
              label: "Savings Yearly",
              data: yearlySavings,
              borderColor: "#2196f3",
              backgroundColor: "rgba(33, 150, 243, 0.2)",
              fill: false,
            },
            {
              label: "Mortgage Left to Repay",
              data: yearlyMortgage,
              borderColor: "#f44336",
              backgroundColor: "rgba(244, 67, 54, 0.2)",
              fill: false,
            },
            {
              label: "Pension Yearly",
              data: yearlyPension,
              borderColor: "#ff9800",
              backgroundColor: "rgba(255, 152, 0, 0.2)",
              fill: false,
            },
          ],
        },
        options: {
          plugins: {
            legend: { position: "bottom" },
          },
          scales: {
            x: { title: { display: true, text: "Age" } },
            y: { title: { display: true, text: "Money (£)" } },
          },
        },
      });
    }
  }

  // Fetch values and update the graph
  function fetchValues() {
    console.log("Storage updated, fetching new values...");
    fetchYearlyData();
    updateGraph();
  }

  // Listen for storage changes
  window.addEventListener("storage", fetchValues);

  // Initial fetch
  fetchValues();
});