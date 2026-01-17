// js/stats.js

// ================== TARGETS (НОРМИ) ==================
const TARGETS = {
  calories: 1900,
  protein: 130, // г
  fat: 70, // г
  carbs: 250, // г
  water: 2.0, // л
};

// ================== ELEMENTS ==================
const els = {
  kcalCurrent: document.getElementById('kcalCurrent'),
  kcalProgress: document.getElementById('kcalProgress'),

  proteinCurrent: document.getElementById('proteinCurrent'),
  fatCurrent: document.getElementById('fatCurrent'),
  carbsCurrent: document.getElementById('carbsCurrent'),

  waterCurrent: document.getElementById('waterCurrent'),
  waterLeft: document.getElementById('waterLeft'),
};

// ================== HELPERS ==================
function percent(current, target) {
  return Math.min((current / target) * 100, 100);
}

// ================== UPDATE FUNCTIONS ==================
export function updateStats(totals) {
  // calories
  els.kcalCurrent.textContent = totals.kcal;
  els.kcalProgress.style.width = `${percent(totals.kcal, TARGETS.calories)}%`;

  // protein
  els.proteinCurrent.textContent = totals.protein;

  // fat
  els.fatCurrent.textContent = totals.fat;

  // carbs
  els.carbsCurrent.textContent = totals.carbs;

  // water (поки статично)
  const waterCurrent = Number(els.waterCurrent.textContent) || 0;
  els.waterLeft.textContent = Math.max((TARGETS.water - waterCurrent).toFixed(1), 0);
}
