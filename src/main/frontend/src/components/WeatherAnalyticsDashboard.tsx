import React, {useState, useEffect} from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Info, RefreshCw, AlertTriangle} from 'lucide-react';

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
            const response = await fetch(backendUrl, {
                method: 'GET',
                mode: 'cors',
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

            const processedData = formattedData.map(item => {
                if (!item || typeof item !== "object") return null; // Skip invalid items

                // Create a normalized copy of the item
                const normalizedItem = { ...item };

                // Normalize property names - map API response fields to the expected fields
                // Handle both camelCase and UPPERCASE naming conventions
                normalizedItem.NUTS = item.nuts1 || item.NUTS || '';
                normalizedItem.DISTRICT_CODE = item.districtCode || item.DISTRICT_CODE || 0;

                // Format date fields
                normalizedItem.REF_YEAR = item.refYear || item.REF_YEAR || 0;
                normalizedItem.REF_DATE = item.refDate || item.REF_DATE || 0;

                // Process pressure values - convert to numbers
                const baseP = parseFloat(item.p || item.P || 0);
                normalizedItem.P = baseP;

                // Generate synthetic max/min if not provided
                if (!item.p_max && !item.P_MAX) {
                    const variation = baseP * 0.08; // 8% variation
                    normalizedItem.P_MAX = parseFloat((baseP + variation).toFixed(1));
                } else {
                    normalizedItem.P_MAX = parseFloat(item.p_max || item.P_MAX || 0);
                }

                if (!item.p_min && !item.P_MIN) {
                    const variation = baseP * 0.07; // 7% variation
                    normalizedItem.P_MIN = parseFloat((baseP - variation).toFixed(1));
                } else {
                    normalizedItem.P_MIN = parseFloat(item.p_min || item.P_MIN || 0);
                }

                // Format date for display
                const yearStr = normalizedItem.REF_YEAR.toString();
                const dateStr = normalizedItem.REF_DATE.toString();
                if (yearStr && dateStr && dateStr.length > 4) {
                    const month = dateStr.substring(4);
                    normalizedItem.displayDate = `${yearStr}-${month}`;
                } else {
                    normalizedItem.displayDate = "Unknown";
                }

                return normalizedItem;
            }).filter(Boolean); // Remove any null items

            setData(processedData);

            // Calculate statistics
            if (processedData.length > 0) {
                const avgP = processedData.reduce((sum, item) => sum + item.P, 0) / processedData.length;
                const maxP = Math.max(...processedData.map(item => item.P_MAX));
                const minP = Math.min(...processedData.map(item => item.P_MIN));

                setStats({
                    avgPressure: avgP.toFixed(1),
                    maxPressure: maxP.toFixed(1),
                    minPressure: minP.toFixed(1),
                    totalRecords: processedData.length
                });
            }

            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
            setLoading(false);

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

    const handleRefresh = () => {
        fetchData();
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6 flex flex-wrap justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Weather Analytics Dashboard</h1>
                    <p className="text-gray-600">Analyzing atmospheric pressure data</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Data
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800">Data Loading Error</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <p className="text-sm text-red-700 mt-1">Using sample data for display.</p>
                    </div>
                </div>
            )}

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
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="displayDate"/>
                                    <YAxis domain={['dataMin - 5', 'dataMax + 5']}/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="P" stroke="#3b82f6" name="Average Pressure" strokeWidth={2} />
                                    <Line type="monotone" dataKey="P_MAX" stroke="#10b981" name="Max Pressure (Est.)" />
                                    <Line type="monotone" dataKey="P_MIN" stroke="#ef4444" name="Min Pressure (Est.)" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pressure Range Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="displayDate"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Bar dataKey="P" fill="#3b82f6" name="Average Pressure"/>
                                    <Bar dataKey="P_MAX" fill="#10b981" name="Max Pressure (Est.)"/>
                                    <Bar dataKey="P_MIN" fill="#ef4444" name="Min Pressure (Est.)"/>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Data Details</CardTitle>
                        <div className="text-sm text-gray-500">
                            {loading ? 'Loading...' : `${data.length} records`}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
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
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 text-sm text-gray-500 flex items-center justify-between">
                <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2"/>
                    <p>Data shown in hectopascals (hPa). Backend data source: {backendUrl}</p>
                </div>
                {data.length > 0 && !error && (
                    <div className="text-xs text-gray-400">
                        Note: Max/Min values are estimated if not provided by API
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherAnalyticsDashboard;