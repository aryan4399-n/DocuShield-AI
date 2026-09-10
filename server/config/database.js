const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const env = require('./env');

fs.mkdirSync(env.dataDir, { recursive: true });
const db = new Database(path.join(env.dataDir, 'database.sqlite'));
db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8'));
module.exports = db;
