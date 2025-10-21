document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("tab-active"));
      tabs.forEach((t) => t.classList.add("tab-inactive"));

      // Hide all tab contents
      contents.forEach((content) => content.classList.add("hidden"));

      // Show the selected tab content
      const target = tab.getAttribute("data-tab");
      document.getElementById(target).classList.remove("hidden");

      // Set active class on the clicked tab
      tab.classList.add("tab-active");
      tab.classList.remove("tab-inactive");
    });
  });
});