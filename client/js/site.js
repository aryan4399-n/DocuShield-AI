const DOCUSHIELD_API = "/api";

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function statusLabel(status) {
  return String(status || "manual_review").replaceAll("_", " ").toUpperCase();
}

function statusPill(status) {
  return `<span class="status-pill ${escapeHTML(status)}"><span>${status === "verified" ? "✓" : status === "failed" ? "×" : "!"}</span>${statusLabel(status)}</span>`;
}

function initShell() {
  const nav = document.querySelector(".topnav");
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  window.addEventListener("scroll", () => nav?.classList.toggle("scrolled", window.scrollY > 12), { passive: true });
  toggle?.addEventListener("click", () => links?.classList.toggle("open"));
  document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => links?.classList.remove("open")));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add("visible")), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

function appShell(title = "DocuShieldAI") {
  return `<header class="app-header"><div class="wrap app-header-row"><a class="brand" href="/"><span class="brand-mark"><svg viewBox="0 0 34 38" fill="none"><path d="M17 1 31 6v10c0 10-5.8 17.7-14 21C8.8 33.7 3 26 3 16V6L17 1Z" stroke="currentColor" stroke-width="2"/><path d="m10 18 4.2 4L24 12" stroke="currentColor" stroke-width="2"/></svg><span>DS</span></span><span class="brand-name">DocuShield<b>AI</b></span></a><nav class="app-header-links"><a href="/track.html">Track application</a><a href="/admin.html">Admin workspace</a></nav><div class="mono muted">SIH26188 / SECURE WORKSPACE</div></div></header>`;
}

window.DocuShield = { API: DOCUSHIELD_API, escapeHTML, statusLabel, statusPill, initShell, appShell };
document.addEventListener("DOMContentLoaded", () => { const shell = document.getElementById("app-shell"); if (shell) shell.innerHTML = appShell(); initShell(); });
document.addEventListener("DOMContentLoaded", () => { const input = document.getElementById("photo"); if (!input || !navigator.mediaDevices?.getUserMedia) return; const button = document.createElement("button"); button.type = "button"; button.className = "btn"; button.textContent = "Use camera"; input.parentElement.appendChild(button); button.addEventListener("click", async () => { const modal = document.createElement("div"); modal.style.cssText = "position:fixed;inset:0;z-index:20;background:rgba(3,10,20,.86);display:grid;place-items:center;padding:20px"; modal.innerHTML = `<div class="glass-card" style="width:min(440px,100%);padding:20px"><video autoplay playsinline style="width:100%;border-radius:12px;background:#000"></video><div style="display:flex;gap:10px;margin-top:15px"><button class="btn btn-primary" data-capture>Capture</button><button class="btn" data-cancel>Cancel</button></div></div>`; document.body.appendChild(modal); const video = modal.querySelector("video"); let stream; try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false }); video.srcObject = stream; } catch { modal.remove(); document.getElementById("upload-error").textContent = "Camera access was unavailable. Choose a photo file instead."; return; } modal.querySelector("[data-cancel]").onclick = () => { stream.getTracks().forEach(track => track.stop()); modal.remove(); }; modal.querySelector("[data-capture]").onclick = () => { const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d").drawImage(video, 0, 0); canvas.toBlob(blob => { const captured = new File([blob], "camera-capture.jpg", { type: "image/jpeg" }); const transfer = new DataTransfer(); transfer.items.add(captured); input.files = transfer.files; input.dispatchEvent(new Event("change", { bubbles: true })); stream.getTracks().forEach(track => track.stop()); modal.remove(); }, "image/jpeg", .9); }; }); });
