import { useState } from "react"

export default function NudgeNotification({ nudge }) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="bg-gray-800 border border-orange-500/50 rounded-2xl p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-xl">🛒</div>
        <div>
          <p className="text-white text-sm font-medium">{nudge.title}</p>
          <p className="text-gray-400 text-xs">{nudge.body}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1 bg-orange-500 rounded-lg text-xs text-white font-medium"
        >
          View
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="px-3 py-1 bg-gray-700 rounded-lg text-xs text-gray-400"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
