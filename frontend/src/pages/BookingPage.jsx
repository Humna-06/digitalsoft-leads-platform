import { useState, useEffect } from "react";
import { getAvailability, bookAppointment, getCalendarExportUrl } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";
export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [leadEmail, setLeadEmail] = useState("");
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [toast, setToast] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);
  useEffect(() => {
    if (!selectedDate) return;
    async function fetchSlots() {
      setIsLoadingSlots(true);
      setSelectedSlot(null);
      try {
        const response = await getAvailability(selectedDate);
        setSlots(response.data.slots);
      } catch (error) {
        setToast({
          message: "Could not load availability",
          type: "error"
        });
      } finally {
        setIsLoadingSlots(false);
      }
    }
    fetchSlots();
  }, [selectedDate]);
  async function handleBook() {
    if (!selectedSlot || !leadEmail) {
      setToast({
        message: "Please select a slot and enter your email",
        type: "error"
      });
      return;
    }
    setIsBooking(true);
    try {
      const response = await bookAppointment({
        leadEmail,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        meetingTitle: "DigitalSoft Consultation Meeting",
        description: "Initial project discussion meeting"
      });
      setBookedAppointment(response.data.data);
      setToast({
        message: "Meeting booked successfully!",
        type: "success"
      });
    } catch (error) {
      const message = error.response?.data?.message || "Booking failed. Please try again.";
      setToast({
        message,
        type: "error"
      });
    } finally {
      setIsBooking(false);
    }
  }
  const today = new Date().toISOString().split("T")[0];
  if (bookedAppointment) {
    return <div className="max-w-lg mx-auto mt-16 bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Meeting Confirmed!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          {new Date(bookedAppointment.startTime).toLocaleString()}
        </p>
        <a href={getCalendarExportUrl(bookedAppointment._id)} className="inline-block bg-spark-500 hover:bg-spark-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
          Download Calendar Invite (.ics)
        </a>
        <p className="text-xs text-gray-400 mt-4">
          Works with Google Calendar, Outlook, and Apple Calendar
        </p>
      </div>;
  }
  return <div className="max-w-2xl mx-auto py-10 px-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-800">Book a Meeting</h1>
        <p className="text-gray-500 mt-1">Choose a date and time that works for you.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Email (used to submit inquiry)</label>
          <input type="email" value={leadEmail} onChange={e => setLeadEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-spark-400 outline-none" placeholder="you@company.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select a Date</label>
          <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-spark-400 outline-none" />
        </div>

        {isLoadingSlots && <LoadingSpinner text="Loading available slots..." />}

        {!isLoadingSlots && slots.length > 0 && <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map(slot => {
            const isSelected = selectedSlot?.startTime === slot.startTime;
            return <button key={slot.startTime} disabled={!slot.available} onClick={() => setSelectedSlot(slot)} className={`text-xs py-2 rounded-lg border font-medium transition ${!slot.available ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" : isSelected ? "bg-spark-500 text-white border-spark-500" : "bg-white text-gray-700 border-gray-200 hover:border-spark-400"}`}>
                    {new Date(slot.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}
                  </button>;
          })}
            </div>
          </div>}

        <button onClick={handleBook} disabled={isBooking || !selectedSlot} className="w-full bg-spark-500 hover:bg-spark-600 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-semibold transition">
          {isBooking ? "Booking..." : "Confirm Meeting"}
        </button>
      </div>
    </div>;
}
