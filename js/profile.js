// ===============================
// PROFILE — DAILY CALORIES LOGIC
// ===============================

// Формула Mifflin–St Jeor
// Жінки: 10*вага + 6.25*зріст − 5*вік − 161
// Чоловіки: 10*вага + 6.25*зріст − 5*вік + 5

const form = document.getElementById('profileForm');
const resultEl = document.getElementById('dailyCalories');

const STORAGE_KEY = 'userProfile';

function calculateDailyCalories({ gender, weight, height, age, activity }) {
  const base =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  return Math.round(base * activity);
}

// ===== SAVE =====
function saveProfile(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ===== LOAD =====
function loadProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  return JSON.parse(saved);
}

// ===== RENDER RESULT =====
function renderResult(calories) {
  if (!resultEl) return;
  resultEl.textContent = `${calories} ккал`;
}

// ===== INIT FROM STORAGE =====
function initProfile() {
  const saved = loadProfile();
  if (!saved) return;

  const { age, height, weight, gender, activity, calories } = saved;

  form.age.value = age;
  form.height.value = height;
  form.weight.value = weight;
  form.gender.value = gender;

  [...form.activity].forEach((radio) => {
    radio.checked = Number(radio.value) === activity;
  });

  renderResult(calories);
}

// ===== SUBMIT =====
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

  const dataToSave = {
    ...profileData,
    calories,
  };

  saveProfile(dataToSave);
  renderResult(calories);

  // 🔗 підготовка для графіків
  // інші файли можуть брати це значення
  localStorage.setItem('dailyCaloriesNorm', calories);
});

// ===== START =====
document.addEventListener('DOMContentLoaded', initProfile);
