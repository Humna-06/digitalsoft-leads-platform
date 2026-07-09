import { useState, useEffect } from "react";
import { getAppointments, updateAppointment, getCalendarExportUrl } from "../services/api";
import Sidebar from "../components/Sidebar";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDateTime, setNewDateTime] = useState("");
  useEffect(() => {
    fetchAppointments();
  }, []);
  async function fetchAppointments() {
    setIsLoading(true);
    try {
      const response = await getAppointments();
      setAppointments(response.data.data);
    } catch (error) {
      setToast({
        message: "Failed to load appointments",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  }
  async function handleCancel(id) {
    try {
      await updateAppointment(id, {
        status: "Cancelled"
      });
      setToast({
        message: "Meeting cancelled",
        type: "success"
      });
      fetchAppointments();
    } catch (error) {
      setToast({
        message: "Failed to cancel meeting",
        type: "error"
      });
    }
  }
  function openRescheduleForm(appt) {
    setReschedulingId(appt._id);
    setNewDateTime("");
  }
  async function handleReschedule(id) {
    if (!newDateTime) {
      setToast({ message: "Please choose a new date and time", type: "error" });
      return;
    }
    const startTime = new Date(newDateTime);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    try {
      await updateAppointment(id, {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
      setToast({ message: "Meeting rescheduled", type: "success" });
      setReschedulingId(null);
      fetchAppointments();
    } catch (error) {
      setToast({ message: "Failed to reschedule meeting", type: "error" });
    }
  }
  return <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm">All scheduled meetings from the booking system</p>
        </div>

        {isLoading ? <LoadingSpinner text="Loading appointments..." /> : <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Date &amp; Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map(appt => <tr key={appt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{appt.leadId?.fullName || "Unknown"}</p>
                      <p className="text-xs text-gray-400">{appt.leadId?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(appt.startTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={appt.status} /></td>
                    <td className="px-4 py-3">
                      {reschedulingId === appt._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="datetime-local"
                            value={newDateTime}
                            onChange={(e) => setNewDateTime(e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                          />
                          <button
                            onClick={() => handleReschedule(appt._id)}
                            className="text-green-600 hover:text-green-700 text-xs font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setReschedulingId(null)}
                            className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <a href={getCalendarExportUrl(appt._id)} className="text-brand-600 hover:text-brand-700 text-xs font-medium">
                            Export .ics
                          </a>
                          {appt.status !== "Cancelled" && (
                            <>
                              <button onClick={() => openRescheduleForm(appt)} className="text-yellow-600 hover:text-yellow-700 text-xs font-medium">
                                Reschedule
                              </button>
                              <button onClick={() => handleCancel(appt._id)} className="text-red-600 hover:text-red-700 text-xs font-medium">
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>)}
                {appointments.length === 0 && <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-400">
                      No appointments booked yet
                    </td>
                  </tr>}
              </tbody>
            </table>
          </div>}
      </main>
    </div>;
}
