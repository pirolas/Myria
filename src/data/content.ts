import type {
  AgeBand,
  BodyAreaFocus,
  CategoryId,
  CoordinationLevel,
  DropoutReason,
  EnergyLevel,
  Feeling,
  Goal,
  HydrationPattern,
  ImprovementTag,
  Level,
  LifestyleType,
  LimitationTag,
  MinuteOption,
  MobilityPerception,
  MultiPreferenceOption,
  NutritionPattern,
  ObstacleTag,
  PastTrainingExperience,
  PelvicSignal,
  PosturePerception,
  PreferenceOption,
  ReassessmentFit,
  SensitivityTag,
  SleepQuality,
  StressLevel,
  TimePreference,
  TrainingPreference,
  WeeklyAvailability,
  BodyConfidence,
  DiastasisStatus,
  EatingPerception,
  FocusArea,
  PastTrainingType,
  PreferredDay,
  PrimaryBodyGoal,
  ProteinPerception,
  SecondaryObjective,
  SessionStyle,
  SessionTone
} from "@/types/domain";

export const brand = {
  name: "Mirya",
  tagline: "Tonifica con calma. Sentiti più presente nel tuo corpo.",
  shortPitch:
    "Un coaching guidato che capisce la tua situazione, ti dice cosa fare oggi e adatta il percorso nel tempo.",
  longPitch:
    "Mirya trasforma la tonificazione a casa in un percorso semplice, elegante e personale. Tu entri, lei costruisce il piano, te lo spiega con chiarezza e lo aggiorna quando serve."
};

export const trainingDayOptions: PreferenceOption<number>[] = [
  { value: 2, label: "2 giorni", description: "Un ritmo molto realistico se vuoi partire senza pressione." },
  { value: 3, label: "3 giorni", description: "La scelta più equilibrata per costruire una costanza reale." },
  { value: 4, label: "4 giorni", description: "Più continuità, mantenendo sessioni brevi e sostenibili." },
  { value: 5, label: "5 giorni", description: "Per chi preferisce un lavoro leggero ma più frequente." }
];

export const minuteOptions: PreferenceOption<MinuteOption>[] = [
  { value: 10, label: "10 minuti", description: "Il minimo giusto per non perdere il ritmo." },
  { value: 15, label: "15 minuti", description: "Una durata facile da proteggere anche nelle settimane piene." },
  { value: 20, label: "20 minuti", description: "Più spazio per tono, controllo e respirazione." },
  { value: 25, label: "25 minuti", description: "Una routine più completa, sempre adatta alla casa." }
];

export const goalOptions: PreferenceOption<Goal>[] = [
  { value: "glutei_gambe", label: "Glutei e gambe", description: "Per sentirli più presenti, sostenuti e tonici." },
  { value: "pancia_core", label: "Addome profondo e stabilità", description: "Per ritrovare sostegno e controllo nel centro del corpo." },
  { value: "postura", label: "Postura", description: "Per alleggerire le chiusure e stare più aperta nei movimenti." },
  { value: "tonicita_generale", label: "Tonicità generale", description: "Per un lavoro armonioso su tutto il corpo." },
  { value: "ripartenza_dolce", label: "Ripartenza dolce", description: "Per ricominciare con un ritmo delicato ma credibile." }
];

export const focusOptions = goalOptions;

export const primaryBodyGoalOptions: PreferenceOption<PrimaryBodyGoal>[] = [
  {
    value: "dimagrire",
    label: "Dimagrire",
    description: "Per alleggerire il corpo con un percorso progressivo e sostenibile."
  },
  {
    value: "massa_muscolare",
    label: "Aumentare massa muscolare",
    description: "Per costruire più presenza muscolare, soprattutto se oggi ti senti svuotata o troppo esile."
  },
  {
    value: "tonicita_rassodare",
    label: "Aumentare tonicità e rassodare",
    description: "Per sentirti meno flaccida e più sostenuta, anche se il peso non è il punto centrale."
  },
  {
    value: "aumentare_peso_sano",
    label: "Aumentare di peso in modo sano",
    description: "Per uscire da una sensazione di corpo troppo scarico, con lavoro graduale e nutrimento migliore."
  },
  {
    value: "ricomposizione_corporea",
    label: "Ricomposizione corporea",
    description: "Per migliorare forma, tono e distribuzione del lavoro sul corpo, senza inseguire solo la bilancia."
  }
];

export const secondaryObjectiveOptions: MultiPreferenceOption<SecondaryObjective>[] = [
  { value: "glutei_piu_sodi", label: "Glutei più sodi", description: "Percepire più sostegno e tono nella parte bassa." },
  { value: "gambe_piu_toniche", label: "Gambe più toniche", description: "Sentire le gambe più presenti e meno spente." },
  { value: "addome_piu_stabile", label: "Addome più stabile", description: "Ritrovare un centro più controllato e sostenuto." },
  { value: "postura_migliore", label: "Postura migliore", description: "Alleggerire chiusure e rigidità nella giornata." },
  { value: "piu_energia", label: "Più energia", description: "Uscire dalle sessioni sentendoti più attiva, non svuotata." },
  { value: "meno_flaccidita", label: "Sentirti meno flaccida", description: "Lavorare sul tono quando il punto non è perdere peso, ma dare più forma al corpo." },
  { value: "piu_forza", label: "Sentirti più forte", description: "Avere più sicurezza nei movimenti e nel lavoro muscolare." },
  { value: "maggiore_costanza", label: "Maggiore costanza", description: "Rendere la routine praticabile e non solo desiderata." },
  { value: "ridurre_rigidita", label: "Ridurre rigidità", description: "Sciogliere tensioni e chiusure da sedentarietà o stress." },
  { value: "migliorare_mobilita", label: "Migliorare mobilità", description: "Muoversi con più fluidità e meno freno." }
];

export const focusAreaOptions: MultiPreferenceOption<FocusArea>[] = [
  { value: "glutei", label: "Glutei", description: "Per dare più sostegno e forma alla parte posteriore." },
  { value: "gambe", label: "Gambe", description: "Per gambe più toniche e presenti." },
  { value: "addome_core", label: "Addome profondo e stabilità", description: "Per stabilità, sostegno e controllo nel centro del corpo." },
  { value: "postura", label: "Postura", description: "Per alleggerire chiusure e rigidità." },
  { value: "braccia", label: "Braccia", description: "Per completare il lavoro di tonicità in modo armonioso." },
  { value: "total_body", label: "Tonificazione generale", description: "Per un percorso equilibrato su tutto il corpo." }
];

export const preferredDayOptions: PreferenceOption<PreferredDay>[] = [
  { value: "lun", label: "Lunedì", description: "Inizio settimana." },
  { value: "mar", label: "Martedì", description: "Secondo giorno." },
  { value: "mer", label: "Mercoledì", description: "Metà settimana." },
  { value: "gio", label: "Giovedì", description: "Verso il finale." },
  { value: "ven", label: "Venerdì", description: "Chiusura della settimana attiva." },
  { value: "sab", label: "Sabato", description: "Più flessibilità nel weekend." },
  { value: "dom", label: "Domenica", description: "Ritmo morbido del weekend." }
];

export const pastTrainingTypeOptions: MultiPreferenceOption<PastTrainingType>[] = [
  { value: "nessuno", label: "Nessuno", description: "Non ho una vera esperienza da richiamare." },
  { value: "camminata", label: "Camminata", description: "Mi sono mossa soprattutto camminando." },
  { value: "home_workout", label: "Allenamenti a casa", description: "Ho già provato routine guidate a casa." },
  { value: "pesi_macchine", label: "Pesi o macchine", description: "Ho fatto sala o lavoro con carichi." },
  { value: "pilates_yoga", label: "Pilates o yoga", description: "Ho più familiarità con un lavoro controllato e posturale." },
  { value: "corsi_fitness", label: "Corsi fitness", description: "Ho seguito lezioni o corsi di gruppo." }
];

export const sessionStyleOptions: PreferenceOption<SessionStyle>[] = [
  { value: "circuiti", label: "Circuiti semplici", description: "Mi va bene un ritmo lineare, con passaggi chiari tra gli esercizi." },
  { value: "sequenze_lente", label: "Sequenze più lente", description: "Preferisco più controllo e meno fretta tra uno step e l'altro." }
];

export const sessionToneOptions: PreferenceOption<SessionTone>[] = [
  { value: "soft", label: "Più soft", description: "Voglio partire con un tono calmo e sostenibile." },
  { value: "tonificante", label: "Più tonificante", description: "Posso sentire un po' più di lavoro, restando guidata." }
];

export const eatingPerceptionOptions: PreferenceOption<EatingPerception>[] = [
  { value: "troppo_poco", label: "Spesso troppo poco", description: "Rischio di mangiare meno di quanto mi serva davvero." },
  { value: "abbastanza", label: "Abbastanza", description: "Nel complesso il mio ritmo alimentare e discreto." },
  { value: "troppo", label: "Spesso troppo", description: "Sento di eccedere più di quanto vorrei." },
  { value: "disordinato", label: "In modo disordinato", description: "Il punto principale è la mancanza di regolarità." }
];

export const proteinPerceptionOptions: PreferenceOption<ProteinPerception>[] = [
  { value: "si", label: "Sì, abbastanza", description: "Credo di introdurre una quota proteica sufficiente." },
  { value: "no", label: "No, probabilmente poche", description: "Penso di restare spesso troppo bassa." },
  { value: "non_so", label: "Non saprei", description: "Non ho ben chiaro se bastano davvero." }
];

export const levelOptions: PreferenceOption<Level>[] = [
  {
    value: "molto_fuori_allenamento",
    label: "Molto fuori allenamento",
    description: "Partiamo con un lavoro semplice, poco volume e istruzioni molto chiare."
  },
  {
    value: "principiante",
    label: "Principiante",
    description: "Una base accessibile per costruire tono e fiducia."
  },
  {
    value: "intermedio_leggero",
    label: "Intermedio leggero",
    description: "Possiamo chiedere un po' di più, restando sempre sostenibili."
  }
];

export const gentleStartOptions: PreferenceOption<boolean>[] = [
  { value: true, label: "Sì, molto graduale", description: "Preferisco una partenza davvero morbida." },
  { value: false, label: "No, può essere dolce ma attiva", description: "Va bene una base delicata ma già un po' più presente." }
];

export const ageBandOptions: PreferenceOption<AgeBand>[] = [
  { value: "25_34", label: "25-34 anni", description: "Una fase spesso piena di impegni e ritmi variabili." },
  { value: "35_44", label: "35-44 anni", description: "Un momento in cui energia, tono e tempo possono cambiare molto." },
  { value: "45_54", label: "45-54 anni", description: "Per costruire sostegno, presenza e costanza concreta." },
  { value: "55_64", label: "55-64 anni", description: "Con attenzione a fluidità, stabilità e tono progressivo." },
  { value: "65_plus", label: "65+ anni", description: "Per mantenere il lavoro rispettoso, chiaro e ben dosato." }
];

export const energyOptions: PreferenceOption<EnergyLevel>[] = [
  { value: "molto_bassa", label: "Molto variabile o bassa", description: "Meglio un percorso che chieda poco ma resti ripetibile." },
  { value: "bassa", label: "Piuttosto bassa", description: "Serve una progressione dolce che non ti faccia mollare." },
  { value: "media", label: "Media", description: "C'è spazio per un lavoro costante e ben distribuito." },
  { value: "buona", label: "Abbastanza buona", description: "Possiamo cercare un tono più presente restando realistiche." }
];

export const limitationOptions: MultiPreferenceOption<LimitationTag>[] = [
  { value: "nessuna", label: "Nessun fastidio particolare", description: "Non ho nulla di specifico da segnalare." },
  { value: "addome_delicato", label: "Addome delicato", description: "Preferisco evitare eccessi di pressione nella zona addominale." },
  { value: "pavimento_pelvico", label: "Area pelvica sensibile", description: "Mi sento meglio con un lavoro molto controllato." },
  { value: "lombare_delicata", label: "Zona lombare delicata", description: "Ho bisogno di attenzione sulla parte bassa della schiena." },
  { value: "ginocchia_sensibili", label: "Ginocchia sensibili", description: "Meglio piegamenti progressivi e ben guidati." },
  { value: "spalle_collo", label: "Spalle o collo da alleggerire", description: "Mi aiuta un approccio semplice anche per la parte alta." }
];

export const feelingOptions: PreferenceOption<Feeling>[] = [
  { value: "facile", label: "Facile", description: "Mi sono sentita comoda e fluida." },
  { value: "giusto", label: "Giusto", description: "Un buon lavoro, presente ma sostenibile." },
  { value: "impegnativo", label: "Impegnativa", description: "Utile, ma da dosare con un po' più di attenzione." }
];

export const energyAfterWorkoutOptions: PreferenceOption<EnergyLevel>[] = [
  { value: "molto_bassa", label: "Scarica", description: "Meglio alleggerire i prossimi passi." },
  { value: "bassa", label: "Un po' stanca", description: "Il lavoro c'è stato, ma va dosato con cura." },
  { value: "media", label: "Stabile", description: "Una risposta equilibrata, senza eccessi." },
  { value: "buona", label: "Buona", description: "Segnale utile per consolidare o progredire con calma." }
];

export const pastExperienceOptions: PreferenceOption<PastTrainingExperience>[] = [
  { value: "mai_costante", label: "Mai davvero costante", description: "Ho iniziato più volte ma senza continuità." },
  { value: "qualche_fase", label: "Qualche fase in passato", description: "Mi è capitato di allenarmi, ma a periodi." },
  { value: "abbastanza_regolare", label: "Abbastanza regolare", description: "Ho già avuto una routine più presente." }
];

export const lifestyleOptions: PreferenceOption<LifestyleType>[] = [
  { value: "molto_sedentaria", label: "Molto sedentaria", description: "Passo molte ore seduta o con poco movimento." },
  { value: "abbastanza_attiva", label: "Abbastanza attiva", description: "Mi muovo, ma non in modo continuo durante tutta la giornata." },
  { value: "molto_in_movimento", label: "Molto in movimento", description: "Sto spesso in piedi o mi muovo parecchio." }
];

export const sleepQualityOptions: PreferenceOption<SleepQuality>[] = [
  { value: "bassa", label: "Fragile", description: "Dormo poco o mi sento poco recuperata." },
  { value: "discontinua", label: "Discontinua", description: "Il sonno varia molto da un periodo all'altro." },
  { value: "abbastanza_buona", label: "Abbastanza buona", description: "Nel complesso recupero abbastanza." },
  { value: "buona", label: "Buona", description: "Mi sento spesso riposata al risveglio." }
];

export const stressLevelOptions: PreferenceOption<StressLevel>[] = [
  { value: "alto", label: "Molto alto", description: "Ho bisogno di un piano che protegga energie e recupero." },
  { value: "medio_alto", label: "Piuttosto alto", description: "Meglio un lavoro chiaro, non troppo denso." },
  { value: "medio", label: "Medio", description: "Possiamo costruire una progressione regolare." },
  { value: "gestibile", label: "Gestibile", description: "C'è spazio per un ritmo un po' più presente." }
];

export const weeklyAvailabilityOptions: PreferenceOption<WeeklyAvailability>[] = [
  { value: "molto_variabile", label: "Molto variabile", description: "I miei spazi cambiano spesso durante la settimana." },
  { value: "alcuni_spazi", label: "Ho alcuni spazi", description: "Riesco a ritagliarmi momenti, ma non sempre fissi." },
  { value: "abbastanza_stabile", label: "Abbastanza stabile", description: "Posso proteggere abbastanza bene alcuni orari." }
];

export const timePreferenceOptions: PreferenceOption<TimePreference>[] = [
  { value: "mattina", label: "Mattina", description: "Mi sento meglio se mi muovo all'inizio della giornata." },
  { value: "pausa_pranzo", label: "Pausa pranzo", description: "Un momento breve nel mezzo della giornata è la soluzione migliore." },
  { value: "pomeriggio", label: "Pomeriggio", description: "Riesco più facilmente nel pomeriggio." },
  { value: "sera", label: "Sera", description: "Trovo spazio soprattutto verso sera." },
  { value: "variabile", label: "Variabile", description: "Preferisco che il piano resti flessibile." }
];

export const simpleExerciseOptions: PreferenceOption<boolean>[] = [
  { value: true, label: "Sì, esercizi semplici e sicuri", description: "Mi sento meglio se i movimenti sono molto chiari e facili da seguire." },
  { value: false, label: "Va bene anche un po' più vario", description: "Posso gestire anche qualcosa di leggermente più ricco, se resta ben spiegato." }
];

export const avoidJumpOptions: PreferenceOption<boolean>[] = [
  { value: true, label: "Senza salti", description: "Preferisco un lavoro controllato e gentile su articolazioni e pavimento pelvico." },
  { value: false, label: "Non è una priorità", description: "Va bene anche qualche passaggio più dinamico, se dosato." }
];

export const bodyAreaFocusOptions: PreferenceOption<BodyAreaFocus>[] = [
  { value: "glutei_gambe", label: "Glutei e gambe", description: "Sento più bisogno di sostegno e tono nella parte bassa." },
  { value: "core", label: "Addome profondo e stabilità", description: "Mi serve più controllo e sostegno nel centro del corpo." },
  { value: "postura", label: "Postura", description: "Sento soprattutto chiusura, rigidità o poco assetto." },
  { value: "schiena", label: "Schiena", description: "Avverto debolezza o poca stabilità dietro." },
  { value: "stabilita_generale", label: "Stabilità generale", description: "Mi sento poco sicura nel movimento in modo diffuso." }
];

export const posturePerceptionOptions: PreferenceOption<PosturePerception>[] = [
  { value: "chiusa", label: "Piuttosto chiusa", description: "Mi sento spesso raccolta, rigida o spinta in avanti." },
  { value: "variabile", label: "Variabile", description: "Dipende molto dai periodi o dalle giornate." },
  { value: "abbastanza_buona", label: "Abbastanza buona", description: "Nel complesso mi sento abbastanza allineata." }
];

export const mobilityPerceptionOptions: PreferenceOption<MobilityPerception>[] = [
  { value: "rigida", label: "Rigida", description: "Mi sento limitata in diversi movimenti base." },
  { value: "media", label: "Media", description: "Ho margine, ma alcuni gesti non scorrono bene." },
  { value: "buona", label: "Buona", description: "Mi sento discretamente fluida nei movimenti." }
];

export const coordinationOptions: PreferenceOption<CoordinationLevel>[] = [
  { value: "incerta", label: "Incerta", description: "A volte faccio fatica a coordinare bene il gesto." },
  { value: "discreta", label: "Discreta", description: "Mi oriento abbastanza, con qualche incertezza." },
  { value: "buona", label: "Buona", description: "Mi sento abbastanza sicura nel coordinare il movimento." }
];

export const sensitivityOptions: MultiPreferenceOption<SensitivityTag>[] = [
  { value: "addome", label: "Addome", description: "Preferisco cautela nella pressione addominale." },
  { value: "pavimento_pelvico", label: "Pavimento pelvico", description: "Mi aiuta un approccio più protetto e controllato." },
  { value: "schiena", label: "Schiena", description: "Meglio ampiezze stabili e progressive." },
  { value: "ginocchia", label: "Ginocchia", description: "Mi sento meglio con piegamenti molto dosati." },
  { value: "anche", label: "Anche", description: "Preferisco movimenti graduali sul bacino e sulle anche." }
];

export const diastasisOptions: PreferenceOption<DiastasisStatus>[] = [
  { value: "no", label: "No", description: "Non mi è mai stata segnalata." },
  { value: "forse", label: "Forse o dubbia", description: "Ho il dubbio, ma senza conferma certa." },
  { value: "gia_nota", label: "Già nota", description: "Mi è già stata riferita o confermata." }
];

export const pelvicSignalOptions: MultiPreferenceOption<PelvicSignal>[] = [
  { value: "incontinenza_sotto_sforzo", label: "Piccole perdite sotto sforzo", description: "Per esempio con colpi di tosse o sforzi." },
  { value: "senso_di_peso_pelvico", label: "Senso di peso pelvico", description: "Una sensazione da tenere presente nel piano." }
];

export const bodyConfidenceOptions: PreferenceOption<BodyConfidence>[] = [
  { value: "bassa", label: "Bassa", description: "Faccio fatica a fidarmi del mio corpo nel movimento." },
  { value: "variabile", label: "Variabile", description: "Dipende dai periodi e da come mi sento." },
  { value: "buona", label: "Buona", description: "Nel complesso mi sento abbastanza in confidenza." }
];

export const dropoutReasonOptions: MultiPreferenceOption<DropoutReason>[] = [
  { value: "stanchezza", label: "Stanchezza", description: "Spesso mollo per energia troppo bassa." },
  { value: "noia", label: "Noia", description: "Mi spengo se il percorso mi sembra ripetitivo." },
  { value: "mancanza_tempo", label: "Mancanza di tempo", description: "Le settimane piene mi fanno saltare il ritmo." },
  { value: "dolore", label: "Fastidi o dolore", description: "Mi fermo quando qualcosa non mi convince." },
  { value: "scarsa_fiducia", label: "Scarsa fiducia", description: "A volte penso di non riuscire a reggere la costanza." }
];

export const nutritionPatternOptions: PreferenceOption<NutritionPattern>[] = [
  { value: "disordinata", label: "Piuttosto disordinata", description: "I pasti non seguono spesso un ritmo regolare." },
  { value: "abbastanza_equilibrata", label: "Abbastanza equilibrata", description: "Nel complesso me la cavo, anche se non sempre bene." },
  { value: "molto_curata", label: "Molto curata", description: "Presto già attenzione costante all'alimentazione." }
];

export const hydrationPatternOptions: PreferenceOption<HydrationPattern>[] = [
  { value: "bassa", label: "Scarsa", description: "Bevo poco durante la giornata." },
  { value: "altalenante", label: "Altalenante", description: "Ci sono giorni buoni e giorni in cui dimentico." },
  { value: "buona", label: "Buona", description: "Riesco a bere con una certa regolarità." }
];

export const trainingPreferenceOptions: PreferenceOption<TrainingPreference>[] = [
  { value: "piu_dolce", label: "Più dolce", description: "Mi sento meglio con un tono tranquillo e progressivo." },
  { value: "piu_tonificante", label: "Più tonificante", description: "Vorrei sentire un po' più di lavoro muscolare." },
  { value: "piu_posturale", label: "Più posturale", description: "Mi interessa soprattutto migliorare appoggio e assetto." },
  { value: "piu_energizzante", label: "Più energizzante", description: "Vorrei uscire dalle sessioni sentendomi più attiva." }
];

export const reassessmentFitOptions: PreferenceOption<ReassessmentFit>[] = [
  { value: "troppo_facile", label: "Troppo facile", description: "Posso reggere qualcosa in più." },
  { value: "giusto", label: "Giusto", description: "Il ritmo attuale mi sembra equilibrato." },
  { value: "troppo_difficile", label: "Troppo difficile", description: "Serve alleggerire o ridistribuire meglio." }
];

export const obstacleOptions: PreferenceOption<ObstacleTag>[] = [
  { value: "stanchezza", label: "Stanchezza", description: "L'energia bassa è l'ostacolo principale adesso." },
  { value: "mancanza_tempo", label: "Mancanza di tempo", description: "Fatico a ritagliarmi spazio con continuità." },
  { value: "scarsa_costanza", label: "Costanza fragile", description: "Mi perdo facilmente nel ritmo delle settimane." },
  { value: "fastidi", label: "Fastidi da monitorare", description: "Alcuni segnali del corpo mi frenano." },
  { value: "noia", label: "Noia", description: "Rischio di mollare se il percorso mi spegne." },
  { value: "fiducia_bassa", label: "Poca fiducia", description: "Mi serve sentire più sicurezza nel fatto che posso riuscirci." }
];

export const improvementOptions: MultiPreferenceOption<ImprovementTag>[] = [
  { value: "tono_generale", label: "Tono generale", description: "Sento il corpo un po' più presente nel complesso." },
  { value: "glutei_gambe", label: "Glutei e gambe", description: "Percepisco un miglioramento nella parte bassa." },
  { value: "postura", label: "Postura", description: "Mi sento più aperta o meno chiusa." },
  { value: "core", label: "Addome profondo e stabilità", description: "Sento più controllo nel centro del corpo." },
  { value: "energia", label: "Energia", description: "Sto un po' meglio anche nella giornata." }
];

export const categoryMeta: Record<CategoryId, { title: string; description: string; accent: string }> = {
  glutei_gambe: { title: "Glutei e gambe", description: "Per dare tono, sostegno e stabilità alla parte inferiore.", accent: "bg-[rgba(94,184,178,0.12)]" },
  core_pancia_profonda: { title: "Addome profondo e stabilità", description: "Per sentire il centro più presente senza forzare.", accent: "bg-[rgba(117,194,187,0.12)]" },
  postura: { title: "Postura", description: "Per alleggerire rigidità e ritrovare un assetto più aperto.", accent: "bg-[rgba(126,177,188,0.11)]" },
  total_body_leggero: { title: "Tonificazione generale leggera", description: "Per un lavoro completo, lineare e facile da seguire.", accent: "bg-[rgba(140,203,197,0.11)]" },
  mobilita_recupero: { title: "Mobilità e recupero", description: "Piccoli movimenti per sciogliere e recuperare bene.", accent: "bg-[rgba(229,247,245,0.92)]" },
  ripartenza_dolce: { title: "Ripartenza dolce", description: "Per tornare a muoversi con semplicità e fiducia.", accent: "bg-[rgba(239,252,250,0.95)]" }
};

export const goalLabels: Record<Goal, string> = {
  glutei_gambe: "Glutei e gambe",
  pancia_core: "Addome profondo e stabilità",
  postura: "Postura",
  tonicita_generale: "Tonicità generale",
  ripartenza_dolce: "Ripartenza dolce"
};

export const primaryBodyGoalLabels: Record<PrimaryBodyGoal, string> = {
  dimagrire: "Dimagrire",
  massa_muscolare: "Aumentare massa muscolare",
  tonicita_rassodare: "Aumentare tonicità e rassodare",
  aumentare_peso_sano: "Aumentare di peso in modo sano",
  ricomposizione_corporea: "Ricomposizione corporea"
};

export const secondaryObjectiveLabels: Record<SecondaryObjective, string> = {
  glutei_piu_sodi: "Glutei più sodi",
  gambe_piu_toniche: "Gambe più toniche",
  addome_piu_stabile: "Addome più stabile",
  postura_migliore: "Postura migliore",
  piu_energia: "Più energia",
  meno_flaccidita: "Sentirti meno flaccida",
  piu_forza: "Sentirti più forte",
  maggiore_costanza: "Maggiore costanza",
  ridurre_rigidita: "Ridurre rigidità",
  migliorare_mobilita: "Migliorare mobilità"
};

export const focusAreaLabels: Record<FocusArea, string> = {
  glutei: "Glutei",
  gambe: "Gambe",
  addome_core: "Addome profondo e stabilità",
  postura: "Postura",
  braccia: "Braccia",
  total_body: "Tonificazione generale"
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

export const timePreferenceLabels: Record<TimePreference, string> = {
  mattina: "Mattina",
  pausa_pranzo: "Pausa pranzo",
  pomeriggio: "Pomeriggio",
  sera: "Sera",
  variabile: "Variabile"
};

export const weeklyAvailabilityLabels: Record<WeeklyAvailability, string> = {
  molto_variabile: "Molto variabile",
  alcuni_spazi: "Alcuni spazi",
  abbastanza_stabile: "Abbastanza stabile"
};

export const lifestyleLabels: Record<LifestyleType, string> = {
  molto_sedentaria: "Molto sedentaria",
  abbastanza_attiva: "Abbastanza attiva",
  molto_in_movimento: "Molto in movimento"
};

export const pastExperienceLabels: Record<PastTrainingExperience, string> = {
  mai_costante: "Mai davvero costante",
  qualche_fase: "Qualche fase in passato",
  abbastanza_regolare: "Abbastanza regolare"
};

export const sleepQualityLabels: Record<SleepQuality, string> = {
  bassa: "Fragile",
  discontinua: "Discontinua",
  abbastanza_buona: "Abbastanza buona",
  buona: "Buona"
};

export const stressLabels: Record<StressLevel, string> = {
  alto: "Molto alto",
  medio_alto: "Piuttosto alto",
  medio: "Medio",
  gestibile: "Gestibile"
};

export const consistencyMessages = [
  "La costanza conta più di una seduta perfetta.",
  "Anche pochi minuti ben scelti cambiano il modo in cui ti senti.",
  "Il tono arriva più facilmente quando il ritmo resta realistico.",
  "Allenarti a casa può diventare semplice, se la routine ti somiglia."
];

export const horizonMessages = [
  "Stai costruendo base e controllo, non intensità.",
  "Stai consolidando il tono prima di chiedere di più al corpo.",
  "Stai creando una routine che può restare con te, non un picco da inseguire."
];

export const safetyNotes = [
  "Interrompi il movimento in caso di dolore.",
  "Se avverti fastidi addominali o pelvici, riduci o sospendi l'esercizio.",
  "In presenza di dubbi o situazioni particolari, confrontati con un professionista qualificato."
];




