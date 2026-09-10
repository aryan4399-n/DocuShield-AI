const API_BASE_URL = '/api';
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) throw new Error(payload.error?.message || payload.message || 'Request failed.');
  return payload.data ?? payload;
}
const DocuShieldAPI = {
  submitApplication: (formData) => request('/applications/submit', { method: 'POST', body: formData }),
  getApplication: (id) => request(`/applications/${encodeURIComponent(id)}`),
  getVerificationStatus: (id) => request(`/applications/${encodeURIComponent(id)}/status`),
  getAdminApplications: (query = '') => request(`/admin/applications?search=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('verifyflowAdminToken') || ''}` } }),
  getApplicationDetails: (id) => request(`/admin/applications/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem('verifyflowAdminToken') || ''}` } }),
  reviewApplication: (id, body) => request(`/admin/applications/${encodeURIComponent(id)}/review`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('verifyflowAdminToken') || ''}` }, body: JSON.stringify(body) })
};
window.DocuShieldAPI = DocuShieldAPI;
