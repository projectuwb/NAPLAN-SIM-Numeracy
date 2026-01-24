// VisualRenderer.jsx - Complete SVG Visual Component System for NAPLAN
// Handles all 21 visual types from question bank

import React from 'react';

// ====================================================================
// MAIN RENDERER - Routes to appropriate visual component
// ====================================================================

const VisualRenderer = ({ visual }) => {
  if (!visual || !visual.type) return null;

  const { type, ...data } = visual;

  switch (type) {
    // Priority 1: Most Used
    case 'numberLine':
      return <NumberLine {...data} />;
    case 'barGraph':
      return <BarGraph {...data} />;
    case 'angle':
      return <Angle {...data} />;

    // Priority 2: Core Math Visuals
    case 'analogClock':
      return <AnalogClock {...data} />;
    case 'array':
      return <Array {...data} />;
    case 'boxPlot':
      return <BoxPlot {...data} />;
    case 'cartesianPlane':
      return <CartesianPlane {...data} />;
    case 'coins':
      return <Coins {...data} />;
    case 'compositeShape':
      return <CompositeShape {...data} />;
    case 'coordinateGrid':
      return <CoordinateGrid {...data} />;
    case 'fractionCircle':
      return <FractionCircle {...data} />;
    case 'grid':
      return <Grid {...data} />;
    case 'gridRectangle':
      return <GridRectangle {...data} />;
    case 'lineGraph':
      return <LineGraph {...data} />;
    case 'parallelLines':
      return <ParallelLines {...data} />;
    case 'pictograph':
      return <Pictograph {...data} />;
    case 'rectangle':
      return <Rectangle {...data} />;
    case 'scale':
      return <Scale {...data} />;
    case 'shape':
      return <Shape {...data} />;
    case 'stemLeaf':
      return <StemLeaf {...data} />;
    case 'table':
      return <Table {...data} />;
    case 'triangle':
      return <Triangle {...data} />;

    default:
      console.warn(`Unknown visual type: ${type}`);
      return <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm">Visual type "{type}" not yet implemented</div>;
  }
};

// ====================================================================
// PRIORITY 1: MOST USED COMPONENTS
// ====================================================================

const NumberLine = ({ min = 0, max = 10, marked, label }) => {
  const width = 600;
  const height = 120;
  const padding = 60;

  // Calculate position of marked value
  const range = max - min;
  const markedX = padding + ((marked - min) / range) * (width - 2 * padding);

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded">
        {/* Main line */}
        <line
          x1={padding}
          y1={60}
          x2={width - padding}
          y2={60}
          stroke="black"
          strokeWidth="3"
        />

        {/* Tick marks and labels */}
        {Array.from({ length: 11 }, (_, i) => {
          const value = min + (range * i / 10);
          const x = padding + (i / 10) * (width - 2 * padding);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={55}
                x2={x}
                y2={65}
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={x}
                y={85}
                textAnchor="middle"
                fontSize="14"
                fill="black"
              >
                {Math.round(value * 10) / 10}
              </text>
            </g>
          );
        })}

        {/* Arrow pointing to marked value */}
        <g>
          <line
            x1={markedX}
            y1={20}
            x2={markedX}
            y2={50}
            stroke="#DC2626"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
          {label && (
            <text
              x={markedX}
              y={15}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#DC2626"
            >
              {label}
            </text>
          )}
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#DC2626" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

const BarGraph = ({ data, title, xLabel, yLabel }) => {
  if (!data || !Array.isArray(data)) {
    return <div className="p-4 bg-red-50 text-red-700">Invalid bar graph data</div>;
  }

  const width = 500;
  const height = 350;
  const padding = { top: 40, right: 30, bottom: 60, left: 50 };

  const maxValue = Math.max(...data.map(d => d.value || 0));
  const barWidth = (width - padding.left - padding.right) / data.length - 20;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Title */}
        {title && (
          <text x={width / 2} y={25} textAnchor="middle" fontSize="16" fontWeight="bold">
            {title}
          </text>
        )}

        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="black"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="black"
          strokeWidth="2"
        />

        {/* Bars */}
        {data.map((item, i) => {
          const barHeight = ((item.value || 0) / maxValue) * (height - padding.top - padding.bottom);
          const x = padding.left + 10 + i * (barWidth + 20);
          const y = height - padding.bottom - barHeight;

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#3B82F6"
                stroke="black"
                strokeWidth="1"
              />
              
              {/* Value on top */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
              >
                {item.value}
              </text>

              {/* Category label */}
              <text
                x={x + barWidth / 2}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fontSize="13"
              >
                {item.category || item.label || `Item ${i + 1}`}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        {yLabel && (
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            fontSize="12"
            transform={`rotate(-90, 15, ${height / 2})`}
          >
            {yLabel}
          </text>
        )}
        {xLabel && (
          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
          >
            {xLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

const Angle = ({ degrees, showProtractor = true }) => {
  const size = 300;
  const cx = 150;
  const cy = 200;
  const radius = 100;

  // Convert degrees to radians
  const angleRad = (degrees * Math.PI) / 180;

  // Calculate line endpoints
  const x2 = cx + radius * Math.cos(0);
  const y2 = cy - radius * Math.sin(0);
  const x3 = cx + radius * Math.cos(angleRad);
  const y3 = cy - radius * Math.sin(angleRad);

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} className="border border-gray-200 rounded bg-white">
        {/* Angle arc */}
        <path
          d={`M ${x2} ${y2} A ${radius} ${radius} 0 ${degrees > 180 ? 1 : 0} 0 ${x3} ${y3}`}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
        />

        {/* First line (horizontal) */}
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="black" strokeWidth="3" />

        {/* Second line (at angle) */}
        <line x1={cx} y1={cy} x2={x3} y2={y3} stroke="black" strokeWidth="3" />

        {/* Vertex point */}
        <circle cx={cx} cy={cy} r="5" fill="black" />

        {/* Angle label */}
        <text
          x={cx + 40}
          y={cy - 10}
          fontSize="18"
          fontWeight="bold"
          fill="#3B82F6"
        >
          {degrees}°
        </text>

        {/* Protractor marks if shown */}
        {showProtractor && (
          <g opacity="0.3">
            {Array.from({ length: 19 }, (_, i) => {
              const markAngle = (i * 10 * Math.PI) / 180;
              const r1 = radius - 10;
              const r2 = radius - 5;
              const mx1 = cx + r1 * Math.cos(markAngle);
              const my1 = cy - r1 * Math.sin(markAngle);
              const mx2 = cx + r2 * Math.cos(markAngle);
              const my2 = cy - r2 * Math.sin(markAngle);
              
              return (
                <line
                  key={i}
                  x1={mx1}
                  y1={my1}
                  x2={mx2}
                  y2={my2}
                  stroke="gray"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
};

// ====================================================================
// PRIORITY 2: CORE MATH VISUALS
// ====================================================================

const AnalogClock = ({ hour, minute }) => {
  const size = 220;
  const center = size / 2;
  const clockRadius = 95;

  // Convert to 12-hour format
  const hour12 = hour % 12;

  // Calculate angles (12 o'clock = -90°)
  const minuteAngle = (minute * 6) - 90;
  const hourAngle = ((hour12 * 30) + (minute * 0.5)) - 90;

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} className="border-2 border-gray-300 rounded-full bg-white">
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={clockRadius}
          fill="white"
          stroke="black"
          strokeWidth="4"
        />

        {/* Hour markers */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = center + (clockRadius - 25) * Math.cos(angle);
          const y = center + (clockRadius - 25) * Math.sin(angle);
          
          return (
            <text
              key={num}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="18"
              fontWeight="bold"
            >
              {num}
            </text>
          );
        })}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center + 55 * Math.cos(hourAngle * Math.PI / 180)}
          y2={center + 55 * Math.sin(hourAngle * Math.PI / 180)}
          stroke="black"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center + 75 * Math.cos(minuteAngle * Math.PI / 180)}
          y2={center + 75 * Math.sin(minuteAngle * Math.PI / 180)}
          stroke="black"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={center} cy={center} r="8" fill="black" />
      </svg>
    </div>
  );
};

const Array = ({ rows, cols, item = "•" }) => {
  const cellSize = 40;
  const width = cols * cellSize + 40;
  const height = rows * cellSize + 40;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={20 + c * cellSize + cellSize / 2}
              cy={20 + r * cellSize + cellSize / 2}
              r="12"
              fill="#3B82F6"
              stroke="black"
              strokeWidth="1"
            />
          ))
        )}
        
        {/* Dimension labels */}
        <text x={width / 2} y={height - 5} textAnchor="middle" fontSize="14" fontWeight="bold">
          {cols} columns
        </text>
        <text
          x={5}
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          transform={`rotate(-90, 5, ${height / 2})`}
        >
          {rows} rows
        </text>
      </svg>
    </div>
  );
};

const FractionCircle = ({ numerator, denominator }) => {
  const size = 220;
  const center = size / 2;
  const radius = 90;

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = angleInDegrees * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} className="border border-gray-200 rounded bg-white">
        {/* Draw pie slices */}
        {Array.from({ length: denominator }, (_, i) => {
          const startAngle = (i * 360 / denominator) - 90;
          const endAngle = ((i + 1) * 360 / denominator) - 90;
          const isShaded = i < numerator;

          const start = polarToCartesian(center, center, radius, startAngle);
          const end = polarToCartesian(center, center, radius, endAngle);

          const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

          const pathData = [
            `M ${center} ${center}`,
            `L ${start.x} ${start.y}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={i}
              d={pathData}
              fill={isShaded ? '#10B981' : 'white'}
              stroke="black"
              strokeWidth="2"
            />
          );
        })}

        {/* Center label */}
        <text
          x={center}
          y={size - 10}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
        >
          {numerator}/{denominator}
        </text>
      </svg>
    </div>
  );
};

const Coins = ({ amount }) => {
  // Australian coin values in cents
  const coins = [200, 100, 50, 20, 10, 5];
  const coinNames = {
    200: '$2',
    100: '$1',
    50: '50c',
    20: '20c',
    10: '10c',
    5: '5c'
  };

  // Calculate coins needed
  let remaining = Math.round(amount * 100); // Convert to cents
  const coinsUsed = [];

  for (const coin of coins) {
    while (remaining >= coin) {
      coinsUsed.push(coin);
      remaining -= coin;
    }
  }

  const coinSize = 50;
  const gap = 10;
  const coinsPerRow = 8;
  const rows = Math.ceil(coinsUsed.length / coinsPerRow);
  const width = coinsPerRow * (coinSize + gap) + gap;
  const height = rows * (coinSize + gap) + gap + 40;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white p-4">
        <text x={width / 2} y={20} textAnchor="middle" fontSize="16" fontWeight="bold">
          ${amount.toFixed(2)}
        </text>
        
        {coinsUsed.map((coinValue, i) => {
          const row = Math.floor(i / coinsPerRow);
          const col = i % coinsPerRow;
          const cx = gap + col * (coinSize + gap) + coinSize / 2;
          const cy = 30 + gap + row * (coinSize + gap) + coinSize / 2;
          
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={coinSize / 2}
                fill="#FCD34D"
                stroke="#92400E"
                strokeWidth="2"
              />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#92400E"
              >
                {coinNames[coinValue]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const CoordinateGrid = ({ points = [], gridSize = 6 }) => {
  const cellSize = 50;
  const padding = 40;
  const size = gridSize * cellSize + padding * 2;

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} className="border border-gray-200 rounded bg-white">
        {/* Grid lines */}
        {Array.from({ length: gridSize + 1 }, (_, i) => (
          <g key={i}>
            {/* Vertical */}
            <line
              x1={padding + i * cellSize}
              y1={padding}
              x2={padding + i * cellSize}
              y2={padding + gridSize * cellSize}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            {/* Horizontal */}
            <line
              x1={padding}
              y1={padding + i * cellSize}
              x2={padding + gridSize * cellSize}
              y2={padding + i * cellSize}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Axis labels */}
        {Array.from({ length: gridSize }, (_, i) => (
          <g key={i}>
            {/* X labels */}
            <text
              x={padding + (i + 0.5) * cellSize}
              y={padding + gridSize * cellSize + 25}
              textAnchor="middle"
              fontSize="12"
            >
              {i + 1}
            </text>
            {/* Y labels (inverted for top-left origin) */}
            <text
              x={padding - 15}
              y={padding + gridSize * cellSize - (i + 0.5) * cellSize + 5}
              textAnchor="middle"
              fontSize="12"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Plot points */}
        {points.map((point, i) => {
          const x = padding + (point.x - 0.5) * cellSize;
          const y = padding + gridSize * cellSize - (point.y - 0.5) * cellSize;
          
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#DC2626" />
              {point.label && (
                <text
                  x={x}
                  y={y - 15}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#DC2626"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Pictograph = ({ data, scale = 1, symbol = '🍎' }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="border border-gray-200 rounded p-4 bg-white max-w-md">
        <div className="space-y-3">
          {data.map((item, i) => {
            const symbolCount = Math.ceil(item.count / scale);
            
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="w-24 font-medium text-sm">{item.name}:</span>
                <span className="text-2xl">
                  {symbol.repeat(symbolCount)}
                </span>
                <span className="text-sm text-gray-600 ml-2">
                  ({item.count})
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t text-sm text-gray-600">
          Each {symbol} = {scale} {scale === 1 ? 'unit' : 'units'}
        </div>
      </div>
    </div>
  );
};

const Rectangle = ({ width: w, height: h, showGrid = false, gridCols, gridRows }) => {
  const scale = 40; // pixels per unit
  const svgWidth = w * scale + 40;
  const svgHeight = h * scale + 40;

  return (
    <div className="flex justify-center my-6">
      <svg width={svgWidth} height={svgHeight} className="border border-gray-200 rounded bg-white">
        {/* Rectangle */}
        <rect
          x={20}
          y={20}
          width={w * scale}
          height={h * scale}
          fill="white"
          stroke="black"
          strokeWidth="3"
        />

        {/* Grid if requested */}
        {showGrid && gridCols && gridRows && (
          <g>
            {Array.from({ length: gridCols - 1 }, (_, i) => (
              <line
                key={`v${i}`}
                x1={20 + ((i + 1) * w * scale) / gridCols}
                y1={20}
                x2={20 + ((i + 1) * w * scale) / gridCols}
                y2={20 + h * scale}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: gridRows - 1 }, (_, i) => (
              <line
                key={`h${i}`}
                x1={20}
                y1={20 + ((i + 1) * h * scale) / gridRows}
                x2={20 + w * scale}
                y2={20 + ((i + 1) * h * scale) / gridRows}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            ))}
          </g>
        )}

        {/* Dimension labels */}
        <text x={20 + (w * scale) / 2} y={svgHeight - 5} textAnchor="middle" fontSize="14" fontWeight="bold">
          {w}
        </text>
        <text
          x={5}
          y={20 + (h * scale) / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          transform={`rotate(-90, 5, ${20 + (h * scale) / 2})`}
        >
          {h}
        </text>
      </svg>
    </div>
  );
};

const Shape = ({ name, showSymmetry = false }) => {
  const size = 220;
  const center = size / 2;

  const shapes = {
    square: (
      <>
        <rect x={60} y={60} width={100} height={100} fill="white" stroke="black" strokeWidth="3" />
        {showSymmetry && (
          <g stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5">
            <line x1={center} y1={60} x2={center} y2={160} />
            <line x1={60} y1={center} x2={160} y2={center} />
            <line x1={60} y1={60} x2={160} y2={160} />
            <line x1={160} y1={60} x2={60} y2={160} />
          </g>
        )}
      </>
    ),
    rectangle: (
      <>
        <rect x={50} y={80} width={120} height={60} fill="white" stroke="black" strokeWidth="3" />
        {showSymmetry && (
          <g stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5">
            <line x1={center} y1={80} x2={center} y2={140} />
            <line x1={50} y1={center} x2={170} y2={center} />
          </g>
        )}
      </>
    ),
    circle: (
      <>
        <circle cx={center} cy={center} r="70" fill="white" stroke="black" strokeWidth="3" />
        {showSymmetry && (
          <>
            <g stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5">
              <line x1={40} y1={center} x2={180} y2={center} />
              <line x1={center} y1={40} x2={center} y2={180} />
            </g>
            <text x={center} y={200} textAnchor="middle" fontSize="12" fill="#DC2626">
              (Infinite lines)
            </text>
          </>
        )}
      </>
    ),
    triangle: (
      <>
        <polygon
          points={`${center},50 50,170 170,170`}
          fill="white"
          stroke="black"
          strokeWidth="3"
        />
        {showSymmetry && (
          <line x1={center} y1={50} x2={center} y2={170} stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5" />
        )}
      </>
    ),
    hexagon: (
      <>
        <polygon
          points="110,50 150,80 150,140 110,170 70,140 70,80"
          fill="white"
          stroke="black"
          strokeWidth="3"
        />
        {showSymmetry && (
          <g stroke="#DC2626" strokeWidth="2" strokeDasharray="5,5">
            <line x1={center} y1={50} x2={center} y2={170} />
            <line x1={70} y1={80} x2={150} y2={140} />
            <line x1={70} y1={140} x2={150} y2={80} />
          </g>
        )}
      </>
    )
  };

  return (
    <div className="flex justify-center my-6">
      <svg width={size} height={size} className="border border-gray-200 rounded bg-white">
        {shapes[name] || shapes.square}
      </svg>
    </div>
  );
};

// ====================================================================
// ADVANCED COMPONENTS (Phase 2)
// ====================================================================

const GridRectangle = ({ width: w, height: h, rows, cols }) => {
  return <Rectangle width={w} height={h} showGrid={true} gridRows={rows} gridCols={cols} />;
};

const Grid = ({ rows, cols, markedCells = [] }) => {
  const cellSize = 40;
  const width = cols * cellSize + 40;
  const height = rows * cellSize + 40;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Grid cells */}
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const isMarked = markedCells.some(cell => cell.row === r && cell.col === c);
            return (
              <rect
                key={`${r}-${c}`}
                x={20 + c * cellSize}
                y={20 + r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isMarked ? '#10B981' : 'white'}
                stroke="black"
                strokeWidth="1"
              />
            );
          })
        )}
      </svg>
    </div>
  );
};

const LineGraph = ({ data, title, xLabel, yLabel }) => {
  if (!data || !Array.isArray(data)) {
    return <div className="p-4 bg-red-50 text-red-700">Invalid line graph data</div>;
  }

  const width = 500;
  const height = 350;
  const padding = { top: 40, right: 30, bottom: 60, left: 50 };

  const maxY = Math.max(...data.map(d => d.y || 0));
  const xScale = (width - padding.left - padding.right) / (data.length - 1);
  const yScale = (height - padding.top - padding.bottom) / maxY;

  const points = data.map((d, i) => ({
    x: padding.left + i * xScale,
    y: height - padding.bottom - (d.y || 0) * yScale
  }));

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {title && (
          <text x={width / 2} y={25} textAnchor="middle" fontSize="16" fontWeight="bold">
            {title}
          </text>
        )}

        {/* Axes */}
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="black" strokeWidth="2" />
        <line x1={padding.left} y1={height - padding.bottom} x2={width - padding.right} y2={height - padding.bottom} stroke="black" strokeWidth="2" />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#3B82F6" strokeWidth="3" />

        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#3B82F6" />
            <text x={p.x} y={height - padding.bottom + 20} textAnchor="middle" fontSize="12">
              {data[i].x}
            </text>
          </g>
        ))}

        {/* Axis labels */}
        {yLabel && (
          <text x={15} y={height / 2} textAnchor="middle" fontSize="12" transform={`rotate(-90, 15, ${height / 2})`}>
            {yLabel}
          </text>
        )}
        {xLabel && (
          <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="12">
            {xLabel}
          </text>
        )}
      </svg>
    </div>
  );
};

const CartesianPlane = ({ points = [], xMin = -5, xMax = 5, yMin = -5, yMax = 5 }) => {
  const width = 400;
  const height = 400;
  const padding = 50;

  const xRange = xMax - xMin;
  const yRange = yMax - yMin;
  const xScale = (width - 2 * padding) / xRange;
  const yScale = (height - 2 * padding) / yRange;

  const toScreenX = (x) => padding + (x - xMin) * xScale;
  const toScreenY = (y) => height - padding - (y - yMin) * yScale;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Grid lines */}
        {Array.from({ length: xRange + 1 }, (_, i) => {
          const x = xMin + i;
          return (
            <line
              key={`vgrid${i}`}
              x1={toScreenX(x)}
              y1={padding}
              x2={toScreenX(x)}
              y2={height - padding}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}
        {Array.from({ length: yRange + 1 }, (_, i) => {
          const y = yMin + i;
          return (
            <line
              key={`hgrid${i}`}
              x1={padding}
              y1={toScreenY(y)}
              x2={width - padding}
              y2={toScreenY(y)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        <line x1={toScreenX(0)} y1={padding} x2={toScreenX(0)} y2={height - padding} stroke="black" strokeWidth="2" />
        <line x1={padding} y1={toScreenY(0)} x2={width - padding} y2={toScreenY(0)} stroke="black" strokeWidth="2" />

        {/* Axis labels */}
        {Array.from({ length: xRange + 1 }, (_, i) => {
          const x = xMin + i;
          if (x === 0) return null;
          return (
            <text key={`xlabel${i}`} x={toScreenX(x)} y={toScreenY(0) + 20} textAnchor="middle" fontSize="12">
              {x}
            </text>
          );
        })}
        {Array.from({ length: yRange + 1 }, (_, i) => {
          const y = yMin + i;
          if (y === 0) return null;
          return (
            <text key={`ylabel${i}`} x={toScreenX(0) - 15} y={toScreenY(y) + 5} textAnchor="end" fontSize="12">
              {y}
            </text>
          );
        })}

        {/* Points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={toScreenX(point.x)} cy={toScreenY(point.y)} r="5" fill="#DC2626" />
            {point.label && (
              <text
                x={toScreenX(point.x)}
                y={toScreenY(point.y) - 15}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#DC2626"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

const BoxPlot = ({ min, q1, median, q3, max }) => {
  const width = 500;
  const height = 150;
  const padding = 50;

  const range = max - min;
  const scale = (width - 2 * padding) / range;

  const toX = (val) => padding + (val - min) * scale;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Whiskers */}
        <line x1={toX(min)} y1={75} x2={toX(q1)} y2={75} stroke="black" strokeWidth="2" />
        <line x1={toX(q3)} y1={75} x2={toX(max)} y2={75} stroke="black" strokeWidth="2" />
        <line x1={toX(min)} y1={60} x2={toX(min)} y2={90} stroke="black" strokeWidth="2" />
        <line x1={toX(max)} y1={60} x2={toX(max)} y2={90} stroke="black" strokeWidth="2" />

        {/* Box */}
        <rect
          x={toX(q1)}
          y={50}
          width={toX(q3) - toX(q1)}
          height={50}
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        {/* Median line */}
        <line x1={toX(median)} y1={50} x2={toX(median)} y2={100} stroke="#DC2626" strokeWidth="3" />

        {/* Labels */}
        <text x={toX(min)} y={120} textAnchor="middle" fontSize="12">{min}</text>
        <text x={toX(q1)} y={120} textAnchor="middle" fontSize="12">Q1: {q1}</text>
        <text x={toX(median)} y={35} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">
          Median: {median}
        </text>
        <text x={toX(q3)} y={120} textAnchor="middle" fontSize="12">Q3: {q3}</text>
        <text x={toX(max)} y={120} textAnchor="middle" fontSize="12">{max}</text>
      </svg>
    </div>
  );
};

const ParallelLines = ({ line1, line2, showAngles = false }) => {
  const width = 400;
  const height = 300;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* First line */}
        <line x1={50} y1={100} x2={350} y2={100} stroke="black" strokeWidth="3" />
        
        {/* Second line */}
        <line x1={50} y1={200} x2={350} y2={200} stroke="black" strokeWidth="3" />
        
        {/* Transversal */}
        <line x1={150} y1={50} x2={250} y2={250} stroke="#3B82F6" strokeWidth="3" />

        {showAngles && (
          <>
            {/* Angle indicators */}
            <path d="M 150 100 L 180 100 A 30 30 0 0 1 165 120" fill="none" stroke="#DC2626" strokeWidth="2" />
            <text x={175} y={95} fontSize="14" fill="#DC2626">α</text>
            
            <path d="M 220 200 L 250 200 A 30 30 0 0 1 235 220" fill="none" stroke="#DC2626" strokeWidth="2" />
            <text x={245} y={195} fontSize="14" fill="#DC2626">α</text>
          </>
        )}

        <text x={width / 2} y={30} textAnchor="middle" fontSize="14" fontWeight="bold">
          Parallel Lines (transversal shown)
        </text>
      </svg>
    </div>
  );
};

const Scale = ({ min, max, marked, unit = "" }) => {
  const width = 500;
  const height = 100;
  const padding = 50;

  const range = max - min;
  const markedX = padding + ((marked - min) / range) * (width - 2 * padding);

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={height} className="border border-gray-200 rounded bg-white">
        {/* Scale line */}
        <line x1={padding} y1={50} x2={width - padding} y2={50} stroke="black" strokeWidth="3" />

        {/* Major ticks */}
        {Array.from({ length: 11 }, (_, i) => {
          const value = min + (range * i / 10);
          const x = padding + (i / 10) * (width - 2 * padding);
          return (
            <g key={i}>
              <line x1={x} y1={45} x2={x} y2={55} stroke="black" strokeWidth="2" />
              <text x={x} y={75} textAnchor="middle" fontSize="12">
                {Math.round(value)}{unit}
              </text>
            </g>
          );
        })}

        {/* Marker */}
        <polygon
          points={`${markedX},25 ${markedX - 8},35 ${markedX + 8},35`}
          fill="#DC2626"
        />
        <text x={markedX} y={20} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#DC2626">
          {marked}{unit}
        </text>
      </svg>
    </div>
  );
};

const StemLeaf = ({ data }) => {
  // data format: { stem: [leaf1, leaf2, ...] }
  const stems = Object.keys(data).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="flex justify-center my-6">
      <div className="border border-gray-200 rounded bg-white p-6">
        <h3 className="text-center font-bold mb-4">Stem-and-Leaf Plot</h3>
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border-2 border-black px-4 py-2">Stem</th>
              <th className="border-2 border-black px-4 py-2">Leaf</th>
            </tr>
          </thead>
          <tbody>
            {stems.map(stem => (
              <tr key={stem}>
                <td className="border border-black px-4 py-2 text-center font-medium">
                  {stem}
                </td>
                <td className="border border-black px-4 py-2">
                  {data[stem].sort((a, b) => a - b).join(' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-gray-600 mt-3 text-center">
          Key: 3 | 5 means 35
        </p>
      </div>
    </div>
  );
};

const Table = ({ headers, rows }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="border border-gray-200 rounded bg-white p-4">
        <table className="border-collapse">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="border-2 border-black px-4 py-2 bg-gray-100 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-black px-4 py-2 text-center">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Triangle = ({ type = "equilateral", base = 10, height = 8 }) => {
  const scale = 20; // pixels per unit
  const width = (base + 4) * scale;
  const svgHeight = (height + 4) * scale;

  const points = type === "equilateral" || type === "isosceles"
    ? `${width / 2},${20} ${20},${20 + height * scale} ${width - 20},${20 + height * scale}`
    : `${20},${20} ${20},${20 + height * scale} ${20 + base * scale},${20 + height * scale}`;

  return (
    <div className="flex justify-center my-6">
      <svg width={width} height={svgHeight} className="border border-gray-200 rounded bg-white">
        <polygon
          points={points}
          fill="white"
          stroke="black"
          strokeWidth="3"
        />
        
        {/* Base label */}
        <text
          x={width / 2}
          y={svgHeight - 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
        >
          {base}
        </text>
        
        {/* Height label (if not right triangle) */}
        {type !== "right" && (
          <text
            x={width / 2 - 30}
            y={20 + (height * scale) / 2}
            fontSize="14"
            fontWeight="bold"
          >
            h = {height}
          </text>
        )}
      </svg>
    </div>
  );
};

const CompositeShape = ({ shapes }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="border border-gray-200 rounded bg-white p-4">
        <div className="text-center text-sm text-gray-600">
          Composite shape (combined geometric shapes)
        </div>
      </div>
    </div>
  );
};

export default VisualRenderer;
