import { authorizedFetch } from "../utils/utils-api.js";

export class IncomeExpensesAdd {
    constructor() {
        this.container = document.querySelector('.container-income-expenses-add');
        if (!this.container) return;

        this.typeSelect = this.container.querySelector('#incomeExpensesName');
        this.categorySelect = this.container.querySelector('#incomeExpensesCategory');
        this.amountInput = this.container.querySelector('#incomeExpensesAmount');
        this.dateInput = this.container.querySelector('#incomeExpensesDate');
        this.commentInput = this.container.querySelector('#incomeExpensesComment');

        this.btnCreate = this.container.querySelector('.btn-success');
        this.btnCancel = this.container.querySelector('.btn-danger');

        if (!this.typeSelect || !this.categorySelect || !this.btnCreate || !this.btnCancel) return;

        void this.init();
    }

    async init() {
        const params = new URLSearchParams(window.location.search);
        const type = params.get('type');
        if (type) this.typeSelect.value = type;

        await this.loadCategories(this.typeSelect.value);

        // 🔹 Смена категорий при выборе типа
        this.typeSelect.addEventListener('change', () => {
            this.loadCategories(this.typeSelect.value).catch(console.error);
        });

        // 🔹 Цвет текста select и date
        const updateSelectColor = (sel) => {
            sel.style.color = sel.value ? '#052C65' : '#6C757D';
        };
        [this.typeSelect, this.categorySelect].forEach(sel => {
            sel.addEventListener('change', () => updateSelectColor(sel));
            updateSelectColor(sel);
        });

        const updateDateColor = (input) => {
            input.style.color = input.value ? '#052C65' : '#6C757D';
        };
        [this.dateInput].forEach(input => {
            input.addEventListener('input', () => updateDateColor(input));
            updateDateColor(input);
        });

        this.btnCreate.addEventListener('click', async () => {
            const data = {
                type: this.typeSelect.value,
                category_id: Number(this.categorySelect.value),
                amount: this.amountInput.value,
                date: this.dateInput.value,
                comment: this.commentInput.value
            };

            if (!data.type || !data.category_id || !data.amount || !data.date) {
                alert('Заполните все обязательные поля!');
                return;
            }

            try {
                await authorizedFetch('http://localhost:3000/api/operations', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });

                const period = params.get('period') || 'day';
                const dateFrom = params.get('dateFrom') || '';
                const dateTo = params.get('dateTo') || '';
                window.location.href = `/income-expenses?period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}`;

            } catch (err) {
                alert(err?.message || 'Не удалось создать операцию');
            }
        });

        this.btnCancel.addEventListener('click', () => {
            const period = params.get('period') || 'day';
            const dateFrom = params.get('dateFrom') || '';
            const dateTo = params.get('dateTo') || '';
            window.location.href = `/income-expenses?period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}`;
        });
    }

    async loadCategories(type) {
        if (!type) return;
        try {
            const categories = await authorizedFetch(`http://localhost:3000/api/categories/${type}`);
            this.categorySelect.innerHTML = '<option value="" disabled selected>Категория...</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.title;
                this.categorySelect.appendChild(option);
            });
        } catch (err) {
            console.error('Ошибка загрузки категорий:', err);
            this.categorySelect.innerHTML = '<option value="" disabled selected>Не удалось загрузить категории</option>';
        }
    }
}
