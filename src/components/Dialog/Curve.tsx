import {
  Typography,
  Grid,
} from 'antd';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { Colors } from '../../utils/colors';
import LandscapeNotice from './LandscapeNotice';
import Table from './Table';

const { useBreakpoint } = Grid;

const Curve = ({
  name,
  xLabel,
  yLabel,
  xData,
  yData,
  disabled,
  help,
  xMin,
  xMax,
  yMin,
  yMax,
  xUnits = '',
  yUnits = '',
}: {
  name: string,
  xLabel: string,
  yLabel: string,
  xData: number[],
  yData: number[],
  disabled: boolean,
  help: string,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  xUnits?: string,
  yUnits?: string,
}) => {
  const mapData = (rawData: number[][]) => rawData[1].map((val, i) => ({
    x: val,
    y: rawData[0][i],
  }));
  const [data, setData] = useState(mapData([yData, xData]));
  const { sm } = useBreakpoint();
  const margin = 15;
  const animationDuration = 500;

  if (!sm) {
    return <LandscapeNotice />;
  }

  return (
    <>
      <Typography.Paragraph>
        <Typography.Text type="secondary">{help}</Typography.Text>
      </Typography.Paragraph>
      <ResponsiveContainer height={450}>
        <LineChart
          data={data}
          margin={{
            top: margin,
            right: margin,
            left: margin,
            bottom: margin + 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            strokeOpacity={0.1}
          />
          <XAxis dataKey="x">
            <Label
              value={`${xLabel} (${xUnits})`}
              position="bottom"
              style={{ fill: Colors.TEXT }}
            />
          </XAxis>
          <YAxis domain={['auto', 'auto']}>
            <Label
              value={`${yLabel} (${yUnits})`}
              position="left"
              angle={-90}
              style={{ fill: Colors.TEXT }}
            />
          </YAxis>
          <Tooltip
            labelFormatter={(value) => `${xLabel} : ${value} ${xUnits}`}
            formatter={(value: number) => [`${value} ${yUnits}`, yLabel]}
            contentStyle={{
              backgroundColor: Colors.MAIN,
              border: 0,
              boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
              borderRadius: 5,
            }}
            animationDuration={animationDuration}
          />
          <Line
            strokeWidth={3}
            type="linear"
            dataKey="y"
            stroke={Colors.ACCENT}
            animationDuration={animationDuration}
          />
        </LineChart>
      </ResponsiveContainer>
      <Table
        name={name}
        key={name}
        xLabel={xLabel}
        yLabel={yLabel}
        xData={xData}
        yData={yData}
        disabled={disabled}
        xMin={xMin}
        xMax={xMax}
        yMin={yMin}
        yMax={yMax}
        xUnits={xUnits}
        yUnits={yUnits}
        onChange={(newData: number[][]) => setData(mapData(newData))}
      />
    </>
  );
};

export default Curve;
