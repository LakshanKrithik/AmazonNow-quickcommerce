import { useState, useEffect, useRef } from "react"
import { Mic, X, ShoppingCart, Check, Plus, Clock } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"

const API_BASE = "http://localhost:8000"

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState("idle") // idle, listening, processing, done, error
  const [transcript, setTranscript] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [addedItems, setAddedItems] = useState({})
  const recognitionRef = useRef(null)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  const startListening = () => {
    setTranscript("")
    setResult(null)
    setError("")
    setAddedItems({})
    setState("listening")

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setError("Voice not supported in this browser")
      setState("error")
      return
    }

    const rec = new SR()
    rec.continuous = true
    rec.lang = "en-IN"
    rec.interimResults = true

    rec.onresult = (event) => {
      let text = ""
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }

    rec.onerror = (event) => {
      if (event.error === "not-allowed") {
        setError("Microphone access denied.")
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setError(`Mic error: ${event.error}`)
      }
      setState("error")
    }

    rec.onend = () => {}

    recognitionRef.current = rec
    rec.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    if (transcript.trim()) {
      setState("processing")
      sendToBackend(transcript)
    } else {
      setState("idle")
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
    } catch {
      setError("Network error.")
      setState("error")
    }
  }

  const addSingleItem = (product) => {
    addItem({
      name: product.name,
      price: product.price,
      delivery: product.delivery || "10 mins",
      rating: product.rating || 4.3,
      qty: product.quantity || 1
    })
    setAddedItems(prev => ({ ...prev, [product.name]: true }))
  }

  const addAllItems = () => {
    if (result?.products) {
      result.products.forEach(p => addSingleItem(p))
    }
  }

  const handleOrbClick = () => {
    if (state === "idle" || state === "error") startListening()
    else if (state === "listening") stopListening()
  }

  const closeModal = () => {
    if (recognitionRef.current && state === "listening") recognitionRef.current.abort()
    setIsOpen(false)
    setState("idle")
  }

  return (
    <>
      {/* Floating Mic Button */}
      <button
        onClick={() => { setIsOpen(true); setState("idle"); setTranscript(""); setResult(null); setError(""); setAddedItems({}); }}
        className="fixed bottom-20 right-6 z-30 w-14 h-14 bg-[#131921] hover:bg-[#232f3e] text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Mic className="w-6 h-6" />
      </button>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#111] flex">
          {/* Close */}
          <button onClick={closeModal} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-white rounded-full z-10">
            <X className="w-6 h-6" />
          </button>

          {/* Left Side - Orb & Controls */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {/* Orb */}
            <div
              onClick={handleOrbClick}
              className={`orb-container cursor-pointer mb-6 ${state === "listening" ? "active" : ""} ${state === "processing" ? "processing" : ""}`}
            >
              <div className="aura aura-1"></div>
              <div className="aura aura-2"></div>
              <div className="aura aura-3"></div>
              <div className="orb">
                {state === "done" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Check className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                )}
                {state === "processing" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <p className={`text-sm font-semibold uppercase tracking-widest mb-2 ${
              state === "listening" ? "text-[#facc15]" : state === "done" ? "text-[#4ade80]" : state === "processing" ? "text-orange-400" : "text-gray-500"
            }`}>
              {state === "idle" && "Tap to speak"}
              {state === "listening" && "Listening..."}
              {state === "processing" && "Building your cart..."}
              {state === "done" && `${result?.products?.length || 0} items found`}
              {state === "error" && "Error"}
            </p>

            <p className="text-xs text-gray-600 text-center max-w-xs">
              {state === "idle" && "Say what you need — \"snacks for a party\" or \"weekly groceries for 2\""}
              {state === "listening" && "Tap the orb or button below when you're done"}
              {state === "error" && error}
            </p>

            {/* Transcript */}
            {transcript && state !== "idle" && (
              <div className="mt-6 w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 mb-1">You said:</p>
                <p className="text-sm text-white">{transcript}</p>
              </div>
            )}

            {/* Stop button */}
            {state === "listening" && (
              <button
                onClick={stopListening}
                className="mt-6 px-8 py-3 bg-[#facc15] hover:bg-[#fbbf24] text-[#111] font-bold rounded-full text-sm"
              >
                Done speaking
              </button>
            )}
          </div>

          {/* Right Side - Suggestions */}
          {state === "done" && result?.products && (
            <div className="w-full max-w-md bg-[#1a1a1a] border-l border-white/10 overflow-y-auto flex flex-col">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1a1a1a] z-10">
                <div>
                  <h3 className="text-white font-bold">Suggested items</h3>
                  <p className="text-xs text-gray-500">{result.summary}</p>
                </div>
                <button
                  onClick={addAllItems}
                  className="px-4 py-2 bg-[#4ade80] hover:bg-[#22c55e] text-[#111] text-xs font-bold rounded-lg"
                >
                  Add all
                </button>
              </div>

              <div className="flex-1 divide-y divide-white/5">
                {result.products.map((product, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-lg opacity-30">📦</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-white">₹{product.price}</span>
                        {product.quantity > 1 && <span className="text-xs text-gray-500">×{product.quantity}</span>}
                        <span className="text-xs text-gray-600 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />{product.delivery}
                        </span>
                      </div>
                      {product.reason && <p className="text-xs text-gray-600 mt-0.5">{product.reason}</p>}
                    </div>
                    <div className="shrink-0">
                      {addedItems[product.name] ? (
                        <div className="w-8 h-8 bg-[#4ade80]/20 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#4ade80]" />
                        </div>
                      ) : (
                        <button
                          onClick={() => addSingleItem(product)}
                          className="w-8 h-8 bg-white/10 hover:bg-[#4ade80] hover:text-[#111] text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom action */}
              <div className="sticky bottom-0 bg-[#1a1a1a] border-t border-white/10 px-5 py-4">
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-[#111] font-bold rounded-xl text-sm"
                >
                  Done — view cart
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orb CSS */}
      <style>{`
        .orb-container {
          position: relative;
          width: 180px;
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 30px rgba(74, 222, 128, 0.3);
          border-radius: 50%;
          transition: box-shadow 0.5s ease;
        }
        .orb-container.active {
          box-shadow: 0 0 80px rgba(250, 204, 21, 0.6), 0 0 40px rgba(74, 222, 128, 0.4);
        }
        .orb-container.processing {
          box-shadow: 0 0 60px rgba(251, 146, 60, 0.5), 0 0 30px rgba(251, 146, 60, 0.3);
        }
        .orb {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #4ade80 20%, #14532d 60%, #064e3b 100%);
          box-shadow: inset -10px -10px 20px rgba(0,0,0,0.5), inset 10px 10px 20px rgba(255,255,255,0.4);
          transition: all 0.5s ease;
          animation: wobbleIdle 6s linear infinite;
          z-index: 10;
        }
        .orb-container.active .orb {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #facc15 30%, #4ade80 70%, #14532d 100%);
          animation: wobbleActive 2.5s linear infinite, pulseActive 1.5s infinite alternate;
        }
        .orb-container.processing .orb {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #fb923c 30%, #ea580c 70%, #431407 100%);
          animation: wobbleActive 3s linear infinite, pulseProcessing 1s infinite alternate;
        }
        .aura {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          border-radius: 50%; border: 2px solid transparent; opacity: 0; pointer-events: none;
        }
        .aura-1 { width: 130px; height: 130px; border-color: rgba(74, 222, 128, 0.3); }
        .aura-2 { width: 150px; height: 150px; border-color: rgba(250, 204, 21, 0.2); }
        .aura-3 { width: 170px; height: 170px; border-color: rgba(74, 222, 128, 0.1); }
        .orb-container.active .aura-1 { animation: ripple 2s linear infinite; }
        .orb-container.active .aura-2 { animation: ripple 2s linear infinite 0.6s; }
        .orb-container.active .aura-3 { animation: ripple 2s linear infinite 1.2s; }
        .orb-container.processing .aura-1 { animation: ripple 1.5s linear infinite; border-color: rgba(251,146,60,0.4); }
        .orb-container.processing .aura-2 { animation: ripple 1.5s linear infinite 0.5s; border-color: rgba(251,146,60,0.3); }
        .orb-container.processing .aura-3 { animation: ripple 1.5s linear infinite 1s; border-color: rgba(251,146,60,0.2); }
        @keyframes wobbleIdle {
          0% { border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%; transform: rotate(0deg); }
          50% { border-radius: 60% 40% 60% 40% / 40% 60% 40% 60%; transform: rotate(180deg); }
          100% { border-radius: 40% 60% 40% 60% / 60% 40% 60% 40%; transform: rotate(360deg); }
        }
        @keyframes wobbleActive {
          0% { border-radius: 30% 70% 30% 70% / 70% 30% 70% 30%; transform: rotate(0deg) scale(1.1); }
          25% { border-radius: 50% 50% 20% 80% / 25% 75% 50% 50%; transform: rotate(90deg) scale(1.1); }
          50% { border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%; transform: rotate(180deg) scale(1.1); }
          75% { border-radius: 50% 50% 80% 20% / 75% 25% 50% 50%; transform: rotate(270deg) scale(1.1); }
          100% { border-radius: 30% 70% 30% 70% / 70% 30% 70% 30%; transform: rotate(360deg) scale(1.1); }
        }
        @keyframes pulseActive {
          from { filter: brightness(1) drop-shadow(0 0 10px #4ade80); }
          to { filter: brightness(1.3) drop-shadow(0 0 30px #facc15); }
        }
        @keyframes pulseProcessing {
          from { filter: brightness(1) drop-shadow(0 0 10px #fb923c); }
          to { filter: brightness(1.3) drop-shadow(0 0 25px #f97316); }
        }
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  )
}
