const {
  v4: uuidv4
} = require("uuid");
function generateLeadId() {
  const year = new Date().getFullYear();
  const shortId = uuidv4().split("-")[0].toUpperCase().slice(0, 6);
  return `LEAD-${year}-${shortId}`;
}
module.exports = generateLeadId;
