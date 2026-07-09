const Lead = require("../models/Lead");
const generateLeadId = require("../utils/generateLeadId");
const {
  calculateScore,
  getPriorityLabel
} = require("../services/leadScoringService");
const {
  generateLeadSummary
} = require("../services/aiSummaryService");
const {
  asyncHandler
} = require("../middleware/errorHandler");
const createLead = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    company,
    website,
    service,
    budget,
    timeline,
    description
  } = req.body;
  const score = calculateScore({
    budget,
    timeline,
    website,
    service
  });
  const priority = getPriorityLabel(score);
  let aiSummary = "";
  try {
    aiSummary = await generateLeadSummary({
      service,
      budget,
      company,
      description
    });
  } catch (err) {
    aiSummary = "";
  }
  const lead = await Lead.create({
    leadId: generateLeadId(),
    fullName,
    email,
    phone,
    company,
    website,
    service,
    budget,
    timeline,
    description,
    score,
    priority,
    aiSummary
  });
  res.status(201).json({
    success: true,
    message: "Lead submitted successfully",
    data: lead
  });
});
const getLeads = asyncHandler(async (req, res) => {
  const {
    status,
    priority,
    search
  } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) {
    filter.$or = [{
      fullName: {
        $regex: search,
        $options: "i"
      }
    }, {
      company: {
        $regex: search,
        $options: "i"
      }
    }, {
      email: {
        $regex: search,
        $options: "i"
      }
    }];
  }
  const leads = await Lead.find(filter).sort({
    createdAt: -1
  });
  res.status(200).json({
    success: true,
    count: leads.length,
    data: leads
  });
});
const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: "Lead not found"
    });
  }
  res.status(200).json({
    success: true,
    data: lead
  });
});
const updateLeadStatus = asyncHandler(async (req, res) => {
  const {
    status,
    note
  } = req.body;
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: "Lead not found"
    });
  }
  lead.status = status;
  if (note && note.trim() !== "") {
    lead.notes.push({
      text: note
    });
  }
  await lead.save();
  res.status(200).json({
    success: true,
    message: "Lead status updated",
    data: lead
  });
});
const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    return res.status(404).json({
      success: false,
      message: "Lead not found"
    });
  }
  res.status(200).json({
    success: true,
    message: "Lead deleted successfully"
  });
});
module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead
};
