import Chart from 'chart.js/auto';

const charts = {};

Chart.defaults.color = '#6b7099';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
Chart.defaults.font.family = 'DM Sans';

export function mkChart(id, cfg) {
  if (charts[id]) charts[id].destroy();
  const c = document.getElementById(id);
  if (!c) return;
  charts[id] = new Chart(c, cfg);
  return charts[id];
}
