const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    // Hide all contents
    contents.forEach(c => c.classList.add('hidden'));

    // Remove active style from all tabs
    tabs.forEach(t => {
      t.classList.remove('bg-blue-600', 'text-white');
      t.classList.add('bg-gray-200', 'text-gray-800');
    });

    // Show selected tab content
    document.getElementById(target).classList.remove('hidden');

    // Style selected tab
    tab.classList.add('bg-blue-600', 'text-white');
    tab.classList.remove('bg-gray-200', 'text-gray-800');
  });
});
