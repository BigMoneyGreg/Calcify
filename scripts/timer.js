function startTimer() {
    const minutes = parseInt(prompt("Enter minutes for countdown:"));
    if (isNaN(minutes) || minutes <= 0) {
      alert("Invalid input");
      return;
    }
  
    let seconds = minutes * 60;
    const interval = setInterval(() => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      console.log(`${m}m ${s}s remaining`);
      seconds--;
  
      if (seconds < 0) {
        clearInterval(interval);
        alert("Time's up!");
      }
    }, 1000);
  
    alert(`Timer started for ${minutes} minute(s). Check console for countdown.`);
  }
  