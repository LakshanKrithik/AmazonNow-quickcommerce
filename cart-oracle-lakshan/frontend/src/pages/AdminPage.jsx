import { useState } from "react"
import { CloudRain, CheckCircle2, AlertTriangle } from "lucide-react"
import { useSystemStore } from "../stores/useSystemStore"

const API_BASE = "https://amazonnow-quickcommerce.onrender.com"

export default function AdminPage() {
  const [logs, setLogs] = useState([])
  const [status, setStatus] = useState(null)

  const triggerEvent = async (type) => {
    setStatus("Processing...")
    try {
      const res = await fetch(`${API_BASE}/api/system/trigger`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: type }),
      })

      if (res.ok) {
        const time = new Date().toLocaleTimeString()
        setLogs(prev => [`[${time}] Event "${type}" dispatched successfully`, ...prev])
        setStatus("Done")

        if (type === "WEATHER_ALERT") {
          useSystemStore.getState().triggerNudge("RAIN_CRISIS")
        }
      }
    } catch {
      setStatus("Failed")
    }
  }

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#131921] mb-1">Operations Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Simulate external events for demo purposes</p>

      {/* Trigger buttons */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-[#131921] mb-3">System Events</h2>
        <button
          onClick={() => triggerEvent("WEATHER_ALERT")}
          className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#FF9900] hover:bg-[#FFF8F0] transition-all text-left"
        >
          <CloudRain className="w-5 h-5 text-gray-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[#131921]">Trigger Weather Alert</p>
            <p className="text-xs text-gray-500">Simulates heavy rain incoming for your area</p>
          </div>
        </button>
      </div>

      {/* Status */}
      {status && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-2.5">
          {status === "Done" ? (
            <CheckCircle2 className="w-4 h-4 text-[#067D62]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-[#FF9900]" />
          )}
          <span>{status}</span>
        </div>
      )}

      {/* Logs */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#131921] mb-3">Event Log</h2>
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
          {logs.length === 0 && (
            <p className="text-sm text-gray-400">No events triggered yet</p>
          )}
          {logs.map((log, i) => (
            <p key={i} className="text-xs text-gray-600 font-mono bg-gray-50 rounded px-3 py-1.5">
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
