function createApplicationId(db) {
  const count = db.prepare('SELECT COUNT(*) AS count FROM applications').get().count;
  return `VF-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
}
module.exports = { createApplicationId };
