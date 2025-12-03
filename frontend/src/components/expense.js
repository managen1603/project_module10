import { authorizedFetch } from "../utils/utils-api.js";
import { bindDeleteEvents } from "../utils/utils-category-actions.js";

export class Expense {
    constructor() {
        this.container = document.querySelector('.container-expense');
        this.expenseListEl = this.container.querySelector('.expense');
        this.modalEl = this.container.querySelector('.modal');
        this.modalConfirmBtn = this.modalEl ? this.modalEl.querySelector('.btn-popup.btn-success') : null;
        this.modalCancelBtn = this.modalEl ? this.modalEl.querySelector('.btn-popup.btn-danger') : null;

        this.apiUrl = 'http://localhost:3000/api/categories/expense';
        this.pendingDeleteId = null;

        this.init().catch(console.error);
    }

    async init() {
        bindDeleteEvents(this);
        await this.loadCategories();
    }

    async loadCategories() {
        this.clearIncomeList();

        const loadingEl = document.createElement('div');
        loadingEl.innerText = 'Загрузка категорий...';
        loadingEl.className = 'expense-loading';
        this.expenseListEl.appendChild(loadingEl);

        try {
            const data = await authorizedFetch(this.apiUrl);

            if (!Array.isArray(data)) {
                throw new Error('Некорректный ответ от API');
            }

            this.renderCategories(data);

        } catch (err) {
            this.clearIncomeList();
            const errEl = document.createElement('div');
            errEl.className = 'expense-error';
            errEl.innerText = 'Не удалось загрузить категории';
            this.expenseListEl.appendChild(errEl);

            console.error('loadCategories error:', err);
        }
    }

    clearIncomeList() {
        this.expenseListEl.innerHTML = '';
    }

    renderCategories(categories) {
        this.clearIncomeList();

        categories.forEach(cat => {
            const wrapper = document.createElement('div');
            wrapper.className = 'item-block py-3 px-4';
            wrapper.innerHTML = `
                <h2 class="title-block">${this.escapeHtml(cat.title)}</h2>
                <div class="button-expense d-flex gap-2">
                    <a href="/expense-edit?id=${encodeURIComponent(cat.id)}" data-id="${cat.id}" type="button" class="btn btn-primary">Редактировать</a>
                    <a href="javascript:void(0)" data-id="${cat.id}" type="button" class="btn btn-danger">Удалить</a>
                </div>
            `;
            this.expenseListEl.appendChild(wrapper);
        });

        const addBlock = document.createElement('div');
        addBlock.className = 'item-block-add d-flex justify-content-center align-items-center';
        addBlock.innerHTML = `
            <a href="/expense-add" class="d-flex justify-content-center align-items-center text-decoration-none">+</a>
        `;
        this.expenseListEl.appendChild(addBlock);
    }

    openDeleteModal(id) {
        this.pendingDeleteId = id;
        if (!this.modalEl) return;

        this.modalEl.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeDeleteModal() {
        this.pendingDeleteId = null;
        if (!this.modalEl) return;

        this.modalEl.style.display = 'none';
        document.body.style.overflow = '';
    }

    escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}