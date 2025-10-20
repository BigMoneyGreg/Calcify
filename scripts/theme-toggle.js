document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Load saved theme
const storedTheme = localStorage.getItem("theme");
if (storedTheme) {
  html.setAttribute("data-theme", storedTheme);
  themeToggle.textContent =
    storedTheme === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeToggle.textContent =
    next === "dark" ? "🌙 Dark Mode" : "🌞 Light Mode";
});