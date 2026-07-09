import { useState, useEffect, useCallback } from "react";
import { getLeads, updateLeadStatus } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
import PipelineStepper from "../components/PipelineStepper";
const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [toast, setToast] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const response = await getLeads(params);
      setLeads(response.data.data);
    } catch (error) {
      setToast({
        message: "Failed to load leads",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, priorityFilter]);
  useEffect(() => {
    const timer = setTimeout(fetchLeads, 400);
    return () => clearTimeout(timer);
  }, [fetchLeads]);
  async function handleStatusChange(leadId, newStatus) {
    try {
      await updateLeadStatus(leadId, {
        status: newStatus
      });
      setToast({
        message: "Status updated",
        type: "success"
      });
      fetchLeads();
    } catch (error) {
      setToast({
        message: "Failed to update status",
        type: "error"
      });
    }
  }
  return <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-gray-500 text-sm">Track every inquiry from first contact to closed deal</p>
        </div>

        {}
        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" placeholder="Search by name, company, or email..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 min-w-[220px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white outline-none">
            <option value="">All Priorities</option>
            <option value="High Priority">High Priority</option>
            <option value="Medium Priority">Medium Priority</option>
            <option value="Low Priority">Low Priority</option>
          </select>
        </div>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <SummaryCard label="Total Leads" value={leads.length} />
          <SummaryCard label="High Priority" value={leads.filter(l => l.priority === "High Priority").length} />
          <SummaryCard label="New" value={leads.filter(l => l.status === "New").length} />
          <SummaryCard label="Won" value={leads.filter(l => l.status === "Won").length} />
        </div>

        {isLoading ? <LoadingSpinner text="Loading leads..." /> : <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{lead.fullName}</p>
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.company || "—"}</td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{lead.score}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.priority} /></td>
                    <td className="px-4 py-3">
                      <select value={lead.status} onChange={e => handleStatusChange(lead._id, e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white outline-none">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedLead(lead)} className="text-brand-600 hover:text-brand-700 text-xs font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>)}
                {leads.length === 0 && <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                      No leads found
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>}
      </main>

      {selectedLead && <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>;
}
function SummaryCard({
  label,
  value
}) {
  return <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>;
}
function LeadDetailPanel({
  lead,
  onClose
}) {
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [localNotes, setLocalNotes] = useState(lead.notes || []);
  async function handleAddNote() {
    if (!noteText.trim()) return;
    setIsSavingNote(true);
    try {
      await updateLeadStatus(lead._id, {
        status: lead.status,
        note: noteText
      });
      setLocalNotes(prev => [...prev, {
        text: noteText,
        createdAt: new Date()
      }]);
      setNoteText("");
    } finally {
      setIsSavingNote(false);
    }
  }
  return <div className="fixed inset-0 bg-black/30 flex justify-end z-40" onClick={onClose}>
      <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{lead.fullName}</h2>
            <p className="text-xs text-gray-400 font-mono">{lead.leadId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-6 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pipeline Progress</p>
          <PipelineStepper currentStage={lead.status} compact />
        </div>

        <div className="space-y-4 text-sm">
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="Phone" value={lead.phone} />
          <DetailRow label="Company" value={lead.company || "—"} />
          <DetailRow label="Service" value={lead.service} />
          <DetailRow label="Budget" value={`$${lead.budget.toLocaleString()}`} />
          <DetailRow label="Timeline" value={lead.timeline} />

          <div>
            <p className="text-gray-400 text-xs mb-1">Description</p>
            <p className="text-gray-700">{lead.description}</p>
          </div>

          {lead.aiSummary && <div className="bg-brand-50 border border-brand-100 rounded-lg p-3">
              <p className="text-xs font-semibold text-brand-700 mb-1">AI Summary</p>
              <p className="text-sm text-brand-800">{lead.aiSummary}</p>
            </div>}

          <div>
            <p className="text-gray-400 text-xs mb-2">Internal Notes</p>
            <div className="space-y-2 mb-3">
              {localNotes.map((note, i) => <div key={i} className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                  {note.text}
                </div>)}
              {localNotes.length === 0 && <p className="text-xs text-gray-300">No notes yet</p>}
            </div>
            <div className="flex gap-2">
              <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add an internal note..." className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-brand-500" />
              <button onClick={handleAddNote} disabled={isSavingNote} className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white px-3 rounded-lg text-xs font-medium">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
function DetailRow({
  label,
  value
}) {
  return <div className="flex justify-between border-b border-gray-50 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>;
}
