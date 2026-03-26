export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📡 Public API Docs</h1>
        <p className="text-gray-400 mb-8">
          Earth Monitor provides a versioned public API. All endpoints return JSON.
        </p>

        {/* Earthquakes */}
        <section className="mb-8 bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2 py-1 bg-green-700 text-green-100 text-xs font-bold rounded">GET</span>
            <code className="text-orange-300 text-sm font-mono">/api/v1/earthquakes</code>
          </div>
          <p className="text-gray-300 mb-4">Returns recent earthquake data from USGS. CORS-enabled.</p>

          <h3 className="text-white font-semibold mb-2">Parameters</h3>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2 pr-4">Name</th>
                <th className="text-left py-2 pr-4">Type</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-gray-700/50">
                <td className="py-2 pr-4 font-mono">period</td>
                <td className="py-2 pr-4">string</td>
                <td className="py-2">
                  Time window: <code className="text-orange-300">hour</code>,{' '}
                  <code className="text-orange-300">day</code>,{' '}
                  <code className="text-orange-300">week</code>,{' '}
                  <code className="text-orange-300">month</code> (default: <code className="text-orange-300">day</code>)
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-white font-semibold mb-2">Rate Limiting</h3>
          <p className="text-gray-300 text-sm mb-4">100 requests per hour per IP.</p>

          <h3 className="text-white font-semibold mb-2">Example Response</h3>
          <pre className="bg-gray-900 rounded-lg p-4 text-green-300 text-xs overflow-x-auto">
{`{
  "type": "FeatureCollection",
  "metadata": { "count": 123 },
  "features": [
    {
      "type": "Feature",
      "id": "us7000abc1",
      "properties": {
        "mag": 4.2,
        "place": "15km NE of Example City",
        "time": 1700000000000,
        "tsunami": 0,
        "type": "earthquake"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-120.5, 37.2, 10.0]
      }
    }
  ]
}`}
          </pre>

          <h3 className="text-white font-semibold mt-4 mb-2">Example Request</h3>
          <pre className="bg-gray-900 rounded-lg p-4 text-blue-300 text-xs overflow-x-auto">
            {`curl "https://yoursite.com/api/v1/earthquakes?period=day"`}
          </pre>
        </section>

        {/* Disclaimer */}
        <p className="text-gray-500 text-sm">
          ⚠️ Data provided as-is from upstream sources. Not for emergency use.
        </p>
      </div>
    </div>
  );
}
