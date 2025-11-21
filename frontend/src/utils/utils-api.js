const BASE_URL = 'http://localhost:3000/api';

export async function loginUser(email, password, rememberMe = false) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
    });
    if (!response.ok) throw new Error('Ошибка авторизации');
    return response.json(); // возвращает tokens и user
}

export async function signUpUser(name, lastName, email, password, passwordRepeat) {
    const response = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastName, email, password, passwordRepeat })
    });
    if (!response.ok) throw new Error('Ошибка регистрации');
    return response.json(); // возвращает user
}
