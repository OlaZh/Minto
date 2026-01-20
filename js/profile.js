// =====================================
// PROFILE — DAILY CALORIES LOGIC (FINAL FULL)
// =====================================

// ===== ELEMENTS =====
const form = document.getElementById('profileForm');
const resultEl = document.getElementById('dailyCalories');

const normProteinEl = document.getElementById('normProtein');
const normFatEl = document.getElementById('normFat');
const normCarbsEl = document.getElementById('normCarbs');
const normWaterEl = document.getElementById('normWater');

// Елементи для кастомних селектів (тепер їх три)
const genderInput = document.getElementById('genderInput');
const activityInput = document.getElementById('activityInput');
const goalInput = document.getElementById('goalInput');

// ===== STORAGE =====
const STORAGE_KEY = 'userProfile';

// =====================================
// UNIVERSAL CUSTOM SELECT LOGIC
// =====================================

// Функція для ініціалізації будь-якого кастомного селекту
function setupCustomSelect(selectId, inputId) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  if (!select || !input) return;

  const trigger = select.querySelector('.custom-select__trigger');
  const triggerText = trigger.querySelector('span');
  const options = select.querySelectorAll('.custom-select__option');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Закриваємо інші, якщо вони відкриті
    document.querySelectorAll('.custom-select').forEach((s) => {
      if (s !== select) s.classList.remove('open');
    });
    select.classList.toggle('open');
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const value = option.dataset.value;
      options.forEach((opt) => opt.classList.remove('selected'));
      option.classList.add('selected');
      triggerText.textContent = option.textContent;
      input.value = value;
      select.classList.remove('open');
    });
  });
}

// Функція для оновлення візуалу селекту при завантаженні зі Storage
function updateSelectValue(selectId, inputId, value) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  if (!select || !input) return;

  input.value = value;
  const activeOption = select.querySelector(`[data-value="${value}"]`);
  if (activeOption) {
    select
      .querySelectorAll('.custom-select__option')
      .forEach((opt) => opt.classList.remove('selected'));
    activeOption.classList.add('selected');
    select.querySelector('.custom-select__trigger span').textContent = activeOption.textContent;
  }
}

// =====================================
// CALCULATIONS
// =====================================

function calculateDailyCalories({ gender, weight, height, age, activity, goal }) {
  // 1. Базовий метаболізм
  const base =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  // 2. Множимо на активність
  let totalCalories = base * parseFloat(activity);

  // 3. Корекція відповідно до цілі
  if (goal === 'lose') {
    totalCalories *= 0.9; // -10%
  } else if (goal === 'gain') {
    totalCalories *= 1.1; // +10%
  }

  return Math.round(totalCalories);
}

function calculateMacros(calories) {
  return {
    protein: Math.round((calories * 0.3) / 4),
    fat: Math.round((calories * 0.3) / 9),
    carbs: Math.round((calories * 0.4) / 4),
  };
}

function calculateWater() {
  return 2.5;
}

// =====================================
// STORAGE HELPERS
// =====================================

function saveProfile(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem('dailyCaloriesNorm', data.calories);
  localStorage.setItem('userProtein', data.protein);
  localStorage.setItem('userFat', data.fat);
  localStorage.setItem('userCarbs', data.carbs);
  localStorage.setItem('userWater', data.water);
}

function loadProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

// =====================================
// RENDER
// =====================================

function renderCalories(calories) {
  if (!resultEl) return;
  resultEl.textContent = `${calories} ккал`;
}

function renderMacros({ protein, fat, carbs, water }) {
  if (normProteinEl) normProteinEl.textContent = protein;
  if (normFatEl) normFatEl.textContent = fat;
  if (normCarbsEl) normCarbsEl.textContent = carbs;
  if (normWaterEl) normWaterEl.textContent = water;
}

// =====================================
// INIT FROM STORAGE
// =====================================

function initProfile() {
  if (!form) return;

  // Ініціалізація трьох селектів
  setupCustomSelect('genderSelect', 'genderInput');
  setupCustomSelect('activitySelect', 'activityInput');
  setupCustomSelect('goalSelect', 'goalInput');

  // Закриття селектів при кліку поза ними
  window.addEventListener('click', () => {
    document.querySelectorAll('.custom-select').forEach((s) => s.classList.remove('open'));
  });

  const saved = loadProfile();
  if (!saved) return;

  const { age, height, weight, gender, activity, goal, calories, protein, fat, carbs } = saved;

  // Заповнення числових полів
  form.age.value = age;
  form.height.value = height;
  form.weight.value = weight;

  // Оновлення візуального стану всіх селектів
  updateSelectValue('genderSelect', 'genderInput', gender);
  updateSelectValue('activitySelect', 'activityInput', activity);
  updateSelectValue('goalSelect', 'goalInput', goal);

  renderCalories(calories);
  renderMacros({ protein, fat, carbs, water: 2.5 });
}

// =====================================
// SUBMIT
// =====================================

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  // Отримуємо дані з прихованих інпутів наших селектів
  const profileData = {
    gender: genderInput.value,
    activity: activityInput.value,
    goal: goalInput.value,
    age: Number(formData.get('age')),
    height: Number(formData.get('height')),
    weight: Number(formData.get('weight')),
  };

  // Перевірка
  if (!profileData.age || !profileData.height || !profileData.weight) {
    alert('Будь ласка, заповніть усі числові поля!');
    return;
  }

  const calories = calculateDailyCalories(profileData);
  const macros = calculateMacros(calories);
  const water = calculateWater();

  const dataToSave = {
    ...profileData,
    calories,
    protein: macros.protein,
    fat: macros.fat,
    carbs: macros.carbs,
    water,
  };

  saveProfile(dataToSave);
  renderCalories(calories);
  renderMacros(dataToSave);
});

// =====================================
// START
// =====================================

document.addEventListener('DOMContentLoaded', initProfile);
