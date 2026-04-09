import type { ReactNode } from "react";
import { exerciseGuidance } from "@/data/exerciseGuidance";

type PoseId =
  | "standing"
  | "squat"
  | "wall"
  | "wallSit"
  | "standingSideLift"
  | "lunge"
  | "calfRaise"
  | "supine"
  | "bridge"
  | "heelSlide"
  | "deadBug"
  | "bridgeMarch"
  | "sideLying"
  | "sideLift"
  | "quadruped"
  | "birdDog"
  | "breathing"
  | "pelvicTilt"
  | "wallArms"
  | "wallChestOpen";

interface VisualConfig {
  startPose: PoseId;
  endPose: PoseId;
  focus: string;
}

const visualConfigs: Record<string, VisualConfig> = {
  "ponte-glutei": {
    startPose: "supine",
    endPose: "bridge",
    focus: "Glutei e bacino"
  },
  "squat-alla-sedia": {
    startPose: "standing",
    endPose: "squat",
    focus: "Gambe e glutei"
  },
  "wall-sit": {
    startPose: "wall",
    endPose: "wallSit",
    focus: "Cosce e glutei"
  },
  "slanci-laterali-in-piedi": {
    startPose: "standing",
    endPose: "standingSideLift",
    focus: "Lato del gluteo"
  },
  "affondo-assistito-indietro": {
    startPose: "standing",
    endPose: "lunge",
    focus: "Gamba davanti e glutei"
  },
  "bird-dog": {
    startPose: "quadruped",
    endPose: "birdDog",
    focus: "Core, schiena e glutei"
  },
  "heel-slides": {
    startPose: "supine",
    endPose: "heelSlide",
    focus: "Addome profondo"
  },
  "dead-bug-semplificato": {
    startPose: "supine",
    endPose: "deadBug",
    focus: "Core e stabilità"
  },
  "ponte-con-marcia": {
    startPose: "bridge",
    endPose: "bridgeMarch",
    focus: "Bacino stabile"
  },
  "sollevamenti-polpacci": {
    startPose: "standing",
    endPose: "calfRaise",
    focus: "Polpacci e caviglie"
  },
  "side-leg-lifts": {
    startPose: "sideLying",
    endPose: "sideLift",
    focus: "Lato del gluteo"
  },
  "respirazione-addominale-profonda": {
    startPose: "supine",
    endPose: "breathing",
    focus: "Respiro e centro del corpo"
  },
  "mobilita-bacino-colonna": {
    startPose: "supine",
    endPose: "pelvicTilt",
    focus: "Bacino e zona lombare"
  },
  "scapole-al-muro": {
    startPose: "wall",
    endPose: "wallArms",
    focus: "Schiena alta e postura"
  },
  "allungamento-petto-parete": {
    startPose: "wall",
    endPose: "wallChestOpen",
    focus: "Petto e spalle"
  }
};

interface ExerciseFigureProps {
  exerciseId: string;
}

export function ExerciseFigure({ exerciseId }: ExerciseFigureProps) {
  const config = visualConfigs[exerciseId];
  const guidance = exerciseGuidance[exerciseId];

  if (!config) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-line bg-[rgba(255,255,255,0.84)] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Visual rapido
          </div>
          <div className="mt-1 text-sm font-semibold text-ink">{config.focus}</div>
        </div>
        <div className="rounded-full bg-accent-soft px-3 py-2 text-xs font-semibold text-accent-deep">
          Partenza e movimento
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <FigurePanel
          phase="Partenza"
          caption={guidance?.visual.startLabel ?? "Posizione iniziale"}
          pose={config.startPose}
        />
        <FigurePanel
          phase="Movimento"
          caption={guidance?.visual.moveLabel ?? "Gesto principale"}
          pose={config.endPose}
        />
      </div>
    </div>
  );
}

function FigurePanel({
  phase,
  caption,
  pose
}: {
  phase: string;
  caption: string;
  pose: PoseId;
}) {
  return (
    <div className="rounded-[20px] bg-[rgba(244,249,248,0.95)] px-3 py-3">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
        {phase}
      </div>
      <div className="mt-3 overflow-hidden rounded-[18px] bg-white">
        <svg viewBox="0 0 140 156" className="h-auto w-full">
          <rect x="0" y="0" width="140" height="156" fill="rgba(240,249,248,1)" />
          {renderPose(pose)}
        </svg>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">{caption}</p>
    </div>
  );
}

function renderPose(pose: PoseId) {
  switch (pose) {
    case "standing":
      return <StandingPose />;
    case "squat":
      return <SquatPose />;
    case "wall":
      return <WallPose />;
    case "wallSit":
      return <WallSitPose />;
    case "standingSideLift":
      return <StandingSideLiftPose />;
    case "lunge":
      return <LungePose />;
    case "calfRaise":
      return <CalfRaisePose />;
    case "supine":
      return <SupinePose />;
    case "bridge":
      return <BridgePose />;
    case "heelSlide":
      return <HeelSlidePose />;
    case "deadBug":
      return <DeadBugPose />;
    case "bridgeMarch":
      return <BridgeMarchPose />;
    case "sideLying":
      return <SideLyingPose />;
    case "sideLift":
      return <SideLiftPose />;
    case "quadruped":
      return <QuadrupedPose />;
    case "birdDog":
      return <BirdDogPose />;
    case "breathing":
      return <BreathingPose />;
    case "pelvicTilt":
      return <PelvicTiltPose />;
    case "wallArms":
      return <WallArmsPose />;
    case "wallChestOpen":
      return <WallChestOpenPose />;
    default:
      return null;
  }
}

function FigureStroke({ children }: { children: ReactNode }) {
  return (
    <g
      fill="none"
      stroke="rgba(39, 63, 69, 0.92)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4.5}
    >
      {children}
    </g>
  );
}

function Head({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r="10" fill="rgba(255,255,255,0.92)" stroke="rgba(39, 63, 69, 0.92)" strokeWidth="4" />;
}

function FloorLine() {
  return <line x1="16" y1="134" x2="124" y2="134" stroke="rgba(197,219,216,0.95)" strokeWidth="4" strokeLinecap="round" />;
}

function WallLine() {
  return <line x1="34" y1="24" x2="34" y2="134" stroke="rgba(197,219,216,0.95)" strokeWidth="5" strokeLinecap="round" />;
}

function Arrow({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="rgba(64, 154, 149, 0.88)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="5 5"
    />
  );
}

function StandingPose() {
  return (
    <>
      <FloorLine />
      <Head x={72} y={34} />
      <FigureStroke>
        <line x1="72" y1="44" x2="72" y2="86" />
        <line x1="52" y1="58" x2="92" y2="58" />
        <line x1="58" y1="58" x2="54" y2="90" />
        <line x1="86" y1="58" x2="90" y2="90" />
        <line x1="72" y1="86" x2="60" y2="124" />
        <line x1="72" y1="86" x2="84" y2="124" />
      </FigureStroke>
    </>
  );
}

function SquatPose() {
  return (
    <>
      <FloorLine />
      <rect x="98" y="74" width="14" height="42" rx="4" fill="rgba(224,237,235,0.95)" />
      <rect x="90" y="112" width="30" height="8" rx="4" fill="rgba(224,237,235,0.95)" />
      <Head x={70} y={38} />
      <FigureStroke>
        <line x1="70" y1="48" x2="74" y2="82" />
        <line x1="52" y1="60" x2="92" y2="60" />
        <line x1="56" y1="60" x2="50" y2="90" />
        <line x1="88" y1="60" x2="94" y2="90" />
        <line x1="74" y1="82" x2="60" y2="108" />
        <line x1="74" y1="82" x2="90" y2="108" />
        <line x1="60" y1="108" x2="56" y2="126" />
        <line x1="90" y1="108" x2="94" y2="126" />
      </FigureStroke>
      <Arrow d="M 110 70 C 120 84 120 102 108 116 l -6 -6 m 6 6 l 7 -4" />
    </>
  );
}

function WallPose() {
  return (
    <>
      <FloorLine />
      <WallLine />
      <Head x={54} y={34} />
      <FigureStroke>
        <line x1="54" y1="44" x2="54" y2="84" />
        <line x1="38" y1="58" x2="70" y2="58" />
        <line x1="42" y1="58" x2="40" y2="90" />
        <line x1="68" y1="58" x2="70" y2="90" />
        <line x1="54" y1="84" x2="52" y2="124" />
        <line x1="54" y1="84" x2="74" y2="124" />
      </FigureStroke>
    </>
  );
}

function WallSitPose() {
  return (
    <>
      <FloorLine />
      <WallLine />
      <Head x={54} y={46} />
      <FigureStroke>
        <line x1="54" y1="56" x2="54" y2="86" />
        <line x1="40" y1="68" x2="68" y2="68" />
        <line x1="44" y1="68" x2="42" y2="98" />
        <line x1="66" y1="68" x2="68" y2="98" />
        <line x1="54" y1="86" x2="82" y2="86" />
        <line x1="82" y1="86" x2="82" y2="124" />
        <line x1="54" y1="86" x2="54" y2="124" />
      </FigureStroke>
      <Arrow d="M 92 56 C 102 74 102 90 94 110 l -6 -4 m 6 4 l 6 -2" />
    </>
  );
}

function StandingSideLiftPose() {
  return (
    <>
      <FloorLine />
      <Head x={62} y={34} />
      <FigureStroke>
        <line x1="62" y1="44" x2="62" y2="86" />
        <line x1="44" y1="58" x2="80" y2="58" />
        <line x1="48" y1="58" x2="44" y2="90" />
        <line x1="76" y1="58" x2="80" y2="90" />
        <line x1="62" y1="86" x2="56" y2="124" />
        <line x1="62" y1="86" x2="92" y2="96" />
      </FigureStroke>
      <Arrow d="M 82 90 C 94 84 102 76 108 68 l -8 1 m 8 -1 l -3 7" />
    </>
  );
}

function LungePose() {
  return (
    <>
      <FloorLine />
      <Head x={68} y={34} />
      <FigureStroke>
        <line x1="68" y1="44" x2="70" y2="84" />
        <line x1="50" y1="58" x2="88" y2="58" />
        <line x1="54" y1="58" x2="48" y2="92" />
        <line x1="84" y1="58" x2="90" y2="92" />
        <line x1="70" y1="84" x2="62" y2="124" />
        <line x1="70" y1="84" x2="102" y2="112" />
        <line x1="102" y1="112" x2="112" y2="124" />
      </FigureStroke>
      <Arrow d="M 102 62 C 112 74 116 86 116 98 l -6 -4 m 6 4 l 4 -7" />
    </>
  );
}

function CalfRaisePose() {
  return (
    <>
      <FloorLine />
      <Head x={72} y={30} />
      <FigureStroke>
        <line x1="72" y1="40" x2="72" y2="82" />
        <line x1="52" y1="54" x2="92" y2="54" />
        <line x1="58" y1="54" x2="54" y2="86" />
        <line x1="86" y1="54" x2="90" y2="86" />
        <line x1="72" y1="82" x2="60" y2="122" />
        <line x1="72" y1="82" x2="84" y2="122" />
      </FigureStroke>
      <Arrow d="M 98 114 C 104 102 104 92 98 80 l -2 7 m 2 -7 l 5 5" />
    </>
  );
}

function SupinePose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={110} />
      <FigureStroke>
        <line x1="38" y1="110" x2="82" y2="110" />
        <line x1="46" y1="110" x2="40" y2="126" />
        <line x1="58" y1="110" x2="54" y2="128" />
        <line x1="82" y1="110" x2="102" y2="98" />
        <line x1="102" y1="98" x2="116" y2="122" />
        <line x1="82" y1="110" x2="96" y2="110" />
        <line x1="96" y1="110" x2="114" y2="124" />
      </FigureStroke>
    </>
  );
}

function BridgePose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={112} />
      <FigureStroke>
        <line x1="38" y1="112" x2="74" y2="90" />
        <line x1="44" y1="108" x2="38" y2="126" />
        <line x1="54" y1="100" x2="50" y2="118" />
        <line x1="74" y1="90" x2="96" y2="92" />
        <line x1="96" y1="92" x2="114" y2="124" />
        <line x1="74" y1="90" x2="90" y2="92" />
        <line x1="90" y1="92" x2="108" y2="122" />
      </FigureStroke>
      <Arrow d="M 72 118 C 76 106 78 98 78 84 l -4 6 m 4 -6 l 4 6" />
    </>
  );
}

function HeelSlidePose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={112} />
      <FigureStroke>
        <line x1="38" y1="112" x2="82" y2="110" />
        <line x1="46" y1="112" x2="40" y2="126" />
        <line x1="58" y1="112" x2="54" y2="128" />
        <line x1="82" y1="110" x2="104" y2="108" />
        <line x1="104" y1="108" x2="122" y2="122" />
        <line x1="82" y1="110" x2="118" y2="110" />
      </FigureStroke>
      <Arrow d="M 94 128 C 104 132 112 132 122 126 l -7 -2 m 7 2 l -5 5" />
    </>
  );
}

function DeadBugPose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={112} />
      <FigureStroke>
        <line x1="38" y1="112" x2="82" y2="108" />
        <line x1="46" y1="110" x2="66" y2="86" />
        <line x1="58" y1="110" x2="54" y2="128" />
        <line x1="82" y1="108" x2="98" y2="84" />
        <line x1="82" y1="108" x2="112" y2="122" />
      </FigureStroke>
      <Arrow d="M 102 74 C 112 78 118 86 122 98 l -7 -3 m 7 3 l -1 -7" />
    </>
  );
}

function BridgeMarchPose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={112} />
      <FigureStroke>
        <line x1="38" y1="112" x2="74" y2="90" />
        <line x1="44" y1="108" x2="38" y2="126" />
        <line x1="54" y1="100" x2="50" y2="118" />
        <line x1="74" y1="90" x2="96" y2="92" />
        <line x1="96" y1="92" x2="114" y2="124" />
        <line x1="74" y1="90" x2="94" y2="74" />
      </FigureStroke>
      <Arrow d="M 92 102 C 96 90 98 82 100 68 l -4 6 m 4 -6 l 4 5" />
    </>
  );
}

function SideLyingPose() {
  return (
    <>
      <FloorLine />
      <Head x={30} y={108} />
      <FigureStroke>
        <line x1="40" y1="108" x2="86" y2="108" />
        <line x1="48" y1="108" x2="42" y2="124" />
        <line x1="60" y1="108" x2="54" y2="122" />
        <line x1="86" y1="108" x2="114" y2="108" />
        <line x1="86" y1="114" x2="114" y2="114" />
      </FigureStroke>
    </>
  );
}

function SideLiftPose() {
  return (
    <>
      <FloorLine />
      <Head x={30} y={108} />
      <FigureStroke>
        <line x1="40" y1="108" x2="86" y2="108" />
        <line x1="48" y1="108" x2="42" y2="124" />
        <line x1="60" y1="108" x2="54" y2="122" />
        <line x1="86" y1="108" x2="114" y2="108" />
        <line x1="86" y1="114" x2="110" y2="86" />
      </FigureStroke>
      <Arrow d="M 98 102 C 108 96 114 88 118 78 l -7 3 m 7 -3 l -1 7" />
    </>
  );
}

function QuadrupedPose() {
  return (
    <>
      <FloorLine />
      <Head x={52} y={76} />
      <FigureStroke>
        <line x1="62" y1="78" x2="88" y2="90" />
        <line x1="88" y1="90" x2="102" y2="90" />
        <line x1="66" y1="86" x2="56" y2="118" />
        <line x1="98" y1="90" x2="108" y2="118" />
        <line x1="88" y1="90" x2="102" y2="116" />
        <line x1="102" y1="116" x2="116" y2="132" />
      </FigureStroke>
    </>
  );
}

function BirdDogPose() {
  return (
    <>
      <FloorLine />
      <Head x={52} y={76} />
      <FigureStroke>
        <line x1="62" y1="78" x2="88" y2="90" />
        <line x1="88" y1="90" x2="102" y2="90" />
        <line x1="66" y1="86" x2="48" y2="66" />
        <line x1="98" y1="90" x2="108" y2="118" />
        <line x1="88" y1="90" x2="114" y2="72" />
      </FigureStroke>
      <Arrow d="M 108 66 C 116 64 122 64 126 66 l -5 -5 m 5 5 l -7 2" />
    </>
  );
}

function BreathingPose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={112} />
      <FigureStroke>
        <line x1="38" y1="112" x2="84" y2="110" />
        <line x1="50" y1="110" x2="64" y2="100" />
        <line x1="56" y1="112" x2="68" y2="118" />
        <line x1="84" y1="110" x2="104" y2="98" />
        <line x1="104" y1="98" x2="118" y2="122" />
        <line x1="84" y1="110" x2="98" y2="110" />
        <line x1="98" y1="110" x2="114" y2="124" />
      </FigureStroke>
      <Arrow d="M 68 80 C 74 72 82 70 90 74" />
      <Arrow d="M 68 122 C 74 130 82 132 90 128" />
    </>
  );
}

function PelvicTiltPose() {
  return (
    <>
      <FloorLine />
      <Head x={28} y={112} />
      <FigureStroke>
        <line x1="38" y1="112" x2="82" y2="114" />
        <line x1="46" y1="112" x2="40" y2="126" />
        <line x1="58" y1="112" x2="54" y2="128" />
        <line x1="82" y1="114" x2="100" y2="102" />
        <line x1="100" y1="102" x2="116" y2="124" />
        <line x1="82" y1="114" x2="96" y2="114" />
        <line x1="96" y1="114" x2="112" y2="124" />
      </FigureStroke>
      <Arrow d="M 74 96 C 84 88 90 88 98 96 l -5 -5 m 5 5 l -6 3" />
    </>
  );
}

function WallArmsPose() {
  return (
    <>
      <FloorLine />
      <WallLine />
      <Head x={54} y={34} />
      <FigureStroke>
        <line x1="54" y1="44" x2="54" y2="84" />
        <line x1="40" y1="58" x2="68" y2="58" />
        <line x1="40" y1="58" x2="38" y2="32" />
        <line x1="68" y1="58" x2="70" y2="32" />
        <line x1="54" y1="84" x2="52" y2="124" />
        <line x1="54" y1="84" x2="74" y2="124" />
      </FigureStroke>
      <Arrow d="M 80 60 C 92 52 96 42 96 30 l -5 6 m 5 -6 l 3 7" />
    </>
  );
}

function WallChestOpenPose() {
  return (
    <>
      <FloorLine />
      <WallLine />
      <Head x={54} y={34} />
      <FigureStroke>
        <line x1="54" y1="44" x2="60" y2="84" />
        <line x1="40" y1="58" x2="72" y2="58" />
        <line x1="40" y1="58" x2="34" y2="94" />
        <line x1="72" y1="58" x2="96" y2="48" />
        <line x1="60" y1="84" x2="58" y2="124" />
        <line x1="60" y1="84" x2="80" y2="124" />
      </FigureStroke>
      <Arrow d="M 88 42 C 98 40 108 46 114 56 l -7 -2 m 7 2 l -3 -7" />
    </>
  );
}
