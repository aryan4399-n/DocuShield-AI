function initRevealAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
window.DocuShieldAnimations = { initRevealAnimations };
