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
// HELPERS
// ===============================

// Daily calories norm
function getDailyCaloriesNorm() {
  const saved = localStorage.getItem('dailyCaloriesNorm');
  return saved ? Number(saved) : 2000;
}

// Universal circular progress logic
function setCirclePercent(circleEl, current, max) {
  if (!circleEl || !max) return;

  const percentRaw = (current / max) * 100;
  const percent = Math.min(percentRaw, 100);

  // reset states
  circleEl.classList.remove('circle-progress--warning', 'circle-progress--over');

  // warning: 80–99%
  if (percentRaw >= 80 && percentRaw < 100) {
    circleEl.classList.add('circle-progress--warning');
  }

  // over: 100%+
  if (percentRaw >= 100) {
    circleEl.classList.add('circle-progress--over');
  }

  circleEl.style.strokeDasharray = `${percent}, 100`;
}

// ===============================
// UPDATE STATS
// ===============================

export function updateStats(consumed) {
  const dailyCaloriesNorm = getDailyCaloriesNorm();

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

  // ----- Macros circles (temporary norms) -----
  setCirclePercent(pCircleEl, protein, 100); // Protein
  setCirclePercent(fCircleEl, fat, 70); // Fat
  setCirclePercent(cCircleEl, carbs, 250); // Carbs
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

      if (waterTotalEl) {
        waterTotalEl.textContent = waterLitres.toFixed(2);
      }

      localStorage.setItem('waterToday', waterLitres);
    });
  });
}

function loadWaterData() {
  const savedWater = localStorage.getItem('waterToday');
  if (!savedWater || !waterTotalEl) return;

  const count = parseFloat(savedWater) / 0.25;

  glasses.forEach((g, i) => {
    g.classList.toggle('active', i < count);
  });

  waterTotalEl.textContent = savedWater;
}

loadWaterData();
