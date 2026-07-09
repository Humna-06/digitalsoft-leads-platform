import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitLead } from "../services/api";
import Toast from "../components/Toast";
import PipelineStepper from "../components/PipelineStepper";
const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  service: "Web Development",
  budget: "",
  timeline: "Flexible",
  description: ""
};
export default function PublicLeadForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [submittedLead, setSubmittedLead] = useState(null);
  const navigate = useNavigate();
  function handleChange(e) {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await submitLead({
        ...formData,
        budget: Number(formData.budget)
      });
      setSubmittedLead(response.data.data);
      setToast({
        message: "Your inquiry was submitted successfully!",
        type: "success"
      });
      setFormData(initialFormState);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong. Please try again.";
      setToast({
        message,
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedLead) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-spark-50/60 to-white">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-14 h-14 bg-spark-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Thank you, {submittedLead.fullName}!</h2>
          <p className="text-gray-500 mb-1">
            Your Lead ID is <span className="font-mono font-semibold text-spark-700">{submittedLead.leadId}</span>
          </p>
          <p className="text-sm text-gray-400 mb-6">Here's how your inquiry moves through our pipeline:</p>

          <div className="mb-8 px-2">
            <PipelineStepper currentStage="New" />
          </div>

          <button onClick={() => navigate("/book")} className="bg-spark-500 hover:bg-spark-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
            Book a Meeting Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-spark-50/60 to-white">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2 lg:sticky lg:top-10">
          <span className="inline-block text-xs font-semibold text-spark-700 bg-spark-100 px-3 py-1 rounded-full mb-4">
            Since 2004 &middot; Faisalabad, Pakistan
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Tell us what you're building.
            <br />
            <span className="text-spark-600">We'll take it from here.</span>
          </h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            Submit your project requirements below. Our team reviews every inquiry, scores it for
            fit, and reaches out within 24 hours to schedule a discovery call.
          </p>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your inquiry's journey</p>
          <PipelineStepper currentStage="New" />
        </div>

        <div className="lg:col-span-3">
          {toast && <Toast {...toast} onClose={() => setToast(null)} />}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
              <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
              <Field label="Company" name="company" value={formData.company} onChange={handleChange} />
              <Field label="Website (optional)" name="website" value={formData.website} onChange={handleChange} />
              <SelectField label="Required Service" name="service" value={formData.service} onChange={handleChange} options={["Web Development", "Mobile Application", "AI Solution", "ERP/CRM", "Consultation"]} />
              <Field label="Estimated Budget (USD)" name="budget" type="number" value={formData.budget} onChange={handleChange} required />
              <SelectField label="Expected Timeline" name="timeline" value={formData.timeline} onChange={handleChange} options={["Urgent", "Flexible"]} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-spark-400 focus:border-spark-400 outline-none" placeholder="Tell us what you're looking to build..." />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-spark-500 hover:bg-spark-600 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-semibold transition">
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false
}) {
  return <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-spark-400 focus:border-spark-400 outline-none" />
    </div>;
}
function SelectField({
  label,
  name,
  value,
  onChange,
  options
}) {
  return <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-spark-400 focus:border-spark-400 outline-none bg-white">
        {options.map(opt => <option key={opt} value={opt}>
            {opt}
          </option>)}
      </select>
    </div>;
}
