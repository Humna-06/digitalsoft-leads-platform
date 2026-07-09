const STATUS_COLORS = {
  New: "bg-gray-100 text-gray-700",
  Contacted: "bg-blue-100 text-blue-700",
  Qualified: "bg-purple-100 text-purple-700",
  "Meeting Scheduled": "bg-indigo-100 text-indigo-700",
  "Proposal Sent": "bg-yellow-100 text-yellow-700",
  Won: "bg-green-100 text-green-700",
  Lost: "bg-red-100 text-red-700",
  "High Priority": "bg-red-100 text-red-700",
  "Medium Priority": "bg-yellow-100 text-yellow-700",
  "Low Priority": "bg-gray-100 text-gray-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
  Rescheduled: "bg-yellow-100 text-yellow-700",
  Completed: "bg-green-100 text-green-700"
};
export default function StatusBadge({
  status
}) {
  const colorClasses = STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClasses}`}>
      {status}
    </span>;
}
