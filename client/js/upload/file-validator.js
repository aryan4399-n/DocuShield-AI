const PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const DOCUMENT_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);
function validateFile(file, isPhoto = false, maxMb = 10) { if (!file) return 'A file is required.'; if (file.size > maxMb * 1024 * 1024) return `Each file must be ${maxMb} MB or smaller.`; const allowed = isPhoto ? PHOTO_TYPES : DOCUMENT_TYPES; return allowed.has(file.type) ? '' : 'Unsupported file format.'; }
export { validateFile };
