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
              "h-full min-h-[104px] px-4 py-4",
              isSelected
                ? "selection-card-selected"
                : "selection-card-idle"
            )}
            onClick={() => onChange(option.value)}
            aria-pressed={isSelected}
          >
            <div
              className={cn(
                "absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full border transition shadow-sm",
                isSelected
                  ? "border-accent-deep bg-accent-deep text-white"
                  : "border-line bg-white/80 text-transparent"
              )}
            >
              <Check size={14} strokeWidth={2.5} />
            </div>

            <div className="flex h-full max-w-[15rem] flex-col pr-10">
              <div
                className={cn(
                  "min-h-[2.5rem] text-sm font-semibold leading-5",
                  isSelected ? "text-accent-deep" : "text-ink"
                )}
              >
                {option.label}
              </div>
              <p
                className={cn(
                  "mt-2 flex-1 text-sm leading-6",
                  isSelected ? "text-ink/78" : "text-muted"
                )}
              >
                {option.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
