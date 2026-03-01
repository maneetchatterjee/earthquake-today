export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-white font-semibold mb-2">🌍 Earthquakes Today</h3>
            <p className="text-gray-400 text-sm">
              Real-time global earthquake monitoring dashboard powered by USGS data.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Data Source</h3>
            <p className="text-gray-400 text-sm">
              All data provided by the{' '}
              <a
                href="https://earthquake.usgs.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                USGS Earthquake Hazards Program
              </a>
              . Updated every 60 seconds.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Open Source</h3>
            <p className="text-gray-400 text-sm">
              <a
                href="https://github.com/maneetchatterjee/earthquake-today"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline"
              >
                View on GitHub
              </a>{' '}
              · MIT License
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-xs">
          Data from USGS GeoJSON Earthquake Feeds · Not for emergency response use
        </div>
      </div>
    </footer>
  );
}
