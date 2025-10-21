document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const convertBtn = document.getElementById("convertBtn");
    const resultDiv = document.getElementById("result");
    const conversionRatios = document.getElementById("conversionRatios");
    const chartContainer = document.getElementById("chart-container");
    const ctx = document.getElementById("volumeChart").getContext("2d");
    let currentConversion = "cupsToMl";
    let volumeChart;
  
    // Conversion ratios
    const ratios = {
      cupsToMl: "1 Cup = 240 Milliliters",
      tbspToTsp: "1 Tablespoon = 3 Teaspoons",
      ozToMl: "1 Ounce = 29.57 Milliliters",
    };
  
    // Add event listeners to tabs
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Update active tab
        tabs.forEach((t) => t.classList.remove("tab-active"));
        tab.classList.add("tab-active");
  
        // Update current conversion
        currentConversion = tab.getAttribute("data-conversion");
  
        // Update conversion ratios
        conversionRatios.innerHTML = `<p>${ratios[currentConversion]}</p>`;
  
        // Clear result and chart
        resultDiv.innerHTML = "";
        chartContainer.classList.add("hidden");
      });
    });
  
    // Add event listener to convert button
    convertBtn.addEventListener("click", () => {
      const inputValue = parseFloat(document.getElementById("inputValue").value) || 0;
  
      if (inputValue <= 0) {
        alert("Please enter a valid value.");
        return;
      }
  
      let result = 0;
  
      // Perform conversion based on the current tab
      switch (currentConversion) {
        case "cupsToMl":
          result = inputValue * 240; // 1 cup = 240 ml
          resultDiv.innerHTML = `<p>${inputValue} cups = ${result.toFixed(2)} milliliters</p>`;
          break;
  
        case "tbspToTsp":
          result = inputValue * 3; // 1 tablespoon = 3 teaspoons
          resultDiv.innerHTML = `<p>${inputValue} tablespoons = ${result.toFixed(2)} teaspoons</p>`;
          break;
  
        case "ozToMl":
          result = inputValue * 29.57; // 1 ounce = 29.57 ml
          resultDiv.innerHTML = `<p>${inputValue} ounces = ${result.toFixed(2)} milliliters</p>`;
          break;
  
        default:
          resultDiv.innerHTML = `<p>Conversion not supported.</p>`;
          return;
      }
  
      // Show chart
      chartContainer.classList.remove("hidden");
  
      // Destroy the existing chart if it exists
      if (volumeChart) {
        volumeChart.destroy();
      }
  
      // Create a new chart instance
      volumeChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Input Value", "Converted Value"],
          datasets: [{
            label: "Volume Conversion",
            data: [inputValue, result],
            backgroundColor: ["#3182ce", "#63b3ed"],
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { 
              title: { display: true, text: "Volume" },
              beginAtZero: true,
            }
          }
        }
      });
    });
  });