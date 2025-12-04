export function updateUrlWithPeriodAndDates(period, dateFrom = null, dateTo = null, pushState = true) {
    const params = new URLSearchParams();
    params.set('period', period);
    if (period === 'interval' && dateFrom && dateTo) {
        params.set('dateFrom', dateFrom);
        params.set('dateTo', dateTo);
    }
    const url = '/income-expenses?' + params.toString();
    if (pushState) {
        window.history.pushState({}, '', url);
    }
    return url;
}
