import { useState, useEffect, useRef, useCallback } from "react"
import { Mic, X, Check, Plus, Phone, PhoneOff, ShoppingCart } from "lucide-react"
import { RetellWebClient } from "retell-client-js-sdk"
import { useCartStore } from "../stores/useCartStore"
import { useNavigate } from "react-router-dom"
import { API_BASE } from "../config"

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, setState] = useState("idle")
  const [transcriptLines, setTranscriptLines] = useState([])
  const [liveProducts, setLiveProducts] = useState([])
  const [cartBuilding, setCartBuilding] = useState(false)
  const [error, setError] = useState("")
  const [addedItems, setAddedItems] = useState({})
  const retellRef = useRef(null)
  const lastProcessedRef = useRef("")
  const processTimeoutRef = useRef(null)
  const addItem = useCartStore(s => s.addItem)
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (retellRef.current) try { retellRef.current.stopCall() } catch {}
      if (processTimeoutRef.current) clearTimeout(processTimeoutRef.current)
    }
  }, [])

  const processTranscriptLive = useCallback(async (userText) => {
    if (!userText.trim() || userText === lastProcessedRef.current) return
    lastProcessedRef.current = userText
    setCartBuilding(true)
    try {
      const res = await fetch(`${API_BASE}/api/voice-cart`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: userText })
      })
      const data = await res.json()
      if (data.success && data.products) setLiveProducts(data.products)
    } catch (err) { console.error("[LIVE CART]", err) }
    finally { setCartBuilding(false) }
  }, [])

  const startCall = async () => {
    setState("connecting")
    setTranscriptLines([]); setLiveProducts([]); setError(""); setAddedItems({})
    lastProcessedRef.current = ""
    try {
      const res = await fetch(`${API_BASE}/api/retell/create-call`, { method: "POST" })
      const data = await res.json()
      if (!data.success || !data.access_token) throw new Error(data.error || "Failed to create call")

      const retellClient = new RetellWebClient()
      retellRef.current = retellClient
      retellClient.on("call_started", () => setState("active"))
      retellClient.on("call_ended", () => setState("done"))
      retellClient.on("update", (update) => {
        if (update.transcript && update.transcript.length > 0) {
          setTranscriptLines(update.transcript)
          const userText = update.transcript.filter(t => t.role === "user").map(t => t.content).join(". ")
          if (userText.trim() && userText !== lastProcessedRef.current) {
            if (processTimeoutRef.current) clearTimeout(processTimeoutRef.current)
            processTimeoutRef.current = setTimeout(() => processTranscriptLive(userText), 2000)
          }
        }
      })
      retellClient.on("error", (err) => { console.error("[RETELL]", err); setError("Call error."); setState("error") })
      await retellClient.startCall({ accessToken: data.access_token })
    } catch (err) { console.error("[RETELL]", err); setError(err.message || "Failed"); setState("error") }
  }

  const endCall = () => {
    if (retellRef.current) retellRef.current.stopCall()
    const userText = transcriptLines.filter(t => t.role === "user").map(t => t.content).join(". ")
    if (userText.trim()) { setCartBuilding(true); processTranscriptLive(userText) }
    setState("done")
  }

  const removeLiveProduct = (index) => setLiveProducts(prev => prev.filter((_, i) => i !== index))
  const updateLiveQty = (index, delta) => {
    setLiveProducts(prev => prev.map((p, i) => i === index ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p))
  }

  const addSingleItem = (product) => {
    addItem({ name: product.name, price: product.price, delivery: product.delivery || "10 mins", rating: 4.3, qty: product.quantity || 1 })
    setAddedItems(prev => ({ ...prev, [product.name]: true }))
  }
  const addAllItems = () => { liveProducts.forEach(p => { if (!addedItems[p.name]) addSingleItem(p) }) }

  const closeModal = () => {
    if (retellRef.current) try { retellRef.current.stopCall() } catch {}
    if (processTimeoutRef.current) clearTimeout(processTimeoutRef.current)
    setIsOpen(false); setState("idle")
  }

  const handleOrbClick = () => {
    if (state === "idle" || state === "error") startCall()
    else if (state === "active") endCall()
  }

  const recentLines = transcriptLines.slice(-5)

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(true); setState("idle"); setTranscriptLines([]); setLiveProducts([]); setError(""); setAddedItems({}) }}
        className="fixed bottom-20 right-5 z-30 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1f3625] to-[#0a0b0a] border border-white/10 shadow-lg flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:border-white/20 group-active:scale-95">
          <Mic className="w-5 h-5 text-[#d4b886]" />
        </div>
      </button>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex voice-modal-bg">
          <button onClick={closeModal} className="absolute top-5 right-5 p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl z-10 transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>

          {/* Left - Orb + Transcript */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
            {/* Orb */}
            <div
              onClick={handleOrbClick}
              className={`orb-wrapper cursor-pointer mb-6 ${state === "active" ? "active" : ""} ${state === "connecting" ? "active" : ""}`}
            >
              <div className="ripple ripple-1"></div>
              <div className="ripple ripple-2"></div>
              <div className="ripple ripple-3"></div>
              <div className="orb-glass">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                {/* Overlay icons */}
                {state === "done" && <div className="absolute inset-0 flex items-center justify-center z-20"><Check className="w-8 h-8 text-white/90 drop-shadow-lg" /></div>}
                {state === "connecting" && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                {state === "active" && <div className="absolute inset-0 flex items-center justify-center z-20"><Phone className="w-6 h-6 text-white/80 drop-shadow" /></div>}
              </div>
            </div>

            {/* Status */}
            <p className={`voice-status-text ${state === "active" || state === "connecting" ? "active" : ""}`}>
              {state === "idle" && "Ready"}
              {state === "connecting" && "Connecting"}
              {state === "active" && "Listening"}
              {state === "done" && "Complete"}
              {state === "error" && "Error"}
            </p>

            {/* Subtitle-style transcript */}
            {(state === "active" || state === "done") && recentLines.length > 0 && (
              <div className="w-full max-w-md space-y-2 mt-4">
                {recentLines.map((line, i) => (
                  <div key={i} className={`flex ${line.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm backdrop-blur-sm ${
                      line.role === "user"
                        ? "bg-white/10 text-white/90 rounded-br-sm border border-white/5"
                        : "bg-white/5 text-white/60 rounded-bl-sm border border-white/5"
                    }`}>
                      {line.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {state === "idle" && (
              <p className="text-sm text-white/30 text-center max-w-xs mt-4">
                Tap the orb to start a conversation
              </p>
            )}
            {state === "error" && <p className="text-sm text-red-400/80 text-center mt-4">{error}</p>}

            {/* Action buttons */}
            <div className="mt-6 flex flex-col items-center gap-3">
              {state === "idle" && (
                <button onClick={startCall} className="voice-btn">
                  <Phone className="w-4 h-4" /> Start call
                </button>
              )}
              {state === "active" && (
                <button onClick={endCall} className="voice-btn voice-btn-end">
                  <PhoneOff className="w-4 h-4" /> End call
                </button>
              )}
              {state === "error" && (
                <button onClick={() => { setState("idle"); setError("") }} className="voice-btn">Try again</button>
              )}
              {state === "done" && liveProducts.length === 0 && (
                <button onClick={closeModal} className="voice-btn">Close</button>
              )}
            </div>
          </div>

          {/* Right - Live Cart */}
          {(state === "active" || state === "done") && (
            <div className="w-full max-w-sm bg-[#0f100f] border-l border-white/5 overflow-y-auto flex flex-col">
              <div className="px-5 py-4 border-b border-white/5 sticky top-0 bg-[#0f100f] z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-[#d4b886]" />
                    <h3 className="text-sm font-medium text-white/80">Live Cart</h3>
                  </div>
                  {liveProducts.length > 0 && state === "done" && (
                    <span className="text-xs text-white/40">{liveProducts.length} items</span>
                  )}
                </div>
                {cartBuilding && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 border border-[#d4b886] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[11px] text-white/40">Updating...</span>
                  </div>
                )}
              </div>

              {liveProducts.length === 0 && !cartBuilding && (
                <div className="flex-1 flex items-center justify-center p-6">
                  <p className="text-sm text-white/20 text-center">Items appear here as you talk</p>
                </div>
              )}

              <div className="flex-1 divide-y divide-white/5">
                {liveProducts.map((product, i) => (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                      <span className="text-[10px] font-medium text-[#d4b886]">{product.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-white/80 truncate">{product.name}</p>
                      <span className="text-[13px] font-semibold text-white/60">₹{product.price * (product.quantity || 1)}</span>
                    </div>
                    {state === "done" ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                          <button onClick={() => updateLiveQty(i, -1)} className="px-2 py-1 hover:bg-white/5 text-white/50 text-xs font-bold">−</button>
                          <span className="px-2 py-1 text-xs font-medium text-white/70 border-x border-white/10 min-w-[24px] text-center">{product.quantity || 1}</span>
                          <button onClick={() => updateLiveQty(i, 1)} className="px-2 py-1 hover:bg-white/5 text-white/50 text-xs font-bold">+</button>
                        </div>
                        <button onClick={() => removeLiveProduct(i)} className="p-1 text-white/20 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : addedItems[product.name] ? (
                      <Check className="w-4 h-4 text-[#6b8e73] shrink-0" />
                    ) : (
                      <button onClick={() => addSingleItem(product)} className="w-7 h-7 border border-white/10 text-white/50 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-white transition-all shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {liveProducts.length > 0 && (
                <div className="sticky bottom-0 bg-[#0f100f] border-t border-white/5 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40">{liveProducts.reduce((s, p) => s + (p.quantity || 1), 0)} items</span>
                    <span className="text-base font-semibold text-white/80">₹{liveProducts.reduce((s, p) => s + (p.price * (p.quantity || 1)), 0)}</span>
                  </div>
                  {state === "done" ? (
                    <button onClick={() => { addAllItems(); closeModal(); navigate("/checkout") }} className="w-full py-3 bg-[#d4b886] hover:bg-[#c5a972] text-[#0a0b0a] font-semibold rounded-xl text-sm transition-colors">
                      Proceed to Checkout
                    </button>
                  ) : (
                    <button onClick={addAllItems} className="w-full py-3 bg-white/10 hover:bg-white/15 text-white/80 font-medium rounded-xl text-sm transition-colors border border-white/5">
                      Add all to cart
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .voice-modal-bg {
          background-color: #0a0b0a;
          background-image: radial-gradient(circle at 50% 50%, rgba(31, 54, 37, 0.15) 0%, transparent 60%);
        }
        .voice-status-text {
          font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); font-weight: 400; transition: all 0.4s ease;
        }
        .voice-status-text.active {
          color: rgba(255,255,255,0.85); text-shadow: 0 0 10px rgba(255,255,255,0.15);
          animation: textBreathe 2s ease-in-out infinite alternate;
        }
        .voice-btn {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.05); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);
          font-size: 0.875rem; font-weight: 400; letter-spacing: 0.03em;
          padding: 0.75rem 2rem; border-radius: 9999px; transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .voice-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #fff; }
        .voice-btn-end { border-color: rgba(239,68,68,0.3); color: rgba(239,68,68,0.8); }
        .voice-btn-end:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.5); color: #ef4444; }

        .orb-wrapper {
          position: relative; width: 220px; height: 220px;
          display: flex; justify-content: center; align-items: center;
          border-radius: 50%; transition: all 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 0 0 transparent;
        }
        .orb-wrapper.active {
          box-shadow: 0 0 80px rgba(107, 142, 115, 0.25), 0 0 120px rgba(212, 184, 134, 0.1);
          transform: scale(1.05);
        }
        .orb-glass {
          position: absolute; width: 160px; height: 160px;
          border-radius: 60% 40% 50% 50% / 50% 50% 50% 50%;
          overflow: hidden; background: rgba(255,255,255,0.02);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 0 20px rgba(255,255,255,0.05), inset 0 4px 12px rgba(255,255,255,0.15),
            inset -4px -4px 15px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          animation: morphGlass 8s ease-in-out infinite alternate, spinGlass 12s linear infinite;
          z-index: 10; display: flex; justify-content: center; align-items: center;
          transition: all 0.8s ease;
        }
        .orb-wrapper.active .orb-glass {
          animation: morphGlassActive 4s ease-in-out infinite alternate, spinGlass 6s linear infinite;
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: inset 0 0 30px rgba(212,184,134,0.15), inset 0 4px 12px rgba(255,255,255,0.25), inset -4px -4px 15px rgba(0,0,0,0.4);
        }
        .blob {
          position: absolute; filter: blur(25px); opacity: 0.8;
          mix-blend-mode: screen; border-radius: 50%;
          animation: moveBlob 10s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
          transition: all 0.8s ease;
        }
        .blob-1 { width: 120px; height: 120px; background: #6b8e73; top: -15px; left: -15px; animation-delay: 0s; }
        .blob-2 { width: 100px; height: 100px; background: #d4b886; bottom: -8px; right: -15px; animation-delay: -3s; }
        .blob-3 { width: 110px; height: 110px; background: #1f3625; top: 40px; left: 25px; mix-blend-mode: normal; opacity: 0.9; animation-delay: -6s; }
        .orb-wrapper.active .blob-1 { background: #8bb395; transform: scale(1.2); opacity: 1; }
        .orb-wrapper.active .blob-2 { background: #e8cd9c; transform: scale(1.1); opacity: 1; }
        .orb-wrapper.active .blob-3 { background: #9c6b54; transform: scale(1.3); opacity: 0.7; }
        .ripple {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
          width: 160px; height: 160px; opacity: 0; pointer-events: none;
        }
        .orb-wrapper.active .ripple-1 { animation: expandRipple 2.5s cubic-bezier(0.2, 0, 0.2, 1) infinite; }
        .orb-wrapper.active .ripple-2 { animation: expandRipple 2.5s cubic-bezier(0.2, 0, 0.2, 1) infinite 0.8s; }
        .orb-wrapper.active .ripple-3 { animation: expandRipple 2.5s cubic-bezier(0.2, 0, 0.2, 1) infinite 1.6s; }

        @keyframes morphGlass {
          0% { border-radius: 60% 40% 50% 50% / 50% 50% 50% 50%; }
          33% { border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%; }
          66% { border-radius: 40% 60% 60% 40% / 50% 60% 40% 50%; }
          100% { border-radius: 50% 50% 50% 50% / 40% 50% 60% 40%; }
        }
        @keyframes morphGlassActive {
          0% { border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%; }
          25% { border-radius: 40% 60% 60% 40% / 50% 60% 40% 50%; }
          50% { border-radius: 60% 40% 30% 70% / 50% 50% 60% 40%; }
          75% { border-radius: 40% 60% 50% 50% / 40% 60% 40% 60%; }
          100% { border-radius: 50% 50% 40% 60% / 60% 40% 50% 50%; }
        }
        @keyframes spinGlass { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes moveBlob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(15px,-15px) scale(1.1); }
          66% { transform: translate(-8px,15px) scale(0.9); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes expandRipple {
          0% { width: 160px; height: 160px; opacity: 0; }
          10% { opacity: 0.8; }
          100% { width: 320px; height: 320px; opacity: 0; }
        }
        @keyframes textBreathe { from { opacity: 0.6; } to { opacity: 1; } }
      `}</style>
    </>
  )
}
