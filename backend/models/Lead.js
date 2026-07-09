const mongoose = require("mongoose");
const leadSchema = new mongoose.Schema({
  leadId: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"]
  },
  company: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    default: ""
  },
  service: {
    type: String,
    required: true,
    enum: ["Web Development", "Mobile Application", "AI Solution", "ERP/CRM", "Consultation"]
  },
  budget: {
    type: Number,
    required: true
  },
  timeline: {
    type: String,
    required: true,
    enum: ["Urgent", "Flexible"]
  },
  description: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  priority: {
    type: String,
    enum: ["High Priority", "Medium Priority", "Low Priority"],
    default: "Low Priority"
  },
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"],
    default: "New"
  },
  notes: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  aiSummary: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Lead", leadSchema);
