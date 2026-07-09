const STAGES = ["New", "Contacted", "Qualified", "Meeting Scheduled", "Proposal Sent", "Won"];

export default function PipelineStepper({ currentStage, compact = false }) {
  const currentIndex = STAGES.indexOf(currentStage);
  const isLost = currentStage === "Lost";

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
      {STAGES.map((stage, i) => {
        const isDone = !isLost && i <= currentIndex;
        const isCurrent = !isLost && i === currentIndex;

        return (
          <div key={stage} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={`rounded-full transition-colors ${compact ? "w-2 h-2" : "w-3 h-3"} ${
                  isLost
                    ? "bg-red-200"
                    : isCurrent
                    ? "bg-spark-500 ring-4 ring-spark-100"
                    : isDone
                    ? "bg-spark-400"
                    : "bg-gray-200"
                }`}
              />
              {!compact && (
                <span className={`text-[10px] whitespace-nowrap ${isCurrent ? "text-spark-700 font-semibold" : "text-gray-400"}`}>
                  {stage}
                </span>
              )}
            </div>
            {i < STAGES.length - 1 && (
              <div className={`h-0.5 flex-1 ${isDone && i < currentIndex ? "bg-spark-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
