import { useEffect, useState } from 'react';
import axios from '../../axios';
import { Card, CardContent } from '../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, comics: 0, chapters: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  const data = [
    { name: 'Users', value: stats.users },
    { name: 'Comics', value: stats.comics },
    { name: 'Chapters', value: stats.chapters },
  ];

  const COLORS = ['#34d399', '#60a5fa', '#f472b6'];

  return (
    <div className="space-y-8 animate-dashboard-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Ringkasan statistik aplikasi kamu</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[ 
          { label: 'Total Users', value: stats.users, color: 'text-green-500' },
          { label: 'Total Comics', value: stats.comics, color: 'text-blue-500' },
          { label: 'Total Chapters', value: stats.chapters, color: 'text-pink-500' },
        ].map((item, idx) => (
          <Card
            key={idx}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300"
          >
            <CardContent className="p-6 flex flex-col gap-2">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">{item.label}</h2>
              {loading ? (
                <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              ) : (
                <p className={`text-4xl font-bold ${item.color}`}>{item.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pie Chart */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Statistik Visual</h2>
          {loading ? (
            <div className="w-full h-72 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full h-72 animate-fadeIn">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderRadius: '0.5rem', border: 'none', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Distribusi Data</h2>
          {loading ? (
            <div className="w-full h-72 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full h-72 animate-fadeIn">
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">Tren Data</h2>
          {loading ? (
            <div className="w-full h-72 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="w-full h-72 animate-fadeIn">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f472b6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
