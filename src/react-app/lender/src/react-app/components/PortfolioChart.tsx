import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface PortfolioChartProps {
  data: Array<{
    name: string;
    value: number;
    returns?: number;
  }>;
  height?: number;
  className?: string;
}

export default function PortfolioChart({ data, height = 300, className }: PortfolioChartProps) {
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
            name="Portfolio Value"
          />
          {data.some(item => item.returns !== undefined) && (
            <Line 
              type="monotone" 
              dataKey="returns" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Returns"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
