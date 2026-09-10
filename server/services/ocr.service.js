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
		return { available: true, passed: text.length > 0, textLength: text.length, message: text.length ? 'OCR text extracted.' : 'No readable text was detected.' };
	} catch (error) {
		return { available: false, passed: false, textLength: 0, message: 'OCR could not process this image.' };
	}
}

async function shutdown() {
	if (workerPromise) {
		const worker = await workerPromise;
		await worker.terminate();
		workerPromise = undefined;
	}
}

module.exports = { extract, shutdown };
