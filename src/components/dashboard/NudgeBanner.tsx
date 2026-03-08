interface NudgeBannerProps {
  awaitingCount: number;
  onSendReminder: () => void;
}

const NudgeBanner = ({ awaitingCount, onSendReminder }: NudgeBannerProps) => {
  if (awaitingCount <= 0) return null;

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-4 rounded-xl mb-6"
      style={{
        background: "#fffbeb",
        border: "1px solid #fcd34d",
      }}
    >
      <span className="text-lg">⏳</span>
      <p className="font-body text-sm flex-1" style={{ color: "#92400e" }}>
        <strong>{awaitingCount} guests</strong> haven't replied yet.
      </p>
      <button
        onClick={onSendReminder}
        className="font-body text-sm font-medium underline cursor-pointer transition-colors text-primary hover:text-primary/80 whitespace-nowrap"
      >
        Send a gentle reminder →
      </button>
    </div>
  );
};

export default NudgeBanner;
