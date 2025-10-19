function calculateCalories() {
    const weight = parseFloat(prompt("Weight (kg):"));
    const height = parseFloat(prompt("Height (cm):"));
    const age = parseInt(prompt("Age:"));
    const sex = prompt("Sex (M/F):").toUpperCase();
  
    if (isNaN(weight) || isNaN(height) || isNaN(age) || !["M","F"].includes(sex)) {
      alert("Invalid input");
      return;
    }
  
    let bmr;
    if (sex === "M") bmr = 10*weight + 6.25*height - 5*age + 5;
    else bmr = 10*weight + 6.25*height - 5*age - 161;
  
    const calories = bmr * 1.2; // sedentary multiplier
    alert(`Estimated daily calories (sedentary): ${calories.toFixed(0)} kcal`);
  }
  