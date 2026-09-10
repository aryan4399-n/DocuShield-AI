export function createVerificationScene(canvas) {
  if (!canvas || !window.THREE) return null;
  return { canvas, dispose() {} };
}
