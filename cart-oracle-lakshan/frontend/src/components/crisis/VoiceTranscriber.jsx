// components/crisis/VoiceTranscriber.jsx - Voice/text search with AI intent (desktop web)
import { useState } from "react";
import { useCrisisStore } from "../../stores/useCrisisStore";
import { useSystemStore } from "../../stores/useSystemStore";
import { Mic, MicOff, Loader2, Search, SendHorizontal, AlertCircle } from "lucide-react";
import { useSpeechToText } from "../../hooks/useSpeechToText";

const API_BASE = "http://localhost:8000";

export default function VoiceTranscriber() {
  const triggerCrisis = useCrisisStore((state) => state.triggerCrisis);
  const isLoading = useCrisisStore((state) => state.isLoading);
  const setSearchFocused = useSystemStore((state) => state.setSearchFocused);

  const [transcript, setTranscript] = useState("");

  const processIntent = async (text) => {
    if (!text.trim()) return;

    setTranscript(text);
    useCrisisStore.setState({ isLoading: true });

    try {
      const response = await fetch(`${API_BASE}/api/intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to process intent");
      }

      triggerCrisis(data.macro_crisis, data.target_category, true);
      setSearchFocused(false);
    } catch (error) {
      console.error("Failed to route intent:", error);
      setError("AI Processing Failed. Please try again.");
      useCrisisStore.setState({ isLoading: false });
    }
  };

  const { isListening, error, toggleListening, setError } = useSpeechToText(processIntent);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processIntent(transcript);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleManualSubmit}
        className={`relative flex items-center w-full bg-white border shadow-lg rounded-full overflow-hidden transition-all duration-200 ${
          isListening ? "border-[#FF9900] ring-2 ring-[#FF9900]/20" : "border-neutral-300 focus-within:border-[#FF9900] focus-within:ring-2 focus-within:ring-[#FF9900]/10"
        }`}
      >
        <div className="pl-5 text-neutral-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={transcript}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          onChange={(e) => {
            setTranscript(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Tell us what you need — type or speak..."
          disabled={isLoading}
          className="flex-1 w-full py-4 px-4 text-base text-neutral-900 bg-transparent outline-none placeholder:text-neutral-400"
        />

        <div className="flex items-center pr-3 gap-1 text-neutral-400">
          {transcript.length > 0 && !isListening && (
            <button
              type="submit"
              disabled={isLoading}
              className="p-2.5 text-neutral-900 hover:text-[#FF9900] transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizontal className="w-5 h-5" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (error) setError(null);
              toggleListening();
            }}
            disabled={isLoading}
            className={`p-2.5 rounded-full transition-colors ${
              isListening ? "text-white bg-[#FF9900] animate-pulse" : "hover:text-neutral-900 hover:bg-neutral-100"
            }`}
          >
            {isLoading && !isListening ? <Loader2 className="w-5 h-5 animate-spin text-neutral-400" /> : (
              isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      {isListening && (
        <p className="text-xs font-bold text-[#FF9900] uppercase tracking-widest text-center mt-3 animate-pulse">
          Listening...
        </p>
      )}
    </div>
  );
}
