export default function ScoreCircle({ score = 0, size = 110 }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (circumference * Math.min(score, 100)) / 100

  return (
    <div className="score-circle" style={{ width: size, height: size }}>
      <svg viewBox="0 0 110 110" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle className="track" cx="55" cy="55" r={radius} />
        <circle
          className="fill"
          cx="55" cy="55" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .8s ease' }}
        />
      </svg>
      <div className="label">
        {score}
      </div>
    </div>
  )
}
