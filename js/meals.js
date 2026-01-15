// додавання їжі
import { dayData } from './day-data.js';

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('meal__add-button')) return;

  const mealEl = e.target.closest('.meal');
  const mealType = mealEl.dataset.meal;

  const name = prompt('Назва страви');
  if (!name) return;

  const kcal = Number(prompt('Калорії'));
  if (!kcal) return;

  dayData[mealType].push({ name, kcal });

  renderMeal(mealType);
  renderTotal();
});

//Рендер прийому їжі

function renderMeal(mealType) {
  const mealEl = document.querySelector(`.meal[data-meal="${mealType}"]`);
  const list = mealEl.querySelector('.meal__recipes');

  list.innerHTML = '';

  dayData[mealType].forEach((item) => {
    const li = document.createElement('li');
    li.className = 'meal__recipe';
    li.innerHTML = `
      <span class="meal__recipe-name">${item.name}</span>
      <span class="meal__recipe-kcal">${item.kcal} ккал</span>
    `;
    list.appendChild(li);
  });
}

// ПІДРАХУНОК КАЛОРІЙ (АВТОМАТ)

function renderTotal() {
  let total = 0;

  Object.values(dayData).forEach((meal) => meal.forEach((item) => (total += item.kcal)));

  document.querySelector('.day-summary__value').textContent = `${total} ккал`;
}
