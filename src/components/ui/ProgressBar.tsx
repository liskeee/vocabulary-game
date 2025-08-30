interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ current, total, className = '', showPercentage = true }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-pink-700">Progress</span>
        {showPercentage && (
          <span className="text-sm font-medium text-pink-700">{percentage}%</span>
        )}
      </div>
      <div className="w-full bg-pink-100 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-pink-500 to-pink-600 h-3 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-pink-600">{current} completed</span>
        <span className="text-xs text-pink-600">{total} total</span>
      </div>
    </div>
  );
}
