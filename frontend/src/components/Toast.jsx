import { useEffect } from "react";
export default function Toast({
  message,
  type = "success",
  onClose
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const styles = type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200";
  return <div className={`fixed top-4 right-4 z-50 border rounded-lg px-4 py-3 shadow-md ${styles}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>;
}
