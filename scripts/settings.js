// Settings.js: Theme toggle, tab memory, and other persistent settings

// -------- Theme Toggle --------
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Apply saved theme on load
if (localStorage.getItem('theme') === 'dark') {
  html.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  html.classList.toggle('dark');

  // Save preference
  if (html.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// -------- Persistent Tab Memory --------
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Load last active tab
const lastTab = localStorage.getItem('lastTab');
if (lastTab) {
  document.querySelector(`.tab-btn[data-tab="${lastTab}"]`)?.click();
}

// Update last tab on click
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    localStorage.setItem('lastTab', btn.dataset.tab);
  });
});

// -------- Optional: Back to Top Button --------
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.textContent = '↑ Top';
backToTop.className = 'fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded hidden';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
