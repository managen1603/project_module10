export function setError(input, errorElement) {
    input.classList.add('is-invalid');
    errorElement.classList.remove('d-none');
}

export function clearError(input, errorElement) {
    input.classList.remove('is-invalid');
    errorElement.classList.add('d-none');
}
