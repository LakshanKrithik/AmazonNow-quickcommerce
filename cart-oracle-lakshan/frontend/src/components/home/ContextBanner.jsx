import { CloudRain, Plane, Users, Thermometer } from "lucide-react"

export default function ContextBanner({ context }) {
  const weather = context.context?.weather
  const calendar = context.context?.calendar
  if (!weather && !calendar) return null

  let message = ""
  let sub = ""
  let Icon = Thermometer
  let accent = "border-gray-200 bg-white"

  if (weather?.is_rainy) {
    message = "Rain expected today"
    sub = "Umbrellas, raincoats & warm food suggestions added"
    Icon = CloudRain
    accent = "border-blue-200 bg-blue-50/50"
  } else if (calendar?.intent === "TRAVEL") {
    message = calendar.title
    sub = `${calendar.time} — Travel essentials in your suggestions`
    Icon = Plane
    accent = "border-purple-200 bg-purple-50/50"
  } else if (calendar?.intent === "HOST_GUESTS") {
    message = "Hosting guests tonight"
    sub = "Party snacks, drinks & supplies in your suggestions"
    Icon = Users
    accent = "border-orange-200 bg-orange-50/50"
  } else {
    message = `${weather?.condition}, ${weather?.temp}°C`
    sub = `${weather?.city} — suggestions based on today's weather`
    accent = "border-gray-200 bg-white"
  }

  return (
    <div className={`${accent} border rounded-2xl px-4 py-3.5 mb-4 flex items-center gap-3`}>
      <Icon className="w-5 h-5 text-gray-600 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-[var(--dark)]">{message}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}
