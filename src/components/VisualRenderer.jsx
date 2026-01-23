// Main visual renderer component that routes to specific visual types

import NumberLine from './visuals/NumberLine';
import AnalogClock from './visuals/AnalogClock';
import FractionCircle from './visuals/FractionCircle';
import BarGraph from './visuals/BarGraph';
import CoordinateGrid from './visuals/CoordinateGrid';
import Shape from './visuals/Shape';
import Pictograph from './visuals/Pictograph';

function VisualRenderer({ visual }) {
  if (!visual || !visual.type) return null;

  const { type, data } = visual;

  switch (type) {
    case 'numberLine':
      return <NumberLine {...data} />;

    case 'clock':
      return <AnalogClock {...data} />;

    case 'fractionCircle':
      return <FractionCircle {...data} />;

    case 'barGraph':
      return <BarGraph {...data} />;

    case 'grid':
      return <CoordinateGrid {...data} />;

    case 'shape':
      return <Shape {...data} />;

    case 'pictograph':
      return <Pictograph {...data} />;

    default:
      console.warn('Unknown visual type:', type);
      return null;
  }
}

export default VisualRenderer;
