import { useState, useEffect, useRef } from "react"
import { Mic, X, ShoppingCart, Check, Plus, Clock } from "lucide-react"
import { useCartStore } from "../stores/useCartStore"

const API_BASE = "http://localhost:8000"

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState("idle")
  const [transcript, setTranscript] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")
  const [addedItems, setAddedItems] = useState({})
  const recognitionRef = useRef(null)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    return () => { if (recognitionRef.current) try { recognitionRef.current.abort() } catch {} }
  }, [])

  const startListening = () => {
    setTranscript("")
    setResult(null)
    setError("")
    setAddedItems({})
    setState("listening")

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { setError("Voice not supported"); setState("error"); return }

    const rec = new SR()
    rec.continuous = true
    rec.lang = "en-IN"
    rec.interimResults = true
    rec.onresult = (event) => {
      let text = ""
      for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript
      setTranscript(text)
    }
    rec.onerror = (event) => {
      if (event.error === "not-allowed") setError("Microphone access denied.")
      else if (event.error !== "aborted" && event.error !== "no-speech") setError(`Mic error: ${event.error}`)
      setState("error")
    }
    rec.onend = () => {}
    recognitionRef.current = rec
    rec.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    if (transcript.trim()) { setState("processing"); sendToBackend(transcript) }
    else setState("idle")
  }

  const sendToBackend = async (text) => {
    try {
      const res = await fetch(`${API_BASE}/api/voice-cart`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text })
      })
      const data = await res.json()
      if (data.success && data.products) { setResult(data); setState("done") }
      else { setError(data.error || "Failed"); setState("error") }
    } catch { setError("Network error."); setState("error") }
  }

  const addSingleItem = (product) => {
    addItem({ name: product.name, price: product.price, delivery: product.delivery || "10 mins", rating: product.rating || 4.3, qty: product.quantity || 1 })
    setAddedItems(prev => ({ ...prev, [product.name]: true }))
  }

<<<<<<< HEAD
  const addAllItems = () => {
    if (result?.products) {
      result.products.forEach(p => {
        if (!addedItems[p.name]) {
          addSingleItem(p);
        }
      });
    }
  }
=======
  const addAllItems = () => { result?.products?.forEach(p => addSingleItem(p)) }
