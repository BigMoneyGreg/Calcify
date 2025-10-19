function calculateIdealWeight() {
    const height = parseFloat(prompt("Height (cm):"));
    const sex = prompt("Sex (M/F):").toUpperCase();
  
    if (isNaN(height) || !["M","F"].includes(sex)) {
      alert("Invalid input");
      return;
    }
  
    let idealWeight;
    if (sex === "M") idealWeight = 50 + 0.91 * (height - 152.4);
    else idealWeight = 45.5 + 0.91 * (height - 152.4);
  
    alert(`Estimated ideal weight: ${idealWeight.toFixed(1)} kg`);
  }
  