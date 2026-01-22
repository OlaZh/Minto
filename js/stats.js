// ===============================
// STATS — DAILY PROGRESS (CIRCULAR & WATER)
// ===============================

// Calories
const kcalCurrentEl = document.getElementById('kcalCurrent');
const kcalCircleEl = document.getElementById('kcalCircle');

// Macros
const pCircleEl = document.getElementById('pCircle');
const fCircleEl = document.getElementById('fCircle');
const cCircleEl = document.getElementById('cCircle');

const pCurrentEl = document.getElementById('pCurrent');
const fCurrentEl = document.getElementById('fCurrent');
const cCurrentEl = document.getElementById('cCurrent');

// Water UI Elements (Твої нові елементи з 4-ї колонки)
const waterValueEl = document.querySelector('.water-meter__value'); // Текст "1.2 / 2.5 L"
const waterFillEl = document.querySelector('.water-meter__fill'); // Синя рідина

// ===============================
// HELPERS — NORMS FROM PROFILE
// ===============================
function getWaterNorm() {
  const saved = localStorage.getItem('userWater');
  if (!saved) return 2.5;
  return Number(saved.replace(',', '.'));
}

function getDailyCaloriesNorm() {
  const saved = localStorage.getItem('dailyCaloriesNorm');
  return saved ? Number(saved) : 2000;
}

function getProteinNorm() {
  const saved = localStorage.getItem('userProtein');
  return saved ? Number(saved) : 100;
}

function getFatNorm() {
  const saved = localStorage.getItem('userFat');
  return saved ? Number(saved) : 70;
}

function getCarbsNorm() {
  const saved = localStorage.getItem('userCarbs');
  return saved ? Number(saved) : 250;
}

// ===============================
// CIRCULAR HELPERS
// ===============================

function applyCircleState(circleEl, stateClass) {
  if (!circleEl) return;
  const wrapper = circleEl.parentElement;
  circleEl.classList.add(stateClass);
  if (wrapper) wrapper.classList.add(stateClass);
}

function resetCircleState(circleEl) {
  if (!circleEl) return;
  const wrapper = circleEl.parentElement;
  circleEl.classList.remove('circle-progress--warning', 'circle-progress--over');
  if (wrapper) wrapper.classList.remove('circle-progress--warning', 'circle-progress--over');
}

function setCirclePercent(circleEl, current, max) {
  if (!circleEl || !max) return;

  const percentRaw = (current / max) * 100;
  const percent = Math.min(percentRaw, 100);

  resetCircleState(circleEl);

  if (percentRaw >= 80 && percentRaw < 100) {
    applyCircleState(circleEl, 'circle-progress--warning');
  }
  if (percentRaw >= 100) {
    applyCircleState(circleEl, 'circle-progress--over');
  }

  circleEl.style.strokeDasharray = `${percent}, 100`;
}

// ===============================
// UPDATE STATS (MAIN ENTRY)
// ===============================

export function updateStats(consumed) {
  const dailyCaloriesNorm = getDailyCaloriesNorm();
  const proteinNorm = getProteinNorm();
  const fatNorm = getFatNorm();
  const carbsNorm = getCarbsNorm();

  const kcal = consumed.kcal ?? 0;
  const protein = consumed.protein ?? 0;
  const fat = consumed.fat ?? 0;
  const carbs = consumed.carbs ?? 0;

  if (kcalCurrentEl) kcalCurrentEl.textContent = Math.round(kcal);

  setCirclePercent(kcalCircleEl, kcal, dailyCaloriesNorm);

  if (pCurrentEl) pCurrentEl.textContent = Math.round(protein);
  if (fCurrentEl) fCurrentEl.textContent = Math.round(fat);
  if (cCurrentEl) cCurrentEl.textContent = Math.round(carbs);

  setCirclePercent(pCircleEl, protein, proteinNorm);
  setCirclePercent(fCircleEl, fat, fatNorm);
  setCirclePercent(cCircleEl, carbs, carbsNorm);
}

// ===============================
// WATER TRACKER — NEW CAPSULE LOGIC
// ===============================

let currentWaterMl = 0;

/**
 * Оновлює візуальну частину води (текст і висоту наповнення)
 */
function updateWaterUI() {
  const waterNorm = getWaterNorm();
  const normMl = waterNorm * 1000;

  // Рахуємо відсоток для CSS змінної --level
  const percent = Math.min((currentWaterMl / normMl) * 100, 100);

  if (waterFillEl) {
    waterFillEl.style.setProperty('--level', `${percent}%`);
  }

  if (waterValueEl) {
    const currentL = (currentWaterMl / 1000).toFixed(1);
    waterValueEl.textContent = `${currentL} / ${waterNorm.toFixed(1)} L`;
  }

  // Якщо у тебе залишився кружечок для води (опціонально)
  const waterCircle = document.getElementById('waterCircle');
  if (waterCircle) {
    setCirclePercent(waterCircle, currentWaterMl / 1000, waterNorm);
  }
}

/**
 * Додає воду
 */
export function addWater(ml) {
  currentWaterMl += ml;
  localStorage.setItem('waterTodayMl', currentWaterMl);
  updateWaterUI();
}

/**
 * Скидає воду (викликається при "Очистити день")
 */
export function resetWater() {
  currentWaterMl = 0;
  localStorage.setItem('waterTodayMl', 0);
  updateWaterUI();
}

/**
 * Ініціалізація кнопок та завантаження даних
 */
function initWaterTracker() {
  // Завантажуємо збережене
  const saved = localStorage.getItem('waterTodayMl');
  currentWaterMl = saved ? parseInt(saved, 10) : 0;

  // Вішаємо події на кнопки-порції
  const waterButtons = document.querySelectorAll('.water-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const amount = parseFloat(btn.dataset.amount);
      addWater(amount);
    });
  });

  // Кнопка повного скидання (якщо є в дизайні)
  const resetBtn = document.querySelector('.water-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetWater);
  }

  updateWaterUI();
}

// Запуск при завантаженні
document.addEventListener('DOMContentLoaded', initWaterTracker);