>>>>>>> e52bd25 (improvements made)

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
        onClick={() => { setIsOpen(true); setState("idle"); setTranscript(""); setResult(null); setError(""); setAddedItems({}) }}
        className="fixed bottom-20 right-5 z-30 w-14 h-14 bg-[var(--green)] hover:bg-[#0a6e1a] text-white rounded-2xl shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <Mic className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex bg-white/95 backdrop-blur-xl">
          {/* Close */}
          <button onClick={closeModal} className="absolute top-5 right-5 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl z-10 transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Left - Orb */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div
              onClick={handleOrbClick}
              className={`orb-container cursor-pointer mb-8 ${state === "listening" ? "active" : ""} ${state === "processing" ? "processing" : ""}`}
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
            <h2 className={`text-base font-semibold mb-1 ${
              state === "listening" ? "text-[var(--green)]" : state === "done" ? "text-[var(--green)]" : state === "processing" ? "text-amber-600" : "text-[var(--dark)]"
            }`}>
              {state === "idle" && "Tap to speak"}
              {state === "listening" && "Listening..."}
              {state === "processing" && "Building your cart..."}
              {state === "done" && `${result?.products?.length || 0} items found`}
              {state === "error" && "Something went wrong"}
            </h2>

            <p className="text-sm text-gray-500 text-center max-w-xs">
              {state === "idle" && "Say what you need — \"snacks for a party\" or \"weekly groceries\""}
              {state === "listening" && "Tap the orb when you're done speaking"}
              {state === "processing" && "Finding the best products for you"}
              {state === "error" && error}
            </p>

            {/* Transcript */}
            {transcript && state !== "idle" && (
              <div className="mt-6 w-full max-w-sm bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">You said</p>
                <p className="text-sm text-[var(--dark)] font-medium">{transcript}</p>
              </div>
            )}

            {/* Actions */}
            {state === "listening" && (
              <button onClick={stopListening} className="mt-6 px-8 py-3 bg-[var(--green)] hover:bg-[#0a6e1a] text-white font-semibold rounded-xl text-sm transition-colors">
                Done speaking
              </button>
            )}
            {state === "error" && (
              <button onClick={() => { setState("idle"); setError("") }} className="mt-6 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-[var(--dark)] font-semibold rounded-xl text-sm transition-colors">
                Try again
              </button>
            )}
          </div>

          {/* Right - Suggestions */}
          {state === "done" && result?.products && (
            <div className="w-full max-w-md bg-white border-l border-gray-200 overflow-y-auto flex flex-col shadow-xl">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-base font-bold text-[var(--dark)]">Suggestions</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{result.summary}</p>
                </div>
                <button onClick={addAllItems} className="px-4 py-2 bg-[var(--green)] hover:bg-[#0a6e1a] text-white text-xs font-semibold rounded-lg transition-colors">
                  Add all
                </button>
              </div>

              <div className="flex-1 divide-y divide-gray-50">
                {result.products.map((product, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--green-light)] rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[var(--green)]">{product.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--dark)] truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-bold text-[var(--dark)]">₹{product.price}</span>
                        {product.quantity > 1 && <span className="text-xs text-gray-400">×{product.quantity}</span>}
                      </div>
                    </div>
                    {addedItems[product.name] ? (
                      <span className="text-[11px] font-semibold text-[var(--green)] bg-[var(--green-light)] px-2.5 py-1.5 rounded-lg">Added</span>
                    ) : (
                      <button onClick={() => addSingleItem(product)} className="px-3 py-1.5 border border-[var(--green)] text-[var(--green)] text-xs font-semibold rounded-lg hover:bg-[var(--green)] hover:text-white transition-all">
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
                <button onClick={closeModal} className="w-full py-3 bg-[var(--green)] hover:bg-[#0a6e1a] text-white font-semibold rounded-xl text-sm transition-colors">
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orb Styles */}
      <style>{`
        .orb-container {
          position: relative; width: 180px; height: 180px;
          display: flex; justify-content: center; align-items: center;
          box-shadow: 0 0 40px rgba(12, 131, 31, 0.15);
          border-radius: 50%; transition: box-shadow 0.5s ease;
        }
        .orb-container.active {
          box-shadow: 0 0 80px rgba(12, 131, 31, 0.35), 0 0 40px rgba(12, 131, 31, 0.2);
        }
        .orb-container.processing {
          box-shadow: 0 0 60px rgba(217, 119, 6, 0.3), 0 0 30px rgba(217, 119, 6, 0.2);
        }
        .orb {
          position: relative; width: 110px; height: 110px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #4ade80 20%, #14532d 60%, #064e3b 100%);
          box-shadow: inset -8px -8px 16px rgba(0,0,0,0.4), inset 8px 8px 16px rgba(255,255,255,0.3);
          transition: all 0.5s ease; animation: wobbleIdle 6s linear infinite; z-index: 10;
        }
        .orb-container.active .orb {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #22c55e 25%, #0c831f 60%, #064e3b 100%);
          animation: wobbleActive 2.5s linear infinite, pulseActive 1.5s infinite alternate;
        }
        .orb-container.processing .orb {
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #fbbf24 30%, #d97706 70%, #451a03 100%);
          animation: wobbleActive 3s linear infinite, pulseProc 1s infinite alternate;
        }
        .aura { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; border: 2px solid transparent; opacity: 0; pointer-events: none; }
        .aura-1 { width: 130px; height: 130px; border-color: rgba(12, 131, 31, 0.25); }
        .aura-2 { width: 150px; height: 150px; border-color: rgba(12, 131, 31, 0.15); }
        .aura-3 { width: 170px; height: 170px; border-color: rgba(12, 131, 31, 0.08); }
        .orb-container.active .aura-1 { animation: ripple 2s linear infinite; }
        .orb-container.active .aura-2 { animation: ripple 2s linear infinite 0.6s; }
        .orb-container.active .aura-3 { animation: ripple 2s linear infinite 1.2s; }
        .orb-container.processing .aura-1 { animation: ripple 1.5s linear infinite; border-color: rgba(217,119,6,0.3); }
        .orb-container.processing .aura-2 { animation: ripple 1.5s linear infinite 0.5s; border-color: rgba(217,119,6,0.2); }
        .orb-container.processing .aura-3 { animation: ripple 1.5s linear infinite 1s; border-color: rgba(217,119,6,0.15); }
        @keyframes wobbleIdle {
          0% { border-radius: 42% 58% 42% 58% / 58% 42% 58% 42%; transform: rotate(0deg); }
          50% { border-radius: 58% 42% 58% 42% / 42% 58% 42% 58%; transform: rotate(180deg); }
          100% { border-radius: 42% 58% 42% 58% / 58% 42% 58% 42%; transform: rotate(360deg); }
        }
        @keyframes wobbleActive {
          0% { border-radius: 30% 70% 30% 70% / 70% 30% 70% 30%; transform: rotate(0deg) scale(1.1); }
          25% { border-radius: 50% 50% 20% 80% / 25% 75% 50% 50%; transform: rotate(90deg) scale(1.1); }
          50% { border-radius: 70% 30% 70% 30% / 30% 70% 30% 70%; transform: rotate(180deg) scale(1.1); }
          75% { border-radius: 50% 50% 80% 20% / 75% 25% 50% 50%; transform: rotate(270deg) scale(1.1); }
          100% { border-radius: 30% 70% 30% 70% / 70% 30% 70% 30%; transform: rotate(360deg) scale(1.1); }
        }
        @keyframes pulseActive {
          from { filter: brightness(1) drop-shadow(0 0 8px rgba(12,131,31,0.4)); }
          to { filter: brightness(1.2) drop-shadow(0 0 25px rgba(12,131,31,0.6)); }
        }
        @keyframes pulseProc {
          from { filter: brightness(1) drop-shadow(0 0 8px rgba(217,119,6,0.3)); }
          to { filter: brightness(1.2) drop-shadow(0 0 20px rgba(217,119,6,0.5)); }
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
