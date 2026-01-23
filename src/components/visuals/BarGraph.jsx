// BarGraph SVG component for data questions

function BarGraph({ categories, values, title = 'Bar Graph' }) {
  const width = 400;
  const height = 300;
  const padding = 60;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - padding - 40;

  // Handle both array and object formats
  let data = [];
  if (Array.isArray(categories) && Array.isArray(values)) {
    data = categories.map((cat, i) => ({
      category: cat,
      value: values[i] || 0
    }));
  } else if (typeof categories === 'object') {
    // Handle object format
    data = Object.entries(categories).map(([cat, val]) => ({
      category: cat,
      value: val
    }));
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);
  const barWidth = graphWidth / data.length - 10;

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

        {/* Y-axis */}
        <line
          x1={padding}
          y1={40}
          x2={padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#000"
          strokeWidth="2"
        />

        {/* Bars */}
        {data.map((item, i) => {
          const barHeight = (item.value / maxValue) * graphHeight;
          const x = padding + 10 + i * (barWidth + 10);
          const y = height - padding - barHeight;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#2196F3"
                stroke="#000"
                strokeWidth="1"
              />

              {/* Value label on top */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fontFamily="Arial"
              >
                {item.value}
              </text>

              {/* Category label below */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                fontSize="12"
                fontFamily="Arial"
              >
                {item.category}
              </text>
            </g>
          );
        })}

        {/* Y-axis labels */}
        {Array.from({ length: 6 }, (_, i) => {
          const value = Math.round((maxValue / 5) * i);
          const y = height - padding - (graphHeight / 5) * i;
          return (
            <text
              key={i}
              x={padding - 10}
              y={y}
              textAnchor="end"
              fontSize="11"
              fontFamily="Arial"
            >
              {value}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default BarGraph;
