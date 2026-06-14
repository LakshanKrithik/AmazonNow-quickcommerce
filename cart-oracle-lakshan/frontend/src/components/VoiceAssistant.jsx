import { useState, useEffect, useRef } from "react"
import { Mic, X, ShoppingCart, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"

const API_BASE = "http://localhost:8000"

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState("idle") // idle, listening, processing, done, error
  const [transcript, setTranscript] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const recognitionRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SR) {
      const rec = new SR()
      rec.continuous = false
      rec.lang = "en-IN"
      rec.interimResults = true

      rec.onresult = (event) => {
        let text = ""
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript
        }
        setTranscript(text)
      }

      rec.onend = () => {
        // Only process if we have text and were listening
        if (state === "listening") {
          setState("processing")
        }
      }

      rec.onerror = (event) => {
        if (event.error === "not-allowed") {
          setError("Microphone access denied. Please allow microphone access.")
        } else if (event.error !== "aborted") {
          setError(`Microphone error: ${event.error}`)
        }
        setState("error")
      }

      recognitionRef.current = rec
    }
  }, [])

  // When state transitions to processing, send to backend
  useEffect(() => {
    if (state === "processing" && transcript.trim()) {
      sendToBackend(transcript)
    }
  }, [state])

  const startListening = () => {
    setTranscript("")
    setResult(null)
    setError("")
    setState("listening")

    if (recognitionRef.current) {
      recognitionRef.current.start()
    } else {
      setError("Voice recognition not supported in this browser")
      setState("error")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const sendToBackend = async (text) => {
    try {
      const res = await fetch(`${API_BASE}/api/voice-cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text })
      })
      const data = await res.json()

      if (data.success && data.products) {
        setResult(data)
        setState("done")
      } else {
        setError(data.error || "Failed to generate cart")
        setState("error")
      }
    } catch (err) {
      setError("Network error. Make sure backend is running.")
      setState("error")
    }
  }

  const addToCartAndClose = () => {
    // Store products in sessionStorage for CartPage to pick up
    if (result?.products) {
      sessionStorage.setItem("voiceCartItems", JSON.stringify(result.products))
    }
    setIsOpen(false)
    setState("idle")
    navigate("/cart")
  }

  const openModal = () => {
    setIsOpen(true)
    setState("idle")
    setTranscript("")
    setResult(null)
    setError("")
  }

  const closeModal = () => {
    if (recognitionRef.current && state === "listening") {
      recognitionRef.current.abort()
    }
    setIsOpen(false)
    setState("idle")
  }

  return (
    <>
      {/* Floating Mic Button */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#131921] hover:bg-[#232f3e] text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Voice Shopping Assistant"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-8 pt-10 pb-8 flex flex-col items-center">
              {/* Orb */}
              <div className="mb-6 relative">
                <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${
                  state === "listening"
                    ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-110"
                    : state === "processing"
                    ? "bg-[#FF9900] shadow-[0_0_40px_rgba(255,153,0,0.4)] animate-pulse"
                    : state === "done"
                    ? "bg-[#067D62] shadow-[0_0_40px_rgba(6,125,98,0.3)]"
                    : "bg-[#131921] shadow-lg"
                }`}>
                  {state === "done" ? (
                    <Check className="w-10 h-10 text-white" />
                  ) : state === "processing" ? (
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    <Mic className={`w-10 h-10 text-white ${state === "listening" ? "animate-pulse" : ""}`} />
                  )}
                </div>

                {/* Rings animation when listening */}
                {state === "listening" && (
                  <>
                    <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30" />
                    <div className="absolute -inset-3 rounded-full border border-red-300 animate-ping opacity-20" style={{ animationDelay: "300ms" }} />
                  </>
                )}
              </div>

              {/* Status Text */}
              <h2 className="text-lg font-bold text-[#131921] mb-1">
                {state === "idle" && "Voice Shopping"}
                {state === "listening" && "Listening..."}
                {state === "processing" && "Finding products..."}
                {state === "done" && "Cart ready!"}
                {state === "error" && "Something went wrong"}
              </h2>

              <p className="text-sm text-gray-500 text-center mb-6">
                {state === "idle" && "Tap the button and tell us what you need"}
                {state === "listening" && "Speak naturally — say what you want to buy"}
                {state === "processing" && "Claude is building your cart"}
                {state === "done" && result && `${result.products.length} products added`}
                {state === "error" && error}
              </p>

              {/* Transcript */}
              {transcript && (state === "listening" || state === "processing" || state === "done") && (
                <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6">
                  <p className="text-xs text-gray-400 font-medium mb-1">You said:</p>
                  <p className="text-sm text-[#131921] font-medium">{transcript}</p>
                </div>
              )}

              {/* Result summary */}
              {state === "done" && result && (
                <div className="w-full bg-[#F0FDF4] border border-[#86EFAC] rounded-xl px-4 py-3 mb-6">
                  <p className="text-sm text-[#131921] font-medium">{result.summary}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <ShoppingCart className="w-4 h-4 text-[#067D62]" />
                    <span className="text-sm font-bold text-[#067D62]">
                      {result.products.length} items • ₹{result.products.reduce((s, p) => s + (p.price * (p.quantity || 1)), 0)} total
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="w-full">
                {state === "idle" && (
                  <button
                    onClick={startListening}
                    className="w-full py-4 bg-[#131921] hover:bg-[#232f3e] text-white font-bold rounded-xl transition-colors"
                  >
                    Start speaking
                  </button>
                )}

                {state === "listening" && (
                  <button
                    onClick={stopListening}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                  >
                    Stop recording
                  </button>
                )}

                {state === "done" && (
                  <button
                    onClick={addToCartAndClose}
                    className="w-full py-4 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-bold rounded-xl transition-colors"
                  >
                    Add all to cart
                  </button>
                )}

                {state === "error" && (
                  <button
                    onClick={() => { setState("idle"); setError(""); }}
                    className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-[#131921] font-bold rounded-xl transition-colors"
                  >
                    Try again
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
