import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

// Portfolio Returns Chart Data
const portfolioReturnsData = [
  { month: 'Jan', returns: 15.2, benchmark: 12.1 },
  { month: 'Feb', returns: 18.4, benchmark: 13.8 },
  { month: 'Mar', returns: 16.8, benchmark: 14.2 },
  { month: 'Apr', returns: 19.3, benchmark: 15.1 },
  { month: 'May', returns: 17.9, benchmark: 14.7 },
  { month: 'Jun', returns: 20.1, benchmark: 16.3 },
];

// Category Distribution Data
const categoryData = [
  { name: 'Electronics', value: 35, color: '#3B82F6' },
  { name: 'Food & Beverages', value: 28, color: '#10B981' },
  { name: 'Clothing', value: 20, color: '#8B5CF6' },
  { name: 'Home & Garden', value: 12, color: '#F59E0B' },
  { name: 'Health & Beauty', value: 5, color: '#EF4444' },
];

// Risk Distribution Data
const riskData = [
  { name: 'Low Risk (A)', value: 40, color: '#10B981' },
  { name: 'Medium Risk (B)', value: 35, color: '#F59E0B' },
  { name: 'High Risk (C)', value: 20, color: '#EF4444' },
  { name: 'Very High Risk (D)', value: 5, color: '#DC2626' },
];

// Deployment Data
const deploymentData = [
  { month: 'Jan', deployed: 180000, target: 200000 },
  { month: 'Feb', deployed: 220000, target: 250000 },
  { month: 'Mar', deployed: 280000, target: 300000 },
  { month: 'Apr', deployed: 350000, target: 350000 },
  { month: 'May', deployed: 420000, target: 400000 },
  { month: 'Jun', deployed: 480000, target: 450000 },
];

export function PortfolioReturnsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={portfolioReturnsData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="returns" 
          stroke="#3B82F6" 
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          name="Portfolio Returns (%)"
        />
        <Line 
          type="monotone" 
          dataKey="benchmark" 
          stroke="#10B981" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
          name="Benchmark (%)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RiskDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={riskData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {riskData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function DeploymentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={deploymentData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="month" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
          }} 
        />
        <Bar dataKey="deployed" fill="#3B82F6" name="Deployed Capital" radius={[4, 4, 0, 0]} />
        <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
