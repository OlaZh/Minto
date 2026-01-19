// ===============================
// PROFILE — DAILY CALORIES LOGIC
// ===============================

// Формула Mifflin–St Jeor
// Жінки: 10*вага + 6.25*зріст − 5*вік − 161
// Чоловіки: 10*вага + 6.25*зріст − 5*вік + 5

const normCaloriesEl = document.getElementById('normCalories');
const normProteinEl = document.getElementById('normProtein');
const normFatEl = document.getElementById('normFat');
const normCarbsEl = document.getElementById('normCarbs');
const normWaterEl = document.getElementById('normWater');

const form = document.getElementById('profileForm');
const resultEl = document.getElementById('dailyCalories');

const STORAGE_KEY = 'userProfile';

// ===============================
// CALCULATIONS
// ===============================

function calculateDailyCalories({ gender, weight, height, age, activity }) {
  const base =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  return Math.round(base * activity);
}

function calculateMacros(calories) {
  return {
    protein: Math.round((calories * 0.3) / 4),
    fat: Math.round((calories * 0.3) / 9),
    carbs: Math.round((calories * 0.4) / 4),
  };
}

// ❗ ФІКСОВАНА НОРМА ВОДИ
function calculateWater() {
  return 2.5;
}

// ===============================
// SAVE
// ===============================

function saveProfile(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // 🔗 для stats.js
  localStorage.setItem('dailyCaloriesNorm', data.calories);
  localStorage.setItem('userProtein', data.protein);
  localStorage.setItem('userFat', data.fat);
  localStorage.setItem('userCarbs', data.carbs);
  localStorage.setItem('userWater', data.water);
}

// ===============================
// LOAD
// ===============================

function loadProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  return JSON.parse(saved);
}

// ===============================
// RENDER
// ===============================

function renderResult(calories) {
  if (resultEl) {
    resultEl.textContent = `${calories} ккал`;
  }
}

function renderNorms({ calories, protein, fat, carbs, water }) {
  if (normCaloriesEl) normCaloriesEl.textContent = calories;
  if (normProteinEl) normProteinEl.textContent = protein;
  if (normFatEl) normFatEl.textContent = fat;
  if (normCarbsEl) normCarbsEl.textContent = carbs;
  if (normWaterEl) normWaterEl.textContent = water;
}

// ===============================
// INIT FROM STORAGE
// ===============================

function initProfile() {
  const saved = loadProfile();
  if (!saved || !form) return;

  const { age, height, weight, gender, activity, calories, protein, fat, carbs } = saved;

  // ✅ ФІКС: навіть для старих профілів
  const water = 2.5;

  form.age.value = age;
  form.height.value = height;
  form.weight.value = weight;
  form.gender.value = gender;

  [...form.activity].forEach((radio) => {
    radio.checked = Number(radio.value) === activity;
  });

  renderResult(calories);
  renderNorms({
    calories,
    protein,
    fat,
    carbs,
    water,
  });
}

// ===============================
// SUBMIT
// ===============================

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const profileData = {
    gender: formData.get('gender'),
    age: Number(formData.get('age')),
    height: Number(formData.get('height')),
    weight: Number(formData.get('weight')),
    activity: Number(formData.get('activity')),
  };

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
  renderResult(calories);
  renderNorms(dataToSave);
});

// ===============================
// START
// ===============================

document.addEventListener('DOMContentLoaded', initProfile);
