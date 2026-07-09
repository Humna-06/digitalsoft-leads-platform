const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
async function generateLeadSummary(lead) {
  if (!GEMINI_API_KEY) {
    return generateMockSummary(lead);
  }
  try {
    const prompt = `You are a sales assistant. In 1-2 sentences, summarize this lead's potential value and conversion likelihood.
Service requested: ${lead.service}
Budget: $${lead.budget}
Company: ${lead.company || "Not provided"}
Description: ${lead.description}`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    const data = await response.json();
    const summaryText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return summaryText || generateMockSummary(lead);
  } catch (error) {
    console.error("AI summary generation failed, using mock summary:", error.message);
    return generateMockSummary(lead);
  }
}
function generateMockSummary(lead) {
  const budgetTier = lead.budget >= 20000 ? "high-value" : lead.budget >= 10000 ? "mid-value" : "entry-level";
  return `Potential ${budgetTier} client interested in ${lead.service}. Based on the stated budget and requirements, this lead shows ${lead.budget >= 20000 ? "strong" : "moderate"} conversion potential and should be reviewed by the sales team.`;
}
module.exports = {
  generateLeadSummary
};
