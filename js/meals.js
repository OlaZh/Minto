document.addEventListener('DOMContentLoaded', () => {
  const mealsState = {
    breakfast: [],
    snack1: [],
    lunch: [],
    snack2: [],
    dinner: [],
  };

  const summaryValue = document.querySelector('.day-summary__value');

  function renderMeal(mealKey) {
    const mealBlock = document.querySelector(`.meal[data-meal="${mealKey}"]`);
    if (!mealBlock) return;

    const list = mealBlock.querySelector('.meal__recipes');
    list.innerHTML = '';

    mealsState[mealKey].forEach((item) => {
      const li = document.createElement('li');
      li.className = 'meal__recipe';

      li.innerHTML = `
        <span class="meal__recipe-name">${item.name}</span>
        <span class="meal__recipe-kcal">${item.kcal} ккал</span>
      `;

      list.appendChild(li);
    });
  }

  function renderSummary() {
    const total = Object.values(mealsState)
      .flat()
      .reduce((sum, item) => sum + item.kcal, 0);

    if (summaryValue) {
      summaryValue.textContent = `${total} ккал`;
    }
  }

  function addMealItem(mealKey) {
    const name = prompt('Назва страви');
    if (!name) return;

    const kcal = Number(prompt('Калорії'));
    if (!kcal || kcal <= 0) return;

    mealsState[mealKey].push({ name, kcal });

    renderMeal(mealKey);
    renderSummary();
  }

  document.querySelectorAll('.meal').forEach((meal) => {
    const mealKey = meal.dataset.meal;
    const btn = meal.querySelector('.meal__add-button');

    if (!mealKey || !btn) return;

    btn.addEventListener('click', () => addMealItem(mealKey));
  });
});
