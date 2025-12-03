import {authorizedFetch} from "../utils/utils-api";

export class ExpenseEdit {
    constructor() {
        this.container = document.querySelector('.container-expense-edit');
        this.input = this.container?.querySelector('#expenseName');
        this.errorEl = this.container?.querySelector('.error-expense-edit');
        this.btnSave = this.container?.querySelector('.btn-success');
        this.btnCancel = this.container?.querySelector('.btn-danger');

        this.categoryId = this.getCategoryIdFromURL();
        this.apiUrl = `http://localhost:3000/api/categories/expense/${this.categoryId}`;

        this.originalTitle = "";

        this.init().catch(console.error);
    }

    getCategoryIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async init() {
        if (!this.categoryId) {
            alert('Не указан id категории');
            window.location.href = '/expense';
            return;
        }

        await this.loadCategory();

        if (this.btnSave) this.btnSave.addEventListener('click', () => this.saveCategory());
        if (this.btnCancel) this.btnCancel.addEventListener('click', () => {
            window.location.href = '/expense';
        });

        this.input?.addEventListener('input', () => {
            this.errorEl?.classList.add('d-none');
        });
    }

    async loadCategory() {
        try {
            const data = await authorizedFetch(this.apiUrl);

            this.originalTitle = data.title.trim();
            this.input.value = this.originalTitle;

        } catch (err) {
            console.error('Ошибка загрузки категории расхода:', err);
            alert('Не удалось загрузить категорию расхода');
            window.location.href = '/expense';
        }
    }

    async saveCategory() {
        const title = this.input.value.trim();
        this.errorEl?.classList.add('d-none');

        if (!title) {
            this.errorEl.textContent = 'Введите название категории расхода';
            this.errorEl.classList.remove('d-none');
            return;
        }

        if (title === this.originalTitle) {
            window.location.href = '/expense';
            return;
        }

        let allCategories = [];
        try {
            allCategories = await authorizedFetch("http://localhost:3000/api/categories/expense");
        } catch (e) {
            console.error("Ошибка загрузки категорий расхода:", e);
        }

        const exists = allCategories.some(cat =>
            cat.title.trim().toLowerCase() === title.toLowerCase()
        );

        if (exists) {
            this.errorEl.textContent = 'Такая категория расхода уже создана';
            this.errorEl.classList.remove('d-none');
            return;
        }

        try {
            await authorizedFetch(this.apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            });

            window.location.href = '/expense';
        } catch (err) {
            console.error('Ошибка обновления категории расхода:', err);

            this.errorEl.textContent = 'Не удалось обновить категорию расхода';
            this.errorEl.classList.remove('d-none');
        }
    }
}