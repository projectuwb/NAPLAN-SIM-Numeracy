// NumberLine SVG component for showing numbers on a line with an arrow

function NumberLine({ min = 0, max = 250, marked, interval = 50 }) {
  const width = 600;
  const height = 100;
  const padding = 50;

  // Calculate position of marked value
  const range = max - min;
  const x = padding + ((marked - min) / range) * (width - 2 * padding);

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i <= 10; i++) {
    const value = min + (range * i / 10);
    const tickX = padding + (i / 10) * (width - 2 * padding);

    // Only show labels at interval
    const showLabel = value % interval === 0;

    ticks.push({
      x: tickX,
      value,
      showLabel
    });
  }

  return (
    <div className="flex justify-center my-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#DC2626"/>
          </marker>
        </defs>

        {/* Main line */}
        <line
          x1={padding}
          y1={50}
          x2={width - padding}
          y2={50}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Tick marks and labels */}
        {ticks.map((tick, i) => (
          <g key={i}>
            <line
              x1={tick.x}
              y1={45}
              x2={tick.x}
              y2={55}
              stroke="#000"
              strokeWidth="1"
            />
            {tick.showLabel && (
              <text
                x={tick.x}
                y={75}
                textAnchor="middle"
                fontSize="14"
                fontFamily="Arial"
              >
                {Math.round(tick.value)}
              </text>
            )}
          </g>
        ))}

        {/* Arrow pointing to marked value */}
        <line
          x1={x}
          y1={20}
          x2={x}
          y2={45}
          stroke="#DC2626"
          strokeWidth="3"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    </div>
  );
}

export default NumberLine;
