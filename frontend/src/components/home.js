import { renderIncomeExpensesCharts } from "../utils/charts.js";

export class Home {
    constructor() {
        console.log('HOME');

        // Когда DOM уже подгружен и холсты появились
        setTimeout(() => {
            renderIncomeExpensesCharts();
        }, 0);
    }
}
