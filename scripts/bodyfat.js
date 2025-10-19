function calculateBodyFat() {
    const waist = parseFloat(prompt("Waist circumference (cm):"));
    const neck = parseFloat(prompt("Neck circumference (cm):"));
    const height = parseFloat(prompt("Height (cm):"));
    const sex = prompt("Sex (M/F):").toUpperCase();
  
    if (isNaN(waist) || isNaN(neck) || isNaN(height) || !["M","F"].includes(sex)) {
      alert("Invalid input");
      return;
    }
  
    let bodyFat;
    if (sex === "M") {
      bodyFat = 495 / (1.0324 - 0.19077*Math.log10(waist - neck) + 0.15456*Math.log10(height)) - 450;
    } else {
      const hip = parseFloat(prompt("Hip circumference (cm):"));
      if (isNaN(hip)) { alert("Invalid input"); return; }
      bodyFat = 495 / (1.29579 - 0.35004*Math.log10(waist + hip - neck) + 0.22100*Math.log10(height)) - 450;
    }
  
    alert(`Estimated body fat percentage: ${bodyFat.toFixed(1)}%`);
  }
  