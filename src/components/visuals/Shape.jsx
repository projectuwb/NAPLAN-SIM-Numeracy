// Shape component for symmetry and geometry questions

function Shape({ shapeType = 'rectangle', symmetryLines = [], width = 300, height = 300 }) {
  const centerX = width / 2;
  const centerY = height / 2;

  // Define shape paths
  const shapes = {
    rectangle: {
      path: `M ${centerX - 80} ${centerY - 60} L ${centerX + 80} ${centerY - 60} L ${centerX + 80} ${centerY + 60} L ${centerX - 80} ${centerY + 60} Z`,
      name: 'Rectangle'
    },
    square: {
      path: `M ${centerX - 70} ${centerY - 70} L ${centerX + 70} ${centerY - 70} L ${centerX + 70} ${centerY + 70} L ${centerX - 70} ${centerY + 70} Z`,
      name: 'Square'
    },
    triangle: {
      path: `M ${centerX} ${centerY - 80} L ${centerX + 80} ${centerY + 60} L ${centerX - 80} ${centerY + 60} Z`,
      name: 'Triangle'
    },
    circle: {
      path: null, // Special case - use circle element
      radius: 80,
      name: 'Circle'
    },
    pentagon: {
      path: generateRegularPolygon(centerX, centerY, 5, 80),
      name: 'Pentagon'
    },
    hexagon: {
      path: generateRegularPolygon(centerX, centerY, 6, 80),
      name: 'Hexagon'
    },
    star: {
      path: generateStar(centerX, centerY, 5, 80, 35),
      name: 'Star'
    },
    heart: {
      path: `M ${centerX} ${centerY + 50}
             C ${centerX - 40} ${centerY + 20}, ${centerX - 60} ${centerY - 20}, ${centerX - 40} ${centerY - 50}
             C ${centerX - 30} ${centerY - 70}, ${centerX - 10} ${centerY - 70}, ${centerX} ${centerY - 55}
             C ${centerX + 10} ${centerY - 70}, ${centerX + 30} ${centerY - 70}, ${centerX + 40} ${centerY - 50}
             C ${centerX + 60} ${centerY - 20}, ${centerX + 40} ${centerY + 20}, ${centerX} ${centerY + 50} Z`,
      name: 'Heart'
    }
  };

  const currentShape = shapes[shapeType] || shapes.rectangle;

  // Generate symmetry line coordinates
  const getSymmetryLine = (type) => {
    switch (type) {
      case 'vertical':
        return { x1: centerX, y1: 30, x2: centerX, y2: height - 30 };
      case 'horizontal':
        return { x1: 30, y1: centerY, x2: width - 30, y2: centerY };
      case 'diagonal1': // top-left to bottom-right
        return { x1: 50, y1: 50, x2: width - 50, y2: height - 50 };
      case 'diagonal2': // top-right to bottom-left
        return { x1: width - 50, y1: 50, x2: 50, y2: height - 50 };
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center my-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Shape */}
        {currentShape.path ? (
          <path
            d={currentShape.path}
            fill="#87CEEB"
            stroke="#000"
            strokeWidth="2"
          />
        ) : (
          <circle
            cx={centerX}
            cy={centerY}
            r={currentShape.radius}
            fill="#87CEEB"
            stroke="#000"
            strokeWidth="2"
          />
        )}

        {/* Symmetry lines */}
        {symmetryLines.map((lineType, idx) => {
          const line = getSymmetryLine(lineType);
          if (!line) return null;
          return (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#FF0000"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        })}

        {/* Shape label */}
        <text
          x={centerX}
          y={height - 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Arial"
        >
          {currentShape.name}
        </text>
      </svg>
    </div>
  );
}

// Helper function to generate regular polygon path
function generateRegularPolygon(centerX, centerY, sides, radius) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M ${points.join(' L ')} Z`;
}

// Helper function to generate star path
function generateStar(centerX, centerY, points, outerRadius, innerRadius) {
  const path = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  path.push('Z');
  return path.join(' ');
}

export default Shape;
