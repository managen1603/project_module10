import {Home} from "./components/home";
import {Login} from "./components/login";
import {SignUp} from "./components/sign-up";
import {IncomeExpenses} from "./components/income-expenses";
import {Income} from "./components/income";
import {Expense} from "./components/expense";
import {IncomeExpensesEdit} from "./components/income-expenses-edit";
import {IncomeExpensesAdd} from "./components/income-expenses-add";
import {ExpenseEdit} from "./components/expense-edit";
import {ExpenseAdd} from "./components/expense-add";
import {IncomeEdit} from "./components/income-edit";
import {IncomeAdd} from "./components/income-add";
import {Layout} from "./components/layout";

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.initLinkClicks();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/home.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Home();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {

                    new Login();
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp();
                }
            },
            {
                route: '/income-expenses',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpenses();
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income();
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/expense.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expense();
                }
            },
            {
                route: '/income-add',
                title: 'Создание категории доходов',
                filePathTemplate: '/templates/income-add.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeAdd();
                }
            },
            {
                route: '/income-edit',
                title: 'Редактирование категории доходов',
                filePathTemplate: '/templates/income-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit();
                }
            },
            {
                route: '/expense-add',
                title: 'Создание категории расходов',
                filePathTemplate: '/templates/expense-add.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseAdd();
                }
            },
            {
                route: '/expense-edit',
                title: 'Редактирование категории расходов',
                filePathTemplate: '/templates/expense-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit();
                }
            },
            {
                route: '/income-expenses-add',
                title: 'Создание дохода/расхода',
                filePathTemplate: '/templates/income-expenses-add.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesAdd();
                }
            },
            {
                route: '/income-expenses-edit',
                title: 'Редактирование дохода/расхода',
                filePathTemplate: '/templates/income-expenses-edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpensesEdit();
                }
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
    }

    initLinkClicks() {
        document.body.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link) return;
            const href = link.getAttribute('href');
            if (href && href.startsWith('/')) {
                event.preventDefault();
                window.history.pushState({}, '', href);
                window.dispatchEvent(new Event('popstate'));
            }
        });
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;

        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        const publicRoutes = ['/login', '/sign-up'];

        if (!token && !publicRoutes.includes(urlRoute)) {
            window.history.replaceState({}, '', '/login');
            return this.activateRoute();
        }

        if (token && ['/login', '/sign-up'].includes(urlRoute)) {
            window.history.replaceState({}, '', '/');
            return this.activateRoute();
        }

        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Мои финансы';
            }
            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    new Layout();
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('Роуты не были найдены');
            window.location = '/404';
        }
    }
}