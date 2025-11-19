import { loginUser } from './utils-api';

export async function autoLogin(email, password) {
    const loginData = await loginUser(email.trim(), password);
    localStorage.setItem('accessToken', loginData.tokens.accessToken);
    localStorage.setItem('user', JSON.stringify(loginData.user));

    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
}

export function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}