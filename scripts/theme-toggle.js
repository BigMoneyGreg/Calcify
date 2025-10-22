document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const rootElement = document.documentElement;

  // Load the saved theme from localStorage
  const isLightTheme = JSON.parse(localStorage.getItem("isLightTheme")) ?? true; // Default to true (light mode)
  const theme = isLightTheme ? "light" : "dark";
  rootElement.setAttribute("data-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = isLightTheme ? "🌞 Light Mode" : "🌙 Dark Mode";
  }

  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = rootElement.getAttribute("data-theme");
      const isLight = currentTheme === "light";
      const newTheme = isLight ? "dark" : "light";

      rootElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("isLightTheme", !isLight); // Save the new theme as true/false
      themeToggle.textContent = newTheme === "light" ? "🌞 Light Mode" : "🌙 Dark Mode";

      // Trigger a storage event manually for other pages to detect the change
      window.dispatchEvent(new StorageEvent("storage", { key: "isLightTheme", newValue: JSON.stringify(!isLight) }));
    });
  }
});