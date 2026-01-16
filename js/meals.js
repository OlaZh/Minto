import { searchFood } from './food-api.js';
import { parseFoodInput } from './parse-food.js';

document.addEventListener('DOMContentLoaded', () => {
  // ================== STATE ==================
  const mealsState = {
    breakfast: [],
    snack1: [],
    lunch: [],
    snack2: [],
    dinner: [],
  };

  let activeMealKey = null;

  const summaryValue = document.querySelector('.day-summary__value');

  // ================== RENDER ==================
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
        <span class="meal__recipe-kcal">
          ${item.kcal} ккал · Б ${item.protein} · Ж ${item.fat} · В ${item.carbs}
        </span>
      `;

      list.appendChild(li);
    });
  }

  function renderSummary() {
    const total = Object.values(mealsState)
      .flat()
      .reduce(
        (acc, item) => {
          acc.kcal += item.kcal;
          acc.protein += item.protein;
          acc.fat += item.fat;
          acc.carbs += item.carbs;
          return acc;
        },
        { kcal: 0, protein: 0, fat: 0, carbs: 0 },
      );

    if (summaryValue) {
      summaryValue.textContent = `${total.kcal} ккал · Б ${total.protein} · Ж ${total.fat} · В ${total.carbs}`;
    }
  }

  // ================== MODAL ==================
  const modal = document.getElementById('foodModal');
  const modalInput = document.getElementById('foodInput');
  const modalClose = modal.querySelector('.modal__close');
  const modalOverlay = modal.querySelector('.modal__overlay');
  const modalSubmit = modal.querySelector('.modal__submit'); // кнопка "Додати"

  function openModal(mealKey) {
    activeMealKey = mealKey;
    modal.hidden = false;
    modalInput.value = '';
    modalInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    activeMealKey = null;
  }

  // ================== ADD ITEM ==================
  async function addFromModal() {
    if (!activeMealKey) return;

    const input = modalInput.value.trim();
    if (!input) return;

    const parsed = parseFoodInput(input);
    if (!parsed) {
      alert('Формат: продукт + кількість (наприклад: яблуко 50 г)');
      return;
    }

    const { name, grams } = parsed;
    const results = await searchFood(name);

    if (!results.length) {
      alert('Продукт не знайдено в базі');
      return;
    }

    const food = results[0];
    const factor = grams / 100;

    const item = {
      name: `${food.name} (${grams} г)`,
      kcal: Math.round(food.kcal * factor),
      protein: Math.round(food.protein * factor),
      fat: Math.round(food.fat * factor),
      carbs: Math.round(food.carbs * factor),
    };

    mealsState[activeMealKey].push(item);

    renderMeal(activeMealKey);
    renderSummary();
    closeModal();
  }

  // ================== EVENTS ==================
  document.querySelectorAll('.meal__add-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.meal);
    });
  });

  modalSubmit.addEventListener('click', addFromModal);

  modalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addFromModal();
    }
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
});
