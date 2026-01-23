// FractionCircle SVG component for showing fractions visually

function FractionCircle({ numerator, denominator }) {
  const size = 200;
  const center = size / 2;
  const radius = 80;

  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = angleInDegrees * Math.PI / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  // Generate slices
  const slices = [];
  for (let i = 0; i < denominator; i++) {
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

    slices.push({
      path: pathData,
      isShaded
    });
  }

  return (
    <div className="flex flex-col items-center my-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Draw slices */}
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            fill={slice.isShaded ? '#4CAF50' : 'white'}
            stroke="#000"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="text-xl font-bold mt-2">
        {numerator}/{denominator}
      </div>
    </div>
  );
}

export default FractionCircle;
