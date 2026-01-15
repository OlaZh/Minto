const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

themeToggle.addEventListener('click', () => {
  // додаємо клас для анімації
  root.classList.add('theme-transition');

  const isDark = root.getAttribute('data-theme') === 'dark';

  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }

  // знімаємо клас після кадру
  requestAnimationFrame(() => {
    root.classList.remove('theme-transition');
  });
});
