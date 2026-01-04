import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { IoTDataInterface } from "./SFMBoxInterface";

type props = {
  iotResult: IoTDataInterface;
};

type FigDataType = {
  time: string;
  temperature: number;
};

export default function SFMBoxIoTChart({ iotResult }: props) {
  const [figData, setFigData] = useState<FigDataType[]>([]);

  useEffect(() => {
    let _data: FigDataType[] = [];
    iotResult.iotTracking.forEach((item) => {
      let figPoint = {
        time: item.time.split(" ")[1].substr(0, 5),
        temperature: Math.round(item.temperature * 100) / 100,
      };
      _data.push(figPoint);
    });
    setFigData(_data);
  }, [iotResult]);

  return (
    <BarChart
      // layout='vertical'
      width={350}
      height={400}
      data={figData}
      margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="time"
        label={{ value: "time", offset: -10, position: "insideBottom" }}
      />
      {/* <YAxis
        dataKey='temperature'
        type='number'
        //   domain={[0, 12]}
        label={{
          value: 'temperature',
          angle: -90,
          offset: 20,
          position: 'insideLeft',
        }}
      /> */}
      <Tooltip />
      <Legend verticalAlign="top" />
      <Bar dataKey="temperature" fill="#8884d8" label={{ position: "top" }}>
        {figData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={
              entry.temperature <= 3.0
                ? "#0080ff" // blue
                : entry.temperature <= 6.0
                ? "#ffbf00" // orange
                : "#ff4000" // red
            }
          />
        ))}
      </Bar>
    </BarChart>
  );
}
