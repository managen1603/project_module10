import {validators} from '../utils/utils-validators';
import {setError, clearError} from '../utils/utils-form-input';
import {autoLogin} from "../utils/utils-auth";

export class Login {

    constructor() {
        console.log('LOGIN'); // для себя

        this.formLogin = document.querySelector('.form-login');
        this.btnLogin = document.querySelector('.btn-login');

        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');

        this.emailError = this.emailInput.parentElement.parentElement.querySelector('.error-login');
        this.passwordError = this.passwordInput.parentElement.parentElement.querySelector('.error-login');
        this.generalError = this.formLogin.querySelector('.error-login-second');

        this.initEvents();
    }

    initEvents() {
        this.btnLogin.addEventListener('click', this.onSubmit.bind(this));
    }

    async onSubmit() {
        let isValid = true;

        clearError(this.emailInput, this.emailError);
        clearError(this.passwordInput, this.passwordError);

        this.generalError.classList.add('d-none');

        if (validators.isEmpty(this.emailInput.value)) {
            setError(this.emailInput, this.emailError);
            isValid = false;
        } else if (!validators.isEmail(this.emailInput.value)) {
            setError(this.emailInput, this.emailError);
            isValid = false;
        }
        if (validators.isEmpty(this.passwordInput.value)) {
            setError(this.passwordInput, this.passwordError);
            isValid = false;
        } else if (!validators.isPassword(this.passwordInput.value)) {
            setError(this.passwordInput, this.passwordError);
            isValid = false;
        }

        if (!isValid) return;

        console.log("OK! Проверяем пользователя…"); // для себя

        try {
            const rememberMe = document.getElementById('flexCheckDefault').checked;
            const loginData = await autoLogin(this.emailInput.value, this.passwordInput.value, rememberMe);
        } catch (err) {
            this.generalError.classList.remove('d-none');
            console.error(err);
        }
    }
}
