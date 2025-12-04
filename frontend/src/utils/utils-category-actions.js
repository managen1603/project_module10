import { authorizedFetch } from "./utils-api.js";

export function bindDeleteEvents(context) {
    context.container.addEventListener('click', (event) => {
        const editLink = event.target.closest('a.btn.btn-primary');
        if (editLink) return;

        const deleteBtn = event.target.closest('.btn.btn-danger');
        if (deleteBtn && deleteBtn.dataset && deleteBtn.dataset.id) {
            context.openDeleteModal(deleteBtn.dataset.id);
            return;
        }
    });

    if (context.modalConfirmBtn) {
        context.modalConfirmBtn.addEventListener('click', () => {
            void deleteCategory(context);
        });
    }

    if (context.modalCancelBtn) {
        context.modalCancelBtn.addEventListener('click', () => {
            context.closeDeleteModal();
        });
    }
}

export async function deleteCategory(context) {
    if (!context.pendingDeleteId) return;

    try {
        await authorizedFetch(`${context.apiUrl}/${context.pendingDeleteId}`, {
            method: 'DELETE'
        });
        console.log('Категория удалена', context.pendingDeleteId);
        context.closeDeleteModal();
        await context.loadCategories();
    } catch (err) {
        console.error('Ошибка при удалении категории', err);
        alert('Не удалось удалить категорию. Попробуйте позже.');
        context.closeDeleteModal();
    }
}
