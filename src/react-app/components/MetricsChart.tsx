import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MetricsChartProps {
  data: Array<{
    name: string;
    value: number;
    target?: number;
  }>;
  height?: number;
  className?: string;
}

export default function MetricsChart({ data, height = 300, className }: MetricsChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Actual"
          />
          {data.some(item => item.target !== undefined) && (
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
