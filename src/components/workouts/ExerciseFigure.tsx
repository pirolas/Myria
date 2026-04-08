type Point = { x: number; y: number };

interface Pose {
  head: Point;
  neck: Point;
  shoulderLeft: Point;
  shoulderRight: Point;
  elbowLeft: Point;
  elbowRight: Point;
  handLeft: Point;
  handRight: Point;
  hipLeft: Point;
  hipRight: Point;
  kneeLeft: Point;
  kneeRight: Point;
  footLeft: Point;
  footRight: Point;
}

interface FigureConfig {
  start: Pose;
  end: Pose;
  guidePath: string;
  scene: "floor" | "wall";
  movementLabel: string;
}

function pt(x: number, y: number): Point {
  return { x, y };
}

function midpoint(a: Point, b: Point): Point {
  return pt((a.x + b.x) / 2, (a.y + b.y) / 2);
}

function drawPose(pose: Pose, variant: "start" | "end") {
  const shoulderCenter = midpoint(pose.shoulderLeft, pose.shoulderRight);
  const hipCenter = midpoint(pose.hipLeft, pose.hipRight);
  const waist = midpoint(shoulderCenter, hipCenter);
  const stroke =
    variant === "end" ? "rgba(42, 122, 118, 0.96)" : "rgba(155, 202, 198, 0.78)";
  const hairStroke =
    variant === "end" ? "rgba(90, 170, 164, 0.82)" : "rgba(193, 229, 225, 0.7)";
  const headFill =
    variant === "end" ? "rgba(255, 250, 246, 0.98)" : "rgba(255, 255, 255, 0.66)";

  return (
    <g className={variant === "end" ? "figure-active" : "figure-rest"}>
      <path
        d={`M ${pose.head.x + 9} ${pose.head.y - 6} q 10 6 7 17`}
        fill="none"
        stroke={hairStroke}
        strokeLinecap="round"
        strokeWidth={4}
      />
      <circle
        cx={pose.head.x}
        cy={pose.head.y}
        r={11}
        fill={headFill}
        stroke={stroke}
        strokeWidth={4}
      />
      <line
        x1={pose.shoulderLeft.x}
        y1={pose.shoulderLeft.y}
        x2={pose.shoulderRight.x}
        y2={pose.shoulderRight.y}
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={5.5}
      />
      <path
        d={`M ${shoulderCenter.x} ${shoulderCenter.y} Q ${waist.x - 2} ${waist.y} ${hipCenter.x} ${hipCenter.y}`}
        fill="none"
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={5.5}
      />
      <line
        x1={pose.hipLeft.x}
        y1={pose.hipLeft.y}
        x2={pose.hipRight.x}
        y2={pose.hipRight.y}
        stroke={stroke}
        strokeLinecap="round"
        strokeWidth={5.5}
      />
      {[
        [pose.shoulderLeft, pose.elbowLeft],
        [pose.elbowLeft, pose.handLeft],
        [pose.shoulderRight, pose.elbowRight],
        [pose.elbowRight, pose.handRight],
        [pose.hipLeft, pose.kneeLeft],
        [pose.kneeLeft, pose.footLeft],
        [pose.hipRight, pose.kneeRight],
        [pose.kneeRight, pose.footRight]
      ].map(([from, to], index) => (
        <line
          key={index}
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth={5.5}
        />
      ))}
    </g>
  );
}

const standingNeutral: Pose = {
  head: pt(110, 38),
  neck: pt(110, 54),
  shoulderLeft: pt(94, 68),
  shoulderRight: pt(126, 68),
  elbowLeft: pt(95, 98),
  elbowRight: pt(125, 98),
  handLeft: pt(96, 126),
  handRight: pt(124, 126),
  hipLeft: pt(100, 108),
  hipRight: pt(120, 108),
  kneeLeft: pt(102, 144),
  kneeRight: pt(118, 144),
  footLeft: pt(100, 176),
  footRight: pt(120, 176)
};

const wallNeutral: Pose = {
  ...standingNeutral,
  head: pt(96, 38),
  neck: pt(96, 54),
  shoulderLeft: pt(82, 68),
  shoulderRight: pt(110, 68),
  elbowLeft: pt(83, 98),
  elbowRight: pt(109, 98),
  handLeft: pt(84, 126),
  handRight: pt(108, 126),
  hipLeft: pt(88, 108),
  hipRight: pt(104, 108),
  kneeLeft: pt(90, 144),
  kneeRight: pt(102, 144),
  footLeft: pt(88, 176),
  footRight: pt(106, 176)
};

