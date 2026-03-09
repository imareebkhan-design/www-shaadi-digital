import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CONFIG, type PlanId } from "@/hooks/useRazorpay";

const ERROR_MESSAGES: Record<string, string> = {
  card_declined: "Your card was declined. Please try a different payment method.",
  insufficient_funds: "Insufficient funds. Please try a different card or UPI.",
  payment_timeout: "Payment timed out. Please try again.",
  network_error: "Network issue detected. Please check your connection and try again.",
};

export interface PaymentFailureData {
  planId: PlanId;
  failureCode?: string;
  failureReason?: string;
  orderId?: string;
}

interface Props {
  open: boolean;
  data: PaymentFailureData;
  onRetry: () => void;
  onClose: () => void;
}

const PaymentFailedModal = ({ open, data, onRetry, onClose }: Props) => {
  if (!open) return null;

  const plan = PLAN_CONFIG[data.planId];
  const friendlyMessage =
    ERROR_MESSAGES[data.failureCode || ""] ||
    "Something went wrong. Please try again or contact support.";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div className="bg-card w-full max-w-md p-8 md:p-10 relative shadow-2xl border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-2xl text-destructive font-bold">✗</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-display text-2xl text-primary text-center mb-2">
          Payment Unsuccessful
        </h2>
        <p className="text-muted-foreground text-center text-sm font-body mb-4">
          Don't worry, you have not been charged.
        </p>

        {/* Plan badge */}
        <div className="flex justify-center mb-4">
          <span
            className="text-xs font-body font-semibold px-3 py-1 rounded-full"
            style={{
              color: "#C9941A",
              backgroundColor: "rgba(201,148,26,0.1)",
              border: "1px solid rgba(201,148,26,0.25)",
            }}
          >
            {plan.name} Plan — ₹{(plan.amount / 100).toLocaleString("en-IN")}
          </span>
        </div>

        {/* Error reason */}
        <div className="bg-destructive/5 border border-destructive/15 p-4 mb-6 text-center">
          <p className="text-sm font-body text-foreground">{friendlyMessage}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onRetry}
            className="w-full rounded-none min-h-[52px] h-auto font-body text-sm tracking-wide"
            style={{ backgroundColor: "#C9941A", color: "#fff" }}
          >
            Try Again →
          </Button>
          <Button
            variant="outline"
            asChild
            className="w-full rounded-none min-h-[44px] h-auto font-body text-sm"
          >
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Support
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4 font-body">
          Need help? Email{" "}
          <a
            href="mailto:support@shaadi.digital"
            className="text-primary hover:underline"
          >
            support@shaadi.digital
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentFailedModal;
