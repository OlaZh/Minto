document.addEventListener('DOMContentLoaded', () => {
  const dayButtons = document.querySelectorAll('.sidebar__day-btn');
  const dateEl = document.getElementById('dayDate');

  const daysUA = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота'];

  const monthsUA = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня',
  ];

  function formatDate(date) {
    const dayName = daysUA[date.getDay()];
    const day = date.getDate();
    const month = monthsUA[date.getMonth()];

    return `${dayName}, ${day} ${month}`;
  }

  function setActiveDay(index) {
    dayButtons.forEach((btn) => btn.removeAttribute('aria-current'));
    dayButtons[index].setAttribute('aria-current', 'true');

    const today = new Date();
    const diff = index - today.getDay();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);

    dateEl.textContent = formatDate(targetDate);
  }

  // 🔹 клік по днях
  dayButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      setActiveDay(index);
    });
  });

  // 🔹 стартовий день = сьогодні
  const todayIndex = new Date().getDay();
  setActiveDay(todayIndex);
});
