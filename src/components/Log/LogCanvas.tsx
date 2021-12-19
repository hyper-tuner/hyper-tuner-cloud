import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Logs } from '@speedy-tuner/types';
import { Grid } from 'antd';
import TimeChart from 'timechart';
import { EventsPlugin } from 'timechart/dist/lib/plugins_extra/events';
import { colorHsl } from '../../utils/number';
import LandscapeNotice from '../Dialog/LandscapeNotice';
import CanvasHelp from '../CanvasHelp';

const { useBreakpoint } = Grid;

export interface SelectedField {
  name: string;
  label: string;
  units: string;
  scale: string | number;
  transform: string | number;
  format: string;
};

interface Props {
  data: Logs;
  width: number;
  height: number;
  selectedFields: SelectedField[];
};

export interface PlottableField {
  min: number;
  max: number;
  scale: number;
  transform: number;
  units: string;
  format: string;
};

const LogCanvas = ({ data, width, height, selectedFields }: Props) => {
  const { sm } = useBreakpoint();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const hsl = useCallback((fieldIndex: number, allFields: number) => {
    const [hue] = colorHsl(0, allFields - 1, fieldIndex);
    return `hsl(${hue}, 90%, 50%)`;
  }, []);

  const fieldsToPlot = useMemo(() => {
    const temp: { [index: string]: PlottableField } = {};

    data.forEach((entry) => {
      selectedFields.forEach(({ label, scale, transform, units, format }) => {
        const value = entry[label];

        if (!temp[label]) {
          temp[label] = {
            min: 0,
            max: 0,
            scale: (scale || 1) as number,
            transform: (transform || 0) as number,
            units: units || '',
            format: format || '',
          };
        }

        if (value > temp[label].max) {
          temp[label].max = entry[label] as number;
        }

        if (value < temp[label].min) {
          temp[label].min = entry[label] as number;
        }
      });
    });

    return temp;
  }, [data, selectedFields]);

  useEffect(() => {
    const markers: { x: number, name: string }[] = [];
    const series = Object.keys(fieldsToPlot).map((label, index) => {
      const field = fieldsToPlot[label];

      return {
        name: field.units ? `${label} (${field.units})` : label,
        color: hsl(index, selectedFields.length),
        data: data.map((entry, entryIndex) => {
          let value = entry[label];

          if (value !== undefined) {
            value = (value as number * field.scale) + field.transform;
          }

          if (entry.type === 'marker') {
            const previousEntry = data[entryIndex - 1];
            if (previousEntry && previousEntry.Time !== undefined) {
              markers.push({
                x: previousEntry.Time as number,
                name: '',
              });
            }
          }

          return {
            x: entry.Time,
            y: value,
          } as { x: number, y: number };
        }).filter((entry) => entry.x !== undefined && entry.y !== undefined),
      };
    });
    let chart: TimeChart;

    if (canvasRef.current && sm) {
      chart = new TimeChart(canvasRef.current, {
        series,
        lineWidth: 2,
        tooltip: true,
        legend: false,
        zoom: {
          x: { autoRange: true },
        },
        tooltipXLabel: 'Time (s)',
        plugins: {
          events: new EventsPlugin(markers),
        },
      });
    }

    return () => chart && chart.dispose();
  }, [data, fieldsToPlot, hsl, selectedFields, width, height, sm]);

  if (!sm) {
    return <LandscapeNotice />;
  }

  return (
    <>
      <CanvasHelp />
      <div
        ref={canvasRef}
        style={{ width, height }}
        className="log-canvas"
      />
    </>
  );
};

export default LogCanvas;
