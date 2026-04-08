import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PreferenceOption } from "@/types/domain";

interface ChoiceGridProps<TValue extends string | number | boolean> {
  options: PreferenceOption<TValue>[];
  value: TValue;
  onChange: (value: TValue) => void;
  columns?: "one" | "two";
}

export function ChoiceGrid<TValue extends string | number | boolean>({
  options,
  value,
  onChange,
  columns = "one"
}: ChoiceGridProps<TValue>) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === "two" ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={String(option.value)}
            type="button"
            className={cn(
              "surface relative text-left transition duration-200",
              "min-h-[104px] px-4 py-4",
              isSelected
                ? "border-[rgba(94,184,178,0.5)] bg-white"
                : "hover:border-accent/30 hover:bg-white/80"
            )}
            onClick={() => onChange(option.value)}
          >
            <div
              className={cn(
                "absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border transition",
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white/80 text-transparent"
              )}
            >
              <Check size={14} strokeWidth={2.5} />
            </div>

            <div className="max-w-[15rem] pr-10">
              <div className="text-sm font-semibold text-ink">{option.label}</div>
              <p className="mt-2 text-sm leading-6 text-muted">{option.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
