import { CloudRain, Plane, Users, Sun, Thermometer } from "lucide-react"

export default function ContextBanner({ context }) {
  const weather = context.context?.weather
  const calendar = context.context?.calendar

  if (!weather && !calendar) return null

  let message = ""
  let sub = ""
  let icon = null
  let bgColor = "bg-[#FFF8E1]"
  let borderColor = "border-[#FFE082]"

  if (weather?.is_rainy) {
    message = "Rainy weather outside"
    sub = "Stay prepared with umbrellas, raincoats & comfort food"
    icon = <CloudRain className="w-6 h-6 text-[#1565C0]" />
    bgColor = "bg-[#E3F2FD]"
    borderColor = "border-[#90CAF9]"
  } else if (calendar?.intent === "TRAVEL") {
    message = `${calendar.title}`
    sub = `${calendar.time} — Travel essentials recommended`
    icon = <Plane className="w-6 h-6 text-[#6A1B9A]" />
    bgColor = "bg-[#F3E5F5]"
    borderColor = "border-[#CE93D8]"
  } else if (calendar?.intent === "HOST_GUESTS") {
    message = "Friends visiting tonight?"
    sub = "Snacks, drinks and party supplies added to suggestions"
    icon = <Users className="w-6 h-6 text-[#E65100]" />
    bgColor = "bg-[#FFF3E0]"
    borderColor = "border-[#FFCC80]"
  } else {
    message = `${weather?.condition}, ${weather?.temp}°C`
    sub = `Feels like ${weather?.feels_like}°C in ${weather?.city}`
    icon = <Thermometer className="w-6 h-6 text-[#F57C00]" />
  }

  return (
    <div className={`${bgColor} border ${borderColor} rounded-2xl px-5 py-4 mb-6 flex items-center gap-4`}>
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#131921]">{message}</p>
        <p className="text-sm text-gray-600">{sub}</p>
      </div>
    </div>
  )
}
