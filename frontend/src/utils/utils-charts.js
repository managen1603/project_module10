import { Chart, PieController, ArcElement, Legend, Tooltip } from 'chart.js';

const legendSpacingPlugin = {
    id: 'legendSpacing',
    beforeInit(chart, args, options) {
        const originalFit = chart.legend.fit;
        chart.legend.fit = function fit() {
            originalFit.bind(chart.legend)();
            this.height += options?.extraSpace || 0;
        };
    }
};

Chart.register(PieController, ArcElement, Legend, Tooltip, legendSpacingPlugin);

let incomeChartInstance = null;
let expensesChartInstance = null;

export function renderIncomeExpensesCharts(incomeData, expensesData) {
    const incomeCtx = document.getElementById('incomeChart');
    const expensesCtx = document.getElementById('expensesChart');

    if (!incomeCtx || !expensesCtx) return;

    if (incomeChartInstance) incomeChartInstance.destroy();
    if (expensesChartInstance) expensesChartInstance.destroy();

    const incomeNoData = incomeCtx.parentElement.querySelector('.no-data');
    const expensesNoData = expensesCtx.parentElement.querySelector('.no-data');

    if (incomeNoData) incomeNoData.style.display = incomeData.values.length ? 'none' : 'flex';
    if (expensesNoData) expensesNoData.style.display = expensesData.values.length ? 'none' : 'flex';

    if (incomeData.values.length) {
        incomeChartInstance = new Chart(incomeCtx, {
            type: 'pie',
            data: {
                labels: incomeData.labels,
                datasets: [{
                    data: incomeData.values,
                    backgroundColor: ['#df515f', '#fd7e14', '#ffc107', '#20c997', '#2e80f7', '#df6db8', '#a4acbc', '#a1d465', '#00c0ff', '#b57beb', '#5cafce']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    legendSpacing: { extraSpace: 40 }
                }
            }
        });
    }

    if (expensesData.values.length) {
        expensesChartInstance = new Chart(expensesCtx, {
            type: 'pie',
            data: {
                labels: expensesData.labels,
                datasets: [{
                    data: expensesData.values,
                    backgroundColor: ['#df515f', '#fd7e14', '#ffc107', '#20c997', '#2e80f7', '#df6db8', '#a4acbc', '#a1d465', '#00c0ff', '#b57beb', '#5cafce']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    legendSpacing: { extraSpace: 40 }
                }
            }
        });
    }
}

