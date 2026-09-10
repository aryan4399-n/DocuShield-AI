function aggregate(signals = []) { const scores = signals.filter(signal => Number.isFinite(signal.score)).map(signal => signal.score); return scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null; }
module.exports = { aggregate };
