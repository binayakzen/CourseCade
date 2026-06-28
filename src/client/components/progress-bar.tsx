export type ProgressBarProps = {
  value: number // 0-100
  color?: string // any CSS color
  label?: string
}

export function ProgressBar({
  value,
  color = 'var(--neon-green)',
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900">{label}</span>
          <span className="text-sm font-bold" style={{ color }}>
            {clamped}%
          </span>
        </div>
      )}
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${clamped}%`,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  )
}
