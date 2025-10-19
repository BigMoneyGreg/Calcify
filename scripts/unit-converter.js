function convertUnits() {
    const value = parseFloat(prompt("Enter value to convert:"));
    if (isNaN(value)) {
      alert("Invalid input");
      return;
    }
  
    const unitFrom = prompt("Convert from (m/km/mi/ft):").toLowerCase();
    const unitTo = prompt("Convert to (m/km/mi/ft):").toLowerCase();
  
    const factors = {
      m: 1,
      km: 0.001,
      mi: 0.000621371,
      ft: 3.28084
    };
  
    if (!factors[unitFrom] || !factors[unitTo]) {
      alert("Invalid units");
      return;
    }
  
    const result = value * factors[unitTo] / factors[unitFrom];
    alert(`${value} ${unitFrom} = ${result.toFixed(4)} ${unitTo}`);
  }
  