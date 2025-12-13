import { useState } from "react";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export function SubscriptionCancel({ subId, onCancel }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "https://weedit-co.onrender.com";

  const handleConfirmCancel = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/payment/cancel-subscription/${subId}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to cancel subscription.");
        setLoading(false);
        return;
      }

      onCancel(subId, data.nextBilling);
      setOpen(false);
      setLoading(false);

      toast.success("Subscription canceled successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while canceling.");
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Button
          variant="destructive"
          className="w-full transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-400/50"
          onClick={() => setOpen(true)}
        >
          Cancel Subscription
        </Button>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={() => !loading && setOpen(false)}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-auto shadow-lg border border-gray-200 dark:border-gray-700 relative">
          <div className="flex flex-col items-center text-center gap-4">
            <AlertTriangle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-bold text-foreground dark:text-white">
              Cancel Subscription
            </h2>
            <p className="text-sm text-muted-foreground dark:text-gray-300">
              Are you sure you want to cancel this subscription? You will lose
              access immediately.
            </p>

            <div className="flex gap-3 mt-4 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmCancel}
                disabled={loading}
              >
                {loading ? "Canceling..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
