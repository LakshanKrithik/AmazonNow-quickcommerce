// components/showdown/AlternativeFlag.jsx - Out-of-stock alternative banner (from Project B)
import { Sparkles } from "lucide-react";

export default function AlternativeFlag({ message }) {
  return (
    <div className="w-full flex items-center gap-2 px-3 py-2 bg-amber-500 text-neutral-950 rounded-xl mb-3 border border-amber-400 shadow-sm">
      <Sparkles className="w-4 h-4 fill-neutral-950 shrink-0" />
      <span className="text-[11px] font-bold uppercase tracking-wider leading-none">
        {message}
      </span>
    </div>
  );
}
