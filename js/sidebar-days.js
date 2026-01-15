// js/sidebar-days.js

const dayButtons = document.querySelectorAll('.sidebar__day-btn');
const titleEl = document.querySelector('.day-header__title');
const dateEl = document.querySelector('.day-header__date');

const dayNames = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'Пʼятниця', 'Субота', 'Неділя'];

const monthNames = [
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

// ---------- Знаходимо понеділок поточного тижня ----------
function getMonday(date) {
  const day = date.getDay(); // 0 (нд) - 6
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  return monday;
}

const monday = getMonday(new Date());

// ---------- Оновлення заголовка ----------
function updateHeader(dayIndex) {
  const date = new Date(monday);
  date.setDate(monday.getDate() + dayIndex);

  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  titleEl.textContent = 'Меню на день';
  dateEl.textContent = `${dayNames[dayIndex]}, ${day} ${month}`;
}

// ---------- Кліки ----------
dayButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    dayButtons.forEach((b) => b.removeAttribute('aria-current'));
    btn.setAttribute('aria-current', 'true');

    updateHeader(index);
  });
});

// ---------- Початковий стан (понеділок) ----------
updateHeader(0);
