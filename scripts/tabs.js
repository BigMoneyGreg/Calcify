const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Hide all contents
    contents.forEach(c => c.classList.add('hidden'));

    // Remove active style from all tabs
    tabs.forEach(t => {
      t.classList.remove('tab-active');
      t.classList.add('tab-inactive');
    });

    // Show selected tab content
    document.getElementById(target).classList.remove('hidden');

    // Style selected tab
    tab.classList.add('tab-active');
    tab.classList.remove('tab-inactive');
  });
});