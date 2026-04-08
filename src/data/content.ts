import type {
  AgeBand,
  CategoryId,
  EnergyLevel,
  Feeling,
  Goal,
  Level,
  LimitationTag,
  MinuteOption,
  MultiPreferenceOption,
  PreferenceOption
} from "@/types/domain";

export const brand = {
  name: "Myria",
  tagline: "Tonifica con calma. Sentiti piu presente nel tuo corpo.",
  shortPitch:
    "Un percorso guidato che ti dice cosa fare oggi, in base a te, con sessioni brevi e sostenibili.",
  longPitch:
    "Myria trasforma la tonificazione a casa in un percorso semplice, elegante e personale. Tu entri, l'app ti guida."
};

export const trainingDayOptions: PreferenceOption<number>[] = [
  {
    value: 2,
    label: "2 giorni",
    description: "Un ritmo morbido se vuoi iniziare senza sentirti pressata."
  },
  {
    value: 3,
    label: "3 giorni",
    description: "Il punto piu equilibrato per creare costanza vera."
  },
  {
    value: 4,
    label: "4 giorni",
    description: "Piu continuita, restando su sessioni brevi e gestibili."
  },
  {
    value: 5,
    label: "5 giorni",
    description: "Per chi preferisce allenamenti leggeri ma piu frequenti."
  }
];

export const minuteOptions: PreferenceOption<MinuteOption>[] = [
  {
    value: 10,
    label: "10 minuti",
    description: "Il minimo giusto quando la giornata e gia piena."
  },
  {
    value: 15,
    label: "15 minuti",
    description: "Una durata facile da ripetere piu volte nella settimana."
  },
  {
    value: 20,
    label: "20 minuti",
    description: "Un po piu di spazio per tono, controllo e qualita del gesto."
  },
  {
    value: 25,
    label: "25 minuti",
    description: "Una routine piu completa, sempre realistica da fare a casa."
  }
];

export const goalOptions: PreferenceOption<Goal>[] = [
  {
    value: "glutei_gambe",
    label: "Glutei e gambe",
    description: "Per sentirle piu attive, sostenute e toniche."
  },
  {
    value: "pancia_core",
    label: "Pancia e core",
    description: "Per ritrovare sostegno al centro senza irrigidirti."
  },
  {
    value: "postura",
    label: "Postura",
    description: "Per aprirti di piu e alleggerire la sensazione di chiusura."
  },
  {
    value: "tonicita_generale",
    label: "Tonicita generale",
    description: "Per un lavoro armonioso su tutto il corpo."
  },
  {
    value: "ripartenza_dolce",
    label: "Ripartenza dolce",
    description: "Per ricominciare in modo semplice, delicato e credibile."
  }
];

export const focusOptions = goalOptions;

export const levelOptions: PreferenceOption<Level>[] = [
  {
    value: "molto_fuori_allenamento",
    label: "Molto fuori allenamento",
    description: "Ripartiamo con gradualita, poco volume e istruzioni molto chiare."
  },
  {
    value: "principiante",
    label: "Principiante",
    description: "Routine accessibili per costruire fiducia e tono."
  },
  {
    value: "intermedio_leggero",
    label: "Intermedio leggero",
    description: "Un po piu di lavoro, sempre senza eccessi inutili."
  }
];

export const gentleStartOptions: PreferenceOption<boolean>[] = [
  {
    value: true,
    label: "Si, molto delicato",
    description: "Preferisco iniziare con un carico molto morbido."
  },
  {
    value: false,
    label: "No, posso partire normale",
    description: "Mi va bene un inizio dolce ma gia un po piu attivo."
  }
];

export const ageBandOptions: PreferenceOption<AgeBand>[] = [
  {
    value: "25_34",
    label: "25-34 anni",
    description: "Per partire da una base giovane ma spesso gia molto impegnata."
  },
  {
    value: "35_44",
    label: "35-44 anni",
    description: "Una fase in cui tono, energie e tempo possono cambiare molto."
  },
  {
    value: "45_54",
    label: "45-54 anni",
    description: "Per costruire sostegno, controllo e una routine credibile."
  },
  {
    value: "55_64",
    label: "55-64 anni",
    description: "Con un approccio orientato a stabilita, fluidita e tono progressivo."
  },
  {
    value: "65_plus",
    label: "65+ anni",
    description: "Per mantenere il lavoro semplice, rispettoso e ben guidato."
  }
];

export const energyOptions: PreferenceOption<EnergyLevel>[] = [
  {
    value: "molto_bassa",
    label: "Molto variabile o bassa",
    description: "Meglio un percorso che ti chieda poco ma con continuita."
  },
  {
    value: "bassa",
    label: "Piuttosto bassa",
    description: "Serve un ritmo leggero che non ti faccia mollare."
  },
  {
    value: "media",
    label: "Media",
    description: "Possiamo costruire un lavoro costante e ben distribuito."
  },
  {
    value: "buona",
    label: "Abbastanza buona",
    description: "C'e spazio per un tono piu presente, restando sostenibile."
  }
];

export const limitationOptions: MultiPreferenceOption<LimitationTag>[] = [
  {
    value: "nessuna",
    label: "Nessun fastidio particolare",
    description: "Non ho nulla di specifico da segnalare."
  },
  {
    value: "addome_delicato",
    label: "Addome delicato",
    description: "Preferisco evitare eccessi di pressione nella zona addominale."
  },
  {
    value: "pavimento_pelvico",
    label: "Area pelvica sensibile",
    description: "Mi sento meglio con un lavoro morbido e controllato."
  },
  {
    value: "lombare_delicata",
    label: "Zona lombare delicata",
    description: "Ho bisogno di attenzione sulla parte bassa della schiena."
  },
  {
    value: "ginocchia_sensibili",
    label: "Ginocchia sensibili",
    description: "Meglio piegamenti progressivi e ben guidati."
  },
  {
    value: "spalle_collo",
    label: "Spalle o collo da alleggerire",
    description: "Mi aiuta un approccio semplice anche nella parte alta."
  }
];

export const feelingOptions: PreferenceOption<Feeling>[] = [
  {
    value: "facile",
    label: "Facile",
    description: "Mi sono sentita comoda e fluida."
  },
  {
    value: "giusto",
    label: "Giusto",
    description: "Un buon lavoro, sostenibile e centrato."
  },
  {
    value: "impegnativo",
    label: "Impegnativa",
    description: "Utile, ma da dosare con un po piu di attenzione."
  }
];

export const energyAfterWorkoutOptions: PreferenceOption<EnergyLevel>[] = [
  {
    value: "molto_bassa",
    label: "Scarica",
    description: "Meglio restare piu morbide nei prossimi passi."
  },
  {
    value: "bassa",
    label: "Un po stanca",
    description: "Il lavoro c'e stato, ma va dosato con attenzione."
  },
  {
    value: "media",
    label: "Stabile",
    description: "Una buona risposta, senza eccessi."
  },
  {
    value: "buona",
    label: "Buona",
    description: "Segnale utile per consolidare e progredire con calma."
  }
];

export const categoryMeta: Record<
  CategoryId,
  { title: string; description: string; accent: string }
> = {
  glutei_gambe: {
    title: "Glutei e gambe",
    description: "Per dare tono, sostegno e stabilita alla parte inferiore.",
    accent: "bg-[rgba(94,184,178,0.12)]"
  },
  core_pancia_profonda: {
    title: "Core e pancia profonda",
    description: "Per sentire il centro piu presente senza forzare.",
    accent: "bg-[rgba(117,194,187,0.12)]"
  },
  postura: {
    title: "Postura",
    description: "Per alleggerire rigidita e ritrovare un assetto piu aperto.",
    accent: "bg-[rgba(126,177,188,0.11)]"
  },
  total_body_leggero: {
    title: "Total body leggero",
    description: "Per un lavoro completo, lineare e facile da seguire.",
    accent: "bg-[rgba(140,203,197,0.11)]"
  },
  mobilita_recupero: {
    title: "Mobilita e recupero",
    description: "Piccoli movimenti per sciogliere e recuperare bene.",
    accent: "bg-[rgba(229,247,245,0.92)]"
  },
  ripartenza_dolce: {
    title: "Ripartenza dolce",
    description: "Per tornare a muoversi con semplicita e fiducia.",
    accent: "bg-[rgba(239,252,250,0.95)]"
  }
};

export const goalLabels: Record<Goal, string> = {
  glutei_gambe: "Glutei e gambe",
  pancia_core: "Pancia e core",
  postura: "Postura",
  tonicita_generale: "Tonicita generale",
  ripartenza_dolce: "Ripartenza dolce"
};

export const levelLabels: Record<Level, string> = {
  molto_fuori_allenamento: "Molto fuori allenamento",
  principiante: "Principiante",
  intermedio_leggero: "Intermedio leggero"
};

export const feelingLabels: Record<Feeling, string> = {
  facile: "Facile",
  giusto: "Giusto",
  impegnativo: "Impegnativa"
};

export const ageBandLabels: Record<AgeBand, string> = {
  "25_34": "25-34 anni",
  "35_44": "35-44 anni",
  "45_54": "45-54 anni",
  "55_64": "55-64 anni",
  "65_plus": "65+ anni"
};

export const energyLabels: Record<EnergyLevel, string> = {
  molto_bassa: "Molto bassa",
  bassa: "Bassa",
  media: "Media",
  buona: "Buona"
};

export const limitationLabels: Record<LimitationTag, string> = {
  nessuna: "Nessun fastidio particolare",
  addome_delicato: "Addome delicato",
  pavimento_pelvico: "Area pelvica sensibile",
  lombare_delicata: "Zona lombare delicata",
  ginocchia_sensibili: "Ginocchia sensibili",
  spalle_collo: "Spalle o collo da alleggerire"
};

export const consistencyMessages = [
  "La costanza conta piu di una seduta perfetta.",
  "Anche pochi minuti ben scelti cambiano il modo in cui ti senti.",
  "Il tono arriva piu facilmente quando il ritmo resta realistico.",
  "Allenarti a casa puo diventare semplice, se la routine ti somiglia."
];

export const horizonMessages = [
  "Stai costruendo base e controllo, non intensita.",
  "Stai consolidando il tono prima di chiedere di piu al corpo.",
  "Stai creando una routine che puo restare con te, non un picco da inseguire."
];

export const safetyNotes = [
  "Interrompi il movimento in caso di dolore.",
  "Se avverti fastidi addominali o pelvici, riduci o sospendi l'esercizio.",
  "In presenza di dubbi o situazioni particolari, confrontati con un professionista qualificato."
];
