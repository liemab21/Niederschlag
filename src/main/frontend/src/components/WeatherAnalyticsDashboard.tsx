import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, RefreshCw, AlertTriangle } from 'lucide-react';

const WeatherAnalyticsDashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [backendUrl, setBackendUrl] = useState('http://localhost:8080');
    const [stats, setStats] = useState({
        avgPressure: 0,
        maxPressure: 0,
        minPressure: 0,
        totalRecords: 0
    });

    // Sample data to use if connection fails
    const sampleData = [
        {
            "NUTS": "AT13",
            "DISTRICT_CODE": 91900,
            "REF_YEAR": 1872,
            "REF_DATE": 187205,
            "P": "990.9",
            "P_MAX": "1003.2",
            "P_MIN": "981.2"
        }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Try fetching with no-cors mode first (this helps with some CORS issues)
            const response = await fetch(backendUrl, {
                method: 'GET',
                mode: 'cors', // Try with regular cors first
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                throw new Error("Backend returned invalid JSON. Check data format.");
            }

            // Handle both array and single object responses
            const formattedData = Array.isArray(result) ? result : [result];

            if (formattedData.length === 0) {
                throw new Error("No data returned from backend");
            }

            // Process data
            formattedData.forEach(item => {
                // Convert string values to numbers
                item.P = parseFloat(item.P);
                item.P_MAX = parseFloat(item.P_MAX);
                item.P_MIN = parseFloat(item.P_MIN);

                // Format date for display
                const yearStr = item.REF_YEAR.toString();
                const dateStr = item.REF_DATE.toString();
                const month = dateStr.substring(4);
                item.displayDate = `${yearStr}-${month}`;
            });

            setData(formattedData);

            // Calculate statistics
            if (formattedData.length > 0) {
                const avgP = formattedData.reduce((sum, item) => sum + item.P, 0) / formattedData.length;
                const maxP = Math.max(...formattedData.map(item => item.P_MAX));
                const minP = Math.min(...formattedData.map(item => item.P_MIN));

                setStats({
                    avgPressure: avgP.toFixed(1),
                    maxPressure: maxP.toFixed(1),
                    minPressure: minP.toFixed(1),
                    totalRecords: formattedData.length
                });
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
            setLoading(false);

            // Alert the user with more specific troubleshooting info
            console.warn("Using sample data for display purposes");

            // Process sample data as fallback
            const formattedSampleData = sampleData.map(item => ({
                ...item,
                P: parseFloat(item.P),
                P_MAX: parseFloat(item.P_MAX),
                P_MIN: parseFloat(item.P_MIN),
                displayDate: `${item.REF_YEAR}-${item.REF_DATE.toString().substring(4)}`
            }));

            setData(formattedSampleData);

            // Calculate statistics from sample data
            const avgP = formattedSampleData.reduce((sum, item) => sum + item.P, 0) / formattedSampleData.length;
            const maxP = Math.max(...formattedSampleData.map(item => item.P_MAX));
            const minP = Math.min(...formattedSampleData.map(item => item.P_MIN));

            setStats({
                avgPressure: avgP.toFixed(1),
                maxPressure: maxP.toFixed(1),
                minPressure: minP.toFixed(1),
                totalRecords: formattedSampleData.length
            });
        }
    };

    const handleBackendUrlChange = (e) => {
        setBackendUrl(e.target.value);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Weather Analytics Dashboard</h1>
                <p className="text-gray-600">Analyzing atmospheric pressure data</p>


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Average Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgPressure} hPa</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Maximum Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.maxPressure} hPa</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Minimum Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.minPressure} hPa</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRecords}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pressure Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="displayDate" />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="P" stroke="#3b82f6" name="Average Pressure" />
                                <Line type="monotone" dataKey="P_MAX" stroke="#10b981" name="Max Pressure" />
                                <Line type="monotone" dataKey="P_MIN" stroke="#ef4444" name="Min Pressure" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pressure Range Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="displayDate" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="P" fill="#3b82f6" name="Average Pressure" />
                                <Bar dataKey="P_MAX" fill="#10b981" name="Max Pressure" />
                                <Bar dataKey="P_MIN" fill="#ef4444" name="Min Pressure" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2">District</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Region</th>
                                    <th className="px-4 py-2">Avg Pressure</th>
                                    <th className="px-4 py-2">Max Pressure</th>
                                    <th className="px-4 py-2">Min Pressure</th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{item.DISTRICT_CODE}</td>
                                        <td className="px-4 py-2">{item.displayDate}</td>
                                        <td className="px-4 py-2">{item.NUTS}</td>
                                        <td className="px-4 py-2">{item.P} hPa</td>
                                        <td className="px-4 py-2">{item.P_MAX} hPa</td>
                                        <td className="px-4 py-2">{item.P_MIN} hPa</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 text-sm text-gray-500 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                <p>Data shown in hectopascals (hPa). Backend data source: {backendUrl}</p>
            </div>
        </div>
    );
};

export default WeatherAnalyticsDashboard;