// ===============================
// STATS — DAILY PROGRESS (CIRCULAR & WATER)
// ===============================

// ===============================
// DOM ELEMENTS
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

// Water
const waterTotalEl = document.getElementById('waterTotal');
const glasses = document.querySelectorAll('.glass');

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

  if (wrapper) {
    wrapper.classList.remove('circle-progress--warning', 'circle-progress--over');
  }
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

  // ----- Calories -----
  if (kcalCurrentEl) {
    kcalCurrentEl.textContent = Math.round(kcal);
  }

  setCirclePercent(kcalCircleEl, kcal, dailyCaloriesNorm);

  // ----- Macros numbers -----
  if (pCurrentEl) pCurrentEl.textContent = Math.round(protein);
  if (fCurrentEl) fCurrentEl.textContent = Math.round(fat);
  if (cCurrentEl) cCurrentEl.textContent = Math.round(carbs);

  // ----- Macros circles (REAL NORMS FROM PROFILE) -----
  setCirclePercent(pCircleEl, protein, proteinNorm);
  setCirclePercent(fCircleEl, fat, fatNorm);
  setCirclePercent(cCircleEl, carbs, carbsNorm);
}

// ===============================
// WATER TRACKER
// ===============================

let waterLitres = 0;

if (glasses.length) {
  glasses.forEach((glass, index) => {
    glass.addEventListener('click', () => {
      glasses.forEach((g, i) => {
        g.classList.toggle('active', i <= index);
      });

      waterLitres = (index + 1) * 0.25;
      const waterNorm = getWaterNorm();

      if (waterTotalEl) {
        waterTotalEl.textContent = waterLitres.toFixed(2);
      }

      // 🔵 КАПСУЛА
      setCirclePercent(document.getElementById('waterCircle'), waterLitres, waterNorm);

      localStorage.setItem('waterToday', waterLitres);
    });
  });
}

function loadWaterData() {
  const savedWater = localStorage.getItem('waterToday');
  if (!savedWater || !waterTotalEl) return;

  const waterLitres = Number(savedWater);
  const waterNorm = getWaterNorm();

  const count = waterLitres / 0.25;

  glasses.forEach((g, i) => {
    g.classList.toggle('active', i < count);
  });

  waterTotalEl.textContent = waterLitres.toFixed(2);

  setCirclePercent(document.getElementById('waterCircle'), waterLitres, waterNorm);
}


loadWaterData();
