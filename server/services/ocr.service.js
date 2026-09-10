const path = require('path');
const { createWorker } = require('tesseract.js');

let workerPromise;

async function getWorker() {
	if (!workerPromise) workerPromise = createWorker('eng');
	return workerPromise;
}

async function extract(file) {
	if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
		return { available: false, passed: false, textLength: 0, message: 'OCR is available for image documents only.' };
	}

	try {
		const worker = await getWorker();
		const result = await worker.recognize(path.resolve(file.path));
		const text = String(result.data.text || '').trim();
		const fields = extractFields(text);
		return { available: true, passed: text.length > 0, text, textLength: text.length, confidence: Number(result.data.confidence || 0), fields, message: text.length ? 'OCR text extracted.' : 'No readable text was detected.' };
	} catch (error) {
		return { available: false, passed: false, text: '', textLength: 0, confidence: 0, fields: {}, message: 'OCR could not process this image.' };
	}
}

function extractFields(text) {
	const normalized = text.replace(/\r/g, '');
	const date = normalized.match(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{2}[/-]\d{2}[/-]\d{4})\b/);
	const pan = normalized.match(/\b[A-Z]{5}\d{4}[A-Z]\b/i);
	const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean);
	return { name: lines.find(line => /name/i.test(line))?.replace(/^.*?name\s*[:\-]?\s*/i, '').trim() || null, dateOfBirth: date?.[1] || null, documentNumber: pan?.[0]?.toUpperCase() || null };
}

async function shutdown() {
	if (workerPromise) {
		const worker = await workerPromise;
		await worker.terminate();
		workerPromise = undefined;
	}
}

module.exports = { extract, shutdown };
