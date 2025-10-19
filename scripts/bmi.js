function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // meters
  
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      alert('Please enter valid numbers.');
      return;
    }
  
    const bmi = weight / (height * height);
    document.getElementById('result').innerHTML = `
      Your BMI is <span class="text-green-700 font-bold">${bmi.toFixed(1)}</span>
    `;
  }
  