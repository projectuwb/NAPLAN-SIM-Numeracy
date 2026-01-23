// AnalogClock SVG component for time-telling questions

function AnalogClock({ hour, minute }) {
  const size = 200;
  const center = size / 2;
  const clockRadius = 85;

  // Convert to 12-hour format
  const hour12 = hour % 12;

  // Calculate angles (12 o'clock = 0°, clockwise)
  // Minute hand: 6° per minute
  const minuteAngle = (minute * 6) - 90;
  // Hour hand: 30° per hour + 0.5° per minute
  const hourAngle = ((hour12 * 30) + (minute * 0.5)) - 90;

  // Convert angle to radians
  const toRadians = (angle) => angle * (Math.PI / 180);

  // Calculate hand positions
  const hourHandLength = 50;
  const minuteHandLength = 70;

  const hourX = center + hourHandLength * Math.cos(toRadians(hourAngle));
  const hourY = center + hourHandLength * Math.sin(toRadians(hourAngle));

  const minuteX = center + minuteHandLength * Math.cos(toRadians(minuteAngle));
  const minuteY = center + minuteHandLength * Math.sin(toRadians(minuteAngle));

  // Clock numbers
  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="flex justify-center my-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={clockRadius}
          fill="white"
          stroke="#000"
          strokeWidth="3"
        />

        {/* Hour markers */}
        {numbers.map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = center + (clockRadius - 20) * Math.cos(angle);
          const y = center + (clockRadius - 20) * Math.sin(angle);
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fontWeight="bold"
              fontFamily="Arial"
            >
              {num}
            </text>
          );
        })}

        {/* Minute tick marks */}
        {Array.from({ length: 60 }, (_, i) => {
          if (i % 5 === 0) return null; // Skip hour positions
          const angle = (i * 6 - 90) * (Math.PI / 180);
          const innerRadius = clockRadius - 5;
          const outerRadius = clockRadius - 2;
          const x1 = center + innerRadius * Math.cos(angle);
          const y1 = center + innerRadius * Math.sin(angle);
          const x2 = center + outerRadius * Math.cos(angle);
          const y2 = center + outerRadius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#666"
              strokeWidth="1"
            />
          );
        })}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={hourX}
          y2={hourY}
          stroke="#000"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={minuteX}
          y2={minuteY}
          stroke="#000"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r="6" fill="#000"/>
      </svg>
    </div>
  );
}

export default AnalogClock;
