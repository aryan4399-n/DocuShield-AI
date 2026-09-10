function statusBadge(status) { const label = String(status || 'manual_review').replaceAll('_', ' ').toUpperCase(); return `<span class="status-pill ${status}">${label}</span>`; }
export { statusBadge };
