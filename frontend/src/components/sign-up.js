import { validators } from '../utils/utils-validators';
import { setError, clearError } from '../utils/utils-form-input';
import { signUpUser } from "../utils/utils-api";
import { autoLogin } from "../utils/utils-auth";

export class SignUp {

    constructor() {

        this.btnSignUp = document.querySelector('.btn-signup');

        this.nameInput = document.getElementById('name');
        this.lastNameInput = document.getElementById('lastName');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.repeatPasswordInput = document.getElementById('repeatPassword');

        this.nameError = this.nameInput.parentElement.parentElement.querySelector('.error-signup');
        this.lastNameError = this.lastNameInput.parentElement.parentElement.querySelector('.error-signup');
        this.emailError = this.emailInput.parentElement.parentElement.querySelector('.error-signup');
        this.passwordError = this.passwordInput.parentElement.parentElement.querySelector('.error-signup');
        this.repeatPasswordError = this.repeatPasswordInput.parentElement.parentElement.querySelector('.error-signup');

        this.initEvents();
    }

    initEvents() {
        this.btnSignUp.addEventListener('click', this.onSubmit.bind(this));
    }

    async onSubmit() {
        let isValid = true;

        clearError(this.nameInput, this.nameError);
        clearError(this.lastNameInput, this.lastNameError);
        clearError(this.emailInput, this.emailError);
        clearError(this.passwordInput, this.passwordError);
        clearError(this.repeatPasswordInput, this.repeatPasswordError);

        if (validators.isEmpty(this.nameInput.value)) {
            setError(this.nameInput, this.nameError);
            isValid = false;
        } else if (!validators.isName(this.nameInput.value)) {
            setError(this.nameInput, this.nameError);
            isValid = false;
        }
        if (validators.isEmpty(this.lastNameInput.value)) {
            setError(this.lastNameInput, this.lastNameError);
            isValid = false;
        } else if (!validators.isLastName(this.lastNameInput.value)) {
            setError(this.lastNameInput, this.lastNameError);
            isValid = false;
        }
        if (validators.isEmpty(this.emailInput.value.trim())) {
            setError(this.emailInput, this.emailError);
            isValid = false;
        } else if (!validators.isEmail(this.emailInput.value.trim())) {
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
        if (validators.isEmpty(this.repeatPasswordInput.value)) {
            setError(this.repeatPasswordInput, this.repeatPasswordError);
            isValid = false;
        } else if (this.passwordInput.value !== this.repeatPasswordInput.value) {
            setError(this.repeatPasswordInput, this.repeatPasswordError);
            isValid = false;
        }

        if (!isValid) return;

        try {
            const data = await signUpUser(
                this.nameInput.value,
                this.lastNameInput.value,
                this.emailInput.value,
                this.passwordInput.value,
                this.repeatPasswordInput.value
            );

            localStorage.setItem('user', JSON.stringify(data.user));

            await autoLogin(this.emailInput.value, this.passwordInput.value);

        } catch (err) {
            setError(this.emailInput, this.emailError);
            console.error(err);
        }
    }
}