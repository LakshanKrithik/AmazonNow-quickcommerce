export default function ContextDashboard({ data }) {
  const { context, cart_prediction } = data

  return (
    <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">🧠 Context Engine</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Weather</p>
          <p className="text-white font-medium">🌧 {context.weather.condition}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Calendar</p>
          <p className="text-white font-medium">📅 {context.calendar.event}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Time</p>
          <p className="text-white font-medium">🕐 {context.time}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Intent Detected</p>
          <p className="text-orange-400 font-bold">{cart_prediction.predicted_intent}</p>
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
        <p className="text-orange-400 text-sm font-medium">AI Reasoning</p>
        <p className="text-gray-300 text-sm mt-1">{cart_prediction.reasoning}</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 bg-gray-700 rounded-full flex-1">
            <div 
              className="h-2 bg-orange-400 rounded-full"
              style={{width: `${cart_prediction.confidence * 100}%`}}
            />
          </div>
          <span className="text-orange-400 text-xs">{Math.round(cart_prediction.confidence * 100)}% confident</span>
        </div>
      </div>
    </div>
  )
}
