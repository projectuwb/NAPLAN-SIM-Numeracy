// Pictograph component for data representation questions

function Pictograph({
  categories = [],
  values = [],
  symbolsPerUnit = 1,
  symbol = '⭐',
  title = 'Pictograph'
}) {
  const width = 500;
  const rowHeight = 40;
  const padding = 20;
  const labelWidth = 120;
  const symbolSize = 30;
  const symbolSpacing = 35;

  // Handle both array and object formats
  let data = [];
  if (Array.isArray(categories) && Array.isArray(values)) {
    data = categories.map((cat, i) => ({
      category: cat,
      value: values[i] || 0
    }));
  } else if (typeof categories === 'object') {
    data = Object.entries(categories).map(([cat, val]) => ({
      category: cat,
      value: val
    }));
  }

  const height = padding * 2 + 40 + (data.length * rowHeight) + 40;

  // Symbol emojis available
  const symbols = {
    star: '⭐',
    heart: '❤️',
    smiley: '😊',
    apple: '🍎',
    book: '📚',
    car: '🚗',
    flower: '🌸',
    ball: '⚽',
    circle: '⚫'
  };

  const displaySymbol = symbols[symbol] || symbol || '⭐';

  return (
    <div className="flex justify-center my-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Title */}
        <text
          x={width / 2}
          y={30}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fontFamily="Arial"
        >
          {title}
        </text>

        {/* Legend */}
        <g transform={`translate(${padding}, ${50})`}>
          <text
            x={0}
            y={0}
            fontSize="14"
            fontFamily="Arial"
          >
            {displaySymbol} = {symbolsPerUnit} {symbolsPerUnit === 1 ? 'item' : 'items'}
          </text>
        </g>

        {/* Rows */}
        {data.map((item, rowIdx) => {
          const y = 80 + rowIdx * rowHeight;
          const numSymbols = Math.ceil(item.value / symbolsPerUnit);

          return (
            <g key={rowIdx}>
              {/* Category label */}
              <text
                x={padding}
                y={y + 20}
                fontSize="14"
                fontFamily="Arial"
              >
                {item.category}
              </text>

              {/* Symbols */}
              {Array.from({ length: numSymbols }, (_, i) => {
                const symbolX = padding + labelWidth + i * symbolSpacing;
                return (
                  <text
                    key={i}
                    x={symbolX}
                    y={y + 20}
                    fontSize="24"
                    fontFamily="Arial"
                  >
                    {displaySymbol}
                  </text>
                );
              })}

              {/* Value label */}
              <text
                x={padding + labelWidth + numSymbols * symbolSpacing + 10}
                y={y + 20}
                fontSize="12"
                fontFamily="Arial"
                fill="#666"
              >
                ({item.value})
              </text>
            </g>
          );
        })}

        {/* Bottom border */}
        <line
          x1={padding}
          y1={height - 30}
          x2={width - padding}
          y2={height - 30}
          stroke="#ccc"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export default Pictograph;
