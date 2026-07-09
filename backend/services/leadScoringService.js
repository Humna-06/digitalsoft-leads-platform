function calculateScore(leadData) {
  let score = 0;
  if (leadData.budget >= 20000) {
    score += 30;
  } else if (leadData.budget >= 10000) {
    score += 20;
  } else {
    score += 10;
  }
  if (leadData.timeline === "Urgent") {
    score += 20;
  }
  if (leadData.website && leadData.website.trim() !== "") {
    score += 10;
  }
  if (leadData.service === "AI Solution" || leadData.service === "ERP/CRM") {
    score += 20;
  } else if (leadData.service === "Web Development" || leadData.service === "Mobile Application") {
    score += 10;
  }
  return score;
}
function getPriorityLabel(score) {
  if (score >= 80) return "High Priority";
  if (score >= 50) return "Medium Priority";
  return "Low Priority";
}
module.exports = {
  calculateScore,
  getPriorityLabel
};
