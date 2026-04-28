import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface ErrorStateProps {
  title: string;
  message: string;
  details?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onRetry?: () => void;
}

const ErrorState = ({ title, message, details, ctaLabel, ctaHref, onRetry }: ErrorStateProps) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12 text-center">
    <div className="max-w-lg rounded-3xl border border-border bg-card p-10 shadow-xl">
      <div className="text-6xl mb-5">⚠️</div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">{title}</h1>
      <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{message}</p>
      {details && <p className="font-body text-xs text-muted-foreground/80 mb-6">{details}</p>}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {ctaHref && (
          <a href={ctaHref} className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all">
            {ctaLabel || "Go back"} <ArrowRight className="w-4 h-4" />
          </a>
        )}
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="rounded-full h-12 px-6 font-body">
            Retry
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default ErrorState;
