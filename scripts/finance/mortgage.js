document.addEventListener("DOMContentLoaded", () => {
    const calcBtn = document.getElementById("calcBtn");
    calcBtn.addEventListener("click", calculateMortgage);
  });
  
  let mortgageChart;
  
  function calculateMortgage() {
    const loanAmount = parseFloat(document.getElementById("loanAmount").value) || 0;
    const annualInterestRate = parseFloat(document.getElementById("interestRate").value) || 0;
    const loanTerm = parseInt(document.getElementById("loanTerm").value) || 0;
    const overpayment = parseFloat(document.getElementById("overpayment").value) || 0;

    if (loanAmount <= 0 || annualInterestRate < 0 || loanTerm <= 0 || overpayment < 0) {
      alert("Please enter valid inputs.");
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
    let actualPayments = 0;
  
    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment + overpayment;
      totalInterestPaid += interestPayment;
      remainingBalance -= principalPayment;
      actualPayments += monthlyPayment + overpayment;
  
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
    document.getElementById("result").innerHTML = `
      <div class="results-box">
        <h2 class="text-lg font-bold">Results</h2>
        <p>
          <strong>Monthly Payment:</strong> 
          <span class="text-green-600 font-bold">£${formatNumber(monthlyPayment)}</span>
        </p>
        <p>
          <strong>Monthly Overpayment:</strong> 
          <span class="text-green-600 font-bold">£${formatNumber(overpayment)}</span>
        </p>
        <p>
          <strong>Total Payments:</strong> 
          <span class="text-green-600 font-bold">£${formatNumber(actualPayments)}</span>
        </p>
        <p>
          <strong>Total Interest:</strong> 
          <span class="text-green-600 font-bold">£${formatNumber(totalInterestPaid)}</span>
        </p>
        <p>
          <strong>Loan Paid Off In:</strong> 
          <span class="text-green-600 font-bold">${Math.ceil(balancesOverTime.length - 1)} Years</span>
        </p>
      </div>
    `;
  
    // Show chart
    const chartContainer = document.getElementById("chart-container");
    chartContainer.classList.remove("hidden");
  
    const ctx = document.getElementById("mortgageChart").getContext("2d");
  
    // Destroy the existing chart if it exists
    if (mortgageChart) {
      mortgageChart.destroy();
    }
  
    // Create a new chart instance
    mortgageChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: balancesOverTime.length }, (_, i) => `${i}`),
        datasets: [{
          label: "Remaining Balance Over Time",
          data: balancesOverTime,
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