function calculateDateDiff() {
    const start = new Date(document.getElementById('start').value);
    const end = new Date(document.getElementById('end').value);
  
    if (isNaN(start) || isNaN(end)) {
      alert('Please select valid dates.');
      return;
    }
  
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    document.getElementById('result').innerHTML = `
      Difference: <span class="text-green-700 font-bold">${diffDays}</span> day(s)
    `;
  }
  