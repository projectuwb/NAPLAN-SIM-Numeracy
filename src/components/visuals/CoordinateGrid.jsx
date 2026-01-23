// CoordinateGrid component for position/coordinate questions

function CoordinateGrid({
  xRange = { min: 0, max: 10 },
  yRange = { min: 0, max: 10 },
  points = [],
  title = 'Coordinate Grid'
}) {
  const width = 400;
  const height = 400;
  const padding = 50;
  const gridWidth = width - 2 * padding;
  const gridHeight = height - 2 * padding;

  const xSpan = xRange.max - xRange.min;
  const ySpan = yRange.max - yRange.min;
  const cellWidth = gridWidth / xSpan;
  const cellHeight = gridHeight / ySpan;

  // Convert coordinate to SVG position
  const getX = (x) => padding + ((x - xRange.min) * cellWidth);
  const getY = (y) => height - padding - ((y - yRange.min) * cellHeight);

  return (
    <div className="flex justify-center my-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Title */}
        <text
          x={width / 2}
          y={20}
          textAnchor="middle"
          fontSize="16"
          fontWeight="bold"
          fontFamily="Arial"
        >
          {title}
        </text>

        {/* Grid lines - vertical */}
        {Array.from({ length: xSpan + 1 }, (_, i) => {
          const x = padding + i * cellWidth;
          return (
            <line
              key={`vline-${i}`}
              x1={x}
              y1={padding}
              x2={x}
              y2={height - padding}
              stroke="#ddd"
              strokeWidth="1"
            />
          );
        })}

        {/* Grid lines - horizontal */}
        {Array.from({ length: ySpan + 1 }, (_, i) => {
          const y = padding + i * cellHeight;
          return (
            <line
              key={`hline-${i}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#ddd"
              strokeWidth="1"
            />
          );
        })}

        {/* X-axis (thick line) */}
        <line
          x1={padding}
          y1={getY(0)}
          x2={width - padding}
          y2={getY(0)}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Y-axis (thick line) */}
        <line
          x1={getX(0)}
          y1={padding}
          x2={getX(0)}
          y2={height - padding}
          stroke="#000"
          strokeWidth="2"
        />

        {/* X-axis labels */}
        {Array.from({ length: xSpan + 1 }, (_, i) => {
          const value = xRange.min + i;
          const x = padding + i * cellWidth;
          return (
            <text
              key={`xlabel-${i}`}
              x={x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fontFamily="Arial"
            >
              {value}
            </text>
          );
        })}

        {/* Y-axis labels */}
        {Array.from({ length: ySpan + 1 }, (_, i) => {
          const value = yRange.min + i;
          const y = height - padding - i * cellHeight;
          return (
            <text
              key={`ylabel-${i}`}
              x={padding - 15}
              y={y + 5}
              textAnchor="middle"
              fontSize="12"
              fontFamily="Arial"
            >
              {value}
            </text>
          );
        })}

        {/* Plot points */}
        {points.map((point, idx) => {
          const x = getX(point.x);
          const y = getY(point.y);
          return (
            <g key={idx}>
              {/* Point */}
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={point.color || '#2196F3'}
                stroke="#000"
                strokeWidth="1.5"
              />
              {/* Label */}
              {point.label && (
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="Arial"
                  fill="#000"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="13"
          fontFamily="Arial"
          fontStyle="italic"
        >
          x
        </text>
        <text
          x={20}
          y={height / 2}
          textAnchor="middle"
          fontSize="13"
          fontFamily="Arial"
          fontStyle="italic"
        >
          y
        </text>
      </svg>
    </div>
  );
}

export default CoordinateGrid;