const bridgeStart: Pose = {
  head: pt(44, 138),
  neck: pt(60, 136),
  shoulderLeft: pt(66, 126),
  shoulderRight: pt(66, 144),
  elbowLeft: pt(52, 152),
  elbowRight: pt(52, 122),
  handLeft: pt(38, 162),
  handRight: pt(38, 112),
  hipLeft: pt(116, 126),
  hipRight: pt(116, 144),
  kneeLeft: pt(148, 132),
  kneeRight: pt(148, 150),
  footLeft: pt(178, 150),
  footRight: pt(178, 174)
};

const bridgeEnd: Pose = {
  ...bridgeStart,
  hipLeft: pt(114, 96),
  hipRight: pt(114, 114),
  kneeLeft: pt(148, 122),
  kneeRight: pt(148, 140)
};

const heelSlideEnd: Pose = {
  ...bridgeStart,
  kneeLeft: pt(154, 128),
  footLeft: pt(188, 126)
};

const deadBugStart: Pose = {
  head: pt(40, 116),
  neck: pt(56, 116),
  shoulderLeft: pt(62, 104),
  shoulderRight: pt(62, 128),
  elbowLeft: pt(76, 100),
  elbowRight: pt(76, 132),
  handLeft: pt(92, 96),
  handRight: pt(92, 136),
  hipLeft: pt(114, 108),
  hipRight: pt(114, 128),
  kneeLeft: pt(140, 92),
  kneeRight: pt(140, 116),
  footLeft: pt(168, 92),
  footRight: pt(168, 116)
};

const deadBugEnd: Pose = {
  ...deadBugStart,
  elbowLeft: pt(92, 96),
  handLeft: pt(120, 92),
  kneeLeft: pt(144, 110),
  footLeft: pt(176, 134)
};

const bridgeMarchEnd: Pose = {
  ...bridgeEnd,
  kneeLeft: pt(142, 86),
  footLeft: pt(164, 84)
};

const sideLegStart: Pose = {
  head: pt(44, 122),
  neck: pt(58, 122),
  shoulderLeft: pt(64, 112),
  shoulderRight: pt(64, 128),
  elbowLeft: pt(50, 136),
  elbowRight: pt(76, 104),
  handLeft: pt(40, 150),
  handRight: pt(88, 98),
  hipLeft: pt(110, 116),
  hipRight: pt(110, 128),
  kneeLeft: pt(146, 120),
  kneeRight: pt(146, 136),
  footLeft: pt(182, 122),
  footRight: pt(182, 146)
};

const sideLegEnd: Pose = {
  ...sideLegStart,
  kneeLeft: pt(146, 94),
  footLeft: pt(182, 82)
};

const quadrupedStart: Pose = {
  head: pt(74, 86),
  neck: pt(88, 92),
  shoulderLeft: pt(90, 98),
  shoulderRight: pt(106, 98),
  elbowLeft: pt(78, 116),
  elbowRight: pt(110, 116),
  handLeft: pt(64, 134),
  handRight: pt(124, 134),
  hipLeft: pt(124, 108),
  hipRight: pt(138, 108),
  kneeLeft: pt(144, 134),
  kneeRight: pt(160, 150),
  footLeft: pt(148, 160),
  footRight: pt(166, 176)
};

const quadrupedEnd: Pose = {
  ...quadrupedStart,
  elbowRight: pt(128, 106),
  handRight: pt(150, 100),
  kneeLeft: pt(156, 108),
  footLeft: pt(182, 96)
};

const breathingStart: Pose = {
  ...bridgeStart,
  elbowLeft: pt(74, 132),
  elbowRight: pt(74, 136),
  handLeft: pt(90, 122),
  handRight: pt(92, 144)
};

const breathingEnd: Pose = {
  ...breathingStart,
  elbowLeft: pt(78, 126),
  elbowRight: pt(78, 142),
  handLeft: pt(98, 118),
  handRight: pt(100, 148)
};

const pelvicTiltEnd: Pose = {
  ...bridgeStart,
  hipLeft: pt(110, 132),
  hipRight: pt(110, 148),
  kneeLeft: pt(144, 128),
  kneeRight: pt(144, 150)
};

const squatEnd: Pose = {
  ...standingNeutral,
  head: pt(110, 48),
  neck: pt(110, 64),
  shoulderLeft: pt(94, 78),
  shoulderRight: pt(126, 78),
  elbowLeft: pt(90, 106),
  elbowRight: pt(130, 106),
  handLeft: pt(86, 130),
  handRight: pt(134, 130),
  hipLeft: pt(98, 114),
  hipRight: pt(122, 114),
  kneeLeft: pt(94, 146),
  kneeRight: pt(126, 146),
  footLeft: pt(96, 176),
  footRight: pt(124, 176)
};

const sideLiftEnd: Pose = {
  ...standingNeutral,
  kneeRight: pt(140, 130),
  footRight: pt(162, 118)
};

const lungeEnd: Pose = {
  ...standingNeutral,
  head: pt(108, 42),
  neck: pt(108, 58),
  shoulderLeft: pt(92, 72),
  shoulderRight: pt(124, 72),
  elbowLeft: pt(82, 96),
  elbowRight: pt(128, 98),
  handLeft: pt(74, 120),
  handRight: pt(130, 126),
  hipLeft: pt(98, 110),
  hipRight: pt(118, 110),
  kneeLeft: pt(100, 146),
  kneeRight: pt(142, 146),
  footLeft: pt(104, 176),
  footRight: pt(160, 176)
};

const calfRaiseEnd: Pose = {
  ...standingNeutral,
  head: pt(110, 32),
  neck: pt(110, 48),
  shoulderLeft: pt(94, 62),
  shoulderRight: pt(126, 62),
  elbowLeft: pt(95, 92),
  elbowRight: pt(125, 92),
  handLeft: pt(96, 120),
  handRight: pt(124, 120),
  hipLeft: pt(100, 102),
  hipRight: pt(120, 102),
  kneeLeft: pt(102, 138),
  kneeRight: pt(118, 138),
  footLeft: pt(104, 172),
  footRight: pt(124, 172)
};

const wallSitEnd: Pose = {
  ...wallNeutral,
  head: pt(96, 50),
  neck: pt(96, 64),
  shoulderLeft: pt(82, 76),
  shoulderRight: pt(110, 76),
  elbowLeft: pt(78, 106),
  elbowRight: pt(108, 106),
  handLeft: pt(74, 132),
  handRight: pt(108, 132),
  hipLeft: pt(88, 114),
  hipRight: pt(104, 114),
  kneeLeft: pt(116, 146),
  kneeRight: pt(132, 146),
  footLeft: pt(116, 176),
  footRight: pt(132, 176)
};

const scapoleWallEnd: Pose = {
  ...wallNeutral,
  elbowLeft: pt(78, 70),
  elbowRight: pt(114, 70),
  handLeft: pt(76, 42),
  handRight: pt(116, 42)
};

const chestOpenerEnd: Pose = {
  ...wallNeutral,
  shoulderRight: pt(110, 70),
  elbowRight: pt(110, 94),
  handRight: pt(110, 118),
  shoulderLeft: pt(88, 72),
  elbowLeft: pt(72, 98),
  handLeft: pt(60, 122),
  hipLeft: pt(92, 110),
  hipRight: pt(106, 114),
  kneeLeft: pt(96, 146),
  kneeRight: pt(110, 148),
  footLeft: pt(96, 176),
  footRight: pt(114, 176)
};

const figureConfigs: Record<string, FigureConfig> = {
  "ponte-glutei": {
    start: bridgeStart,
    end: bridgeEnd,
    guidePath: "M 118 150 C 118 128 118 110 118 92",
    scene: "floor",
    movementLabel: "solleva il bacino"
  },
  "squat-alla-sedia": {
    start: standingNeutral,
    end: squatEnd,
    guidePath: "M 132 74 C 146 94 146 128 130 150",
    scene: "floor",
    movementLabel: "scendi e risali con controllo"
  },
  "wall-sit": {
    start: wallNeutral,
    end: wallSitEnd,
    guidePath: "M 122 72 C 132 96 132 126 124 150",
    scene: "wall",
    movementLabel: "scivola lungo il muro"
  },
  "slanci-laterali-in-piedi": {
    start: standingNeutral,
    end: sideLiftEnd,
    guidePath: "M 128 144 C 140 132 150 122 164 116",
    scene: "floor",
    movementLabel: "apri la gamba di lato"
  },
  "affondo-assistito-indietro": {
    start: standingNeutral,
    end: lungeEnd,
    guidePath: "M 118 140 C 132 146 146 156 160 174",
    scene: "floor",
    movementLabel: "porta una gamba indietro"
  },
  "bird-dog": {
    start: quadrupedStart,
    end: quadrupedEnd,
    guidePath: "M 128 118 C 146 108 162 100 182 96",
    scene: "floor",
    movementLabel: "allunga braccio e gamba opposti"
  },
  "heel-slides": {
    start: bridgeStart,
    end: heelSlideEnd,
    guidePath: "M 150 132 C 164 128 176 126 188 126",
    scene: "floor",
    movementLabel: "scivola con il tallone"
  },
  "dead-bug-semplificato": {
    start: deadBugStart,
    end: deadBugEnd,
    guidePath: "M 166 96 C 170 106 174 120 178 134",
    scene: "floor",
    movementLabel: "abbassa lentamente tallone e braccio"
  },
  "ponte-con-marcia": {
    start: bridgeEnd,
    end: bridgeMarchEnd,
    guidePath: "M 150 118 C 152 104 156 92 164 84",
    scene: "floor",
    movementLabel: "alza un piede alla volta"
  },
  "sollevamenti-polpacci": {
    start: standingNeutral,
    end: calfRaiseEnd,
    guidePath: "M 110 162 C 110 150 110 138 110 126",
    scene: "floor",
    movementLabel: "sali sulle punte"
  },
  "side-leg-lifts": {
    start: sideLegStart,
    end: sideLegEnd,
    guidePath: "M 150 118 C 162 104 172 92 182 82",
    scene: "floor",
    movementLabel: "solleva la gamba sopra"
  },
  "respirazione-addominale-profonda": {
    start: breathingStart,
    end: breathingEnd,
    guidePath: "M 88 132 C 100 118 112 118 122 132",
    scene: "floor",
    movementLabel: "segui il respiro"
  },
  "mobilita-bacino-colonna": {
    start: bridgeStart,
    end: pelvicTiltEnd,
    guidePath: "M 112 140 C 106 130 106 122 112 112",
    scene: "floor",
    movementLabel: "muovi il bacino con dolcezza"
  },
  "scapole-al-muro": {
    start: wallNeutral,
    end: scapoleWallEnd,
    guidePath: "M 78 118 C 76 94 76 66 76 42",
    scene: "wall",
    movementLabel: "fai scorrere le braccia al muro"
  },
  "allungamento-petto-parete": {
    start: wallNeutral,
    end: chestOpenerEnd,
    guidePath: "M 92 110 C 80 102 70 92 62 76",
    scene: "wall",
    movementLabel: "ruota il busto con delicatezza"
  }
};

export function ExerciseFigure({ exerciseId }: { exerciseId: string }) {
  const config = figureConfigs[exerciseId] ?? figureConfigs["ponte-glutei"];

  return (
    <div className="surface-soft overflow-hidden px-4 py-4">
      <div>
        <div className="eyebrow">Guida visiva</div>
        <p className="mt-1 text-sm font-semibold text-ink">
          {config.movementLabel}
        </p>
      </div>

      <svg
        viewBox="0 0 220 220"
        aria-label="Stickman femminile che mostra la posizione e il movimento"
        className="mt-4 h-[240px] w-full"
      >
        <rect x="0" y="0" width="220" height="220" rx="26" fill="rgba(255,255,255,0.46)" />
        {config.scene === "wall" ? (
          <line
            x1="54"
            y1="32"
            x2="54"
            y2="186"
            stroke="rgba(169, 215, 212, 0.75)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        ) : null}
        <line
          x1="22"
          y1="186"
          x2="198"
          y2="186"
          stroke="rgba(169, 215, 212, 0.7)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d={config.guidePath}
          fill="none"
          stroke="rgba(94,184,178,0.82)"
          strokeLinecap="round"
          strokeWidth="4"
          className="figure-guide"
        />
        {drawPose(config.start, "start")}
        {drawPose(config.end, "end")}
      </svg>

      <p className="mt-3 text-sm leading-6 text-muted">
        La sagoma passa dalla posizione di partenza alla posizione attiva per
        aiutarti a capire il gesto a colpo d'occhio.
      </p>
    </div>
  );
}
