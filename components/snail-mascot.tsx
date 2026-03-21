type SnailMascotProps = {
  compact?: boolean;
};

export function SnailMascot({ compact = false }: SnailMascotProps) {
  return (
    <div
      className={`relative mx-auto ${
        compact ? "h-[280px] w-[280px]" : "h-[380px] w-[380px] md:h-[460px] md:w-[460px]"
      }`}
    >
      <div className="aurora pulse-glow left-4 top-10 h-28 w-28 bg-yellow/40" />
      <div
        className="aurora right-8 top-16 h-24 w-24 bg-blue/25"
        style={{ animationDelay: "1.4s" }}
      />
      <div
        className="aurora bottom-10 left-10 h-20 w-20 bg-yellow/30"
        style={{ animationDelay: "2.2s" }}
      />

      <div className="soft-panel absolute inset-x-0 bottom-0 top-8 rounded-[2.5rem] bg-white/50" />

      <div className="snail-shell absolute left-[18%] top-[18%] h-[54%] w-[54%] rounded-full" />

      <div className="snail-body absolute bottom-[22%] right-[12%] h-[30%] w-[48%] rounded-[999px_999px_38%_38%]">
        <div className="snail-eye left-[23%]" />
        <div className="snail-eye right-[20%]" />
        <div className="absolute left-[18%] top-[38%] h-4 w-4 rounded-full bg-white/90" />
        <div className="absolute right-[21%] top-[38%] h-4 w-4 rounded-full bg-white/90" />
        <div className="absolute bottom-[24%] left-[24%] h-2 w-[38%] rounded-full bg-white/70" />
      </div>

      <div className="absolute bottom-[14%] left-[16%] h-16 w-16 rounded-full border border-blue/12 bg-white/80 backdrop-blur-xl" />
      <div className="absolute right-[18%] top-[18%] rounded-full border border-white/80 bg-white/78 px-4 py-2 text-xs font-bold text-ink/70 backdrop-blur-xl">
        Premium route
      </div>
      <div className="absolute bottom-[18%] right-[10%] rounded-full bg-yellow px-4 py-2 text-xs font-extrabold text-ink shadow-[0_18px_34px_rgba(255,216,74,0.38)]">
        小蝸寶
      </div>
    </div>
  );
}
