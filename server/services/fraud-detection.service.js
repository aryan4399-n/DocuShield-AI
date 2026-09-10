async function analyze() { return { available: false, status: 'manual_review', message: 'Fraud analysis requires provider signals and is not fabricated locally.' }; }
module.exports = { analyze };
