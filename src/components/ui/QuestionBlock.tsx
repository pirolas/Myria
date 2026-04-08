import type { ReactNode } from "react";

interface QuestionBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function QuestionBlock({ title, description, children }: QuestionBlockProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="text-sm font-semibold text-ink">{title}</div>
        {description ? (
          <p className="max-w-[22rem] text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
