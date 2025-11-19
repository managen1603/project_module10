import { renderIncomeExpensesCharts } from "../utils/utils-charts.js";

export class Home {
    constructor() {
        console.log('HOME');

        setTimeout(() => {
            renderIncomeExpensesCharts();
        }, 0);
    }
}
