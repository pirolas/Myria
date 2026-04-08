import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="max-w-[19rem]">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2 className="mt-2 font-serif text-[1.72rem] leading-tight text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-[22rem] text-sm leading-6 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
