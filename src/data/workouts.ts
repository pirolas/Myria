import type { Exercise, Program } from "@/types/domain";

export const exercises: Exercise[] = [
  {
    id: "ponte-glutei",
    name: "Ponte glutei",
    description:
      "Un esercizio chiaro e molto utile per attivare glutei e parte posteriore delle gambe senza impatto.",
    category: "glutei_gambe",
    bodyArea: "Glutei, retro coscia, bacino",
    benefit: "Aiuta a sentire meglio i glutei e a dare più sostegno al bacino.",
    steps: [
      "Sdraiati con ginocchia piegate e piedi appoggiati alla larghezza del bacino.",
      "Spingi bene i piedi nel pavimento e solleva il bacino con un gesto lento.",
      "Fermati un attimo in alto e scendi piano mantenendo il controllo."
    ],
    commonMistakes: [
      "Spingere il movimento con la schiena invece che con i glutei.",
      "Lasciare che le ginocchia si aprano o si chiudano troppo.",
      "Scendere di colpo senza controllo."
    ],
    easierVariant: "Solleva il bacino di poco e tieni la pausa in alto molto breve.",
    intenseVariant: "Aggiungi una pausa di 3 secondi in alto.",
    dose: "10-14 ripetizioni lente",
    caution:
      "Se senti pressione nella zona lombare, riduci l'ampiezza e concentrati sui glutei."
  },
  {
    id: "squat-alla-sedia",
    name: "Squat alla sedia",
    description:
      "Uno squat guidato dalla sedia per rinforzare gambe e glutei in modo semplice e sicuro.",
    category: "glutei_gambe",
    bodyArea: "Cosce, glutei, stabilità",
    benefit: "Aiuta a costruire tono e sicurezza nei piegamenti di tutti i giorni.",
    steps: [
      "Mettiti in piedi davanti a una sedia con i piedi poco più larghi delle anche.",
      "Porta il bacino indietro come per cercare la sedia, tenendo il petto aperto.",
      "Sfiora la sedia e torna in piedi spingendo bene sui piedi."
    ],
    commonMistakes: [
      "Scendere troppo in fretta.",
      "Portare il busto troppo in avanti.",
      "Lasciare che le ginocchia vadano verso l'interno."
    ],
    easierVariant: "Scendi meno e usa la sedia come riferimento visivo e di sicurezza.",
    intenseVariant: "Aggiungi una piccola pausa appena sopra la sedia.",
    dose: "8-12 ripetizioni controllate"
  },
  {
    id: "wall-sit",
    name: "Wall sit",
    description:
      "Una tenuta al muro utile per sentire bene cosce e glutei con un gesto molto lineare.",
    category: "glutei_gambe",
    bodyArea: "Cosce, glutei, resistenza",
    benefit: "Dà tono e resistenza alle gambe senza bisogno di impatto o velocità.",
    steps: [
      "Appoggia la schiena al muro e porta i piedi un po' avanti.",
      "Scivola verso il basso fino a una seduta comoda e sostenibile.",
      "Respira in modo regolare e poi risali lentamente."
    ],
    commonMistakes: [
      "Scendere troppo se manca controllo.",
      "Trattenere il respiro.",
      "Portare il peso solo sulle punte."
    ],
    easierVariant: "Resta più in alto e tieni la posizione per meno secondi.",
    intenseVariant: "Aumenta di qualche secondo la tenuta.",
    dose: "20-40 secondi"
  },
  {
    id: "slanci-laterali-in-piedi",
    name: "Slanci laterali in piedi",
    description:
      "Un movimento semplice per lavorare sul lato del gluteo e sulla stabilità del bacino.",
    category: "glutei_gambe",
    bodyArea: "Gluteo medio, anche, equilibrio",
    benefit: "Aiuta a sentire più sostegno laterale nel bacino e più controllo in appoggio.",
    steps: [
      "Mettiti in piedi vicino a un appoggio leggero.",
      "Apri una gamba lateralmente senza inclinare il busto.",
      "Torna lentamente al centro mantenendo il piede attivo."
    ],
    commonMistakes: [
      "Muovere il busto più della gamba.",
      "Fare uno slancio troppo veloce.",
      "Chiudere il petto e le spalle."
    ],
    easierVariant: "Riduci l'ampiezza del gesto e tieni sempre una mano in appoggio.",
    intenseVariant: "Aggiungi una breve pausa nella massima apertura.",
    dose: "10 ripetizioni per lato"
  },
  {
    id: "affondo-assistito-indietro",
    name: "Affondo assistito indietro",
    description:
      "Un affondo dolce con appoggio, utile per gambe e glutei senza perdere sicurezza.",
    category: "glutei_gambe",
    bodyArea: "Glutei, cosce, equilibrio",
    benefit: "Rinforza in modo graduale e aiuta anche a migliorare coordinazione e stabilità.",
    steps: [
      "Tieni una mano su una parete o su una sedia.",
      "Porta una gamba indietro e piega leggermente entrambe le ginocchia.",
      "Spingi sul piede davanti per tornare al centro con controllo."
    ],
    commonMistakes: [
      "Fare passi troppo lunghi.",
      "Perdere l'allineamento del busto.",
      "Scendere oltre il proprio controllo."
    ],
    easierVariant: "Riduci molto la profondità del piegamento.",
    intenseVariant: "Aggiungi una pausa di 2 secondi nel punto più basso che senti stabile.",
    dose: "8 ripetizioni per lato"
  },
  {
    id: "bird-dog",
    name: "Bird dog",
    description:
      "Un esercizio preciso e controllato per coordinare addome profondo, schiena e glutei.",
    category: "core_pancia_profonda",
    bodyArea: "Core, schiena, glutei",
    benefit: "Aiuta a migliorare controllo, postura e stabilità senza impatto.",
    steps: [
      "Posizionati a quattro appoggi con mani sotto le spalle e ginocchia sotto il bacino.",
      "Allunga lentamente una gamba dietro e il braccio opposto avanti.",
      "Rientra senza perdere l'assetto e poi cambia lato."
    ],
    commonMistakes: [
      "Inarcare troppo la schiena.",
      "Muoversi con fretta.",
      "Ruotare il bacino lateralmente."
    ],
    easierVariant: "Muovi solo la gamba o solo il braccio.",
    intenseVariant: "Aggiungi una pausa di 2 secondi nell'allungo.",
    dose: "6-8 ripetizioni per lato",
    caution:
      "Se senti instabilità addominale, riduci l'ampiezza del movimento."
  },
  {
    id: "heel-slides",
    name: "Scivolamenti dei talloni",
    description:
      "Un esercizio molto delicato per ritrovare controllo addominale e stabilità del bacino.",
    category: "core_pancia_profonda",
    bodyArea: "Addome profondo, bacino",
    benefit: "Ottimo per preparare il centro del corpo senza irrigidire collo e spalle.",
    steps: [
      "Sdraiati con ginocchia piegate e piedi a terra.",
      "Espira e fai scivolare lentamente un tallone in avanti.",
      "Torna al punto di partenza senza perdere il controllo del bacino."
    ],
    commonMistakes: [
      "Lasciare che il ventre spinga in fuori durante il movimento.",
      "Muovere il bacino avanti e indietro.",
      "Usare troppa velocità."
    ],
    easierVariant: "Scivola solo di pochi centimetri.",
    intenseVariant: "Allunga quasi del tutto la gamba se senti di restare stabile.",
    dose: "8 ripetizioni per lato"
  },
  {
    id: "dead-bug-semplificato",
    name: "Dead bug semplificato",
    description:
      "Una versione accessibile di un classico per il controllo del core.",
    category: "core_pancia_profonda",
    bodyArea: "Core, respiro, coordinazione",
    benefit: "Aiuta a dare più sostegno al centro con movimenti piccoli e puliti.",
    steps: [
      "Sdraiati e trova una posizione comoda per gambe e bacino.",
      "Espira e abbassa lentamente un tallone verso terra.",
      "Torna su con calma e alterna con l'altro lato."
    ],
    commonMistakes: [
      "Perdere il controllo del tronco.",
      "Muovere le gambe in modo brusco.",
      "Tirare il collo in avanti."
    ],
    easierVariant: "Lavora con un piede sempre appoggiato a terra.",
    intenseVariant: "Aggiungi anche il movimento alternato delle braccia.",
    dose: "6-10 ripetizioni per lato",
    caution:
      "Se senti pressione addominale o lombare, torna subito alla variante più facile."
  },
  {
    id: "ponte-con-marcia",
    name: "Ponte con marcia",
    description:
      "Una progressione del ponte glutei per aumentare stabilità e controllo.",
    category: "core_pancia_profonda",
    bodyArea: "Glutei, addome profondo, stabilità",
    benefit: "Unisce tono e controllo del bacino senza movimenti bruschi.",
    steps: [
      "Parti dal ponte glutei in posizione alta ma comoda.",
      "Solleva un piede di poco da terra senza spostare il bacino.",
      "Riappoggia e alterna lentamente."
    ],
    commonMistakes: [
      "Oscillare troppo con il bacino.",
      "Salire oltre il proprio controllo.",
      "Trattenere il respiro."
    ],
    easierVariant: "Resta nel ponte statico senza fare la marcia.",
    intenseVariant: "Allunga il tempo di tenuta in alto tra un cambio e l'altro.",
    dose: "6 marce per lato"
  },
  {
    id: "sollevamenti-polpacci",
    name: "Sollevamenti polpacci",
    description:
      "Un gesto semplice per caviglie, polpacci e sostegno della gamba.",
    category: "total_body_leggero",
    bodyArea: "Polpacci, caviglie, appoggio",
    benefit: "Aiuta a sentire la gamba più reattiva e stabile.",
    steps: [
      "Mettiti in piedi con una mano in appoggio leggero.",
      "Sali sulle punte senza spingerti in avanti.",
      "Scendi lentamente e ripeti mantenendo il busto alto."
    ],
    commonMistakes: [
      "Scendere troppo velocemente.",
      "Bloccare le ginocchia.",
      "Lasciare cedere le caviglie verso l'esterno."
    ],
    easierVariant: "Riduci l'ampiezza del sollevamento.",
    intenseVariant: "Aggiungi una breve tenuta sulla punta.",
    dose: "12-16 ripetizioni"
  },
  {
    id: "side-leg-lifts",
    name: "Sollevamenti laterali da terra",
    description:
      "Da sdraiata su un fianco, lavori sul lato del gluteo con un gesto molto preciso.",
    category: "glutei_gambe",
    bodyArea: "Gluteo laterale, anca, fianco",
    benefit: "Aiuta a sentire il lavoro sul lato del corpo in modo chiaro e controllato.",
    steps: [
      "Sdraiati su un fianco con testa sostenuta e bacino allineato.",
      "Solleva la gamba sopra lentamente senza ruotare il bacino.",
      "Scendi con controllo e ripeti mantenendo il fianco lungo."
    ],
    commonMistakes: [
      "Ruotare il piede verso l'alto.",
      "Dondolare con il bacino.",
      "Usare slancio invece di controllo."
    ],
    easierVariant: "Riduci l'altezza del sollevamento.",
    intenseVariant: "Aggiungi una piccola pausa in alto.",
    dose: "10-12 ripetizioni per lato"
  },
  {
    id: "respirazione-addominale-profonda",
    name: "Respirazione con attivazione addominale profonda",
    description:
      "Una base concreta per ritrovare respiro, sostegno e presenza nel centro del corpo.",
    category: "ripartenza_dolce",
    bodyArea: "Respiro, addome profondo, pavimento pelvico",
    benefit: "Prepara il corpo ai movimenti successivi e rende più chiaro il lavoro del core.",
    steps: [
      "Sdraiati o siediti comoda con il busto lungo.",
      "Inspira lateralmente nelle costole.",
      "Espira lentamente e senti una lieve attivazione nella parte bassa dell'addome."
    ],
    commonMistakes: [
      "Stringere troppo l'addome.",
      "Sollevare le spalle durante l'inspirazione.",
      "Forzare il respiro."
    ],
    easierVariant: "Eseguila da seduta con una mano sulle costole.",
    intenseVariant: "Abbinala a un lieve sollevamento del bacino solo se il gesto resta morbido.",
    dose: "5-6 respiri lenti",
    caution:
      "Se il respiro diventa teso o senti fastidio pelvico, fermati e riparti più dolcemente."
  },
  {
    id: "mobilita-bacino-colonna",
    name: "Mobilità bacino e colonna",
    description:
      "Un movimento fluido per sciogliere la parte bassa della schiena e risvegliare il bacino.",
    category: "mobilita_recupero",
    bodyArea: "Colonna, bacino, respiro",
    benefit: "Aiuta a ritrovare mobilità e comfort nei passaggi quotidiani.",
    steps: [
      "Sdraiati o siediti in una posizione comoda.",
      "Alterna una leggera retroversione e un leggero ritorno neutro del bacino.",
      "Coordina il movimento con un respiro lento e regolare."
    ],
    commonMistakes: [
      "Fare movimenti troppo ampi.",
      "Irrigidire collo e spalle.",
      "Correre invece di sentire il gesto."
    ],
    easierVariant: "Riduci l'escursione e pensa a un piccolo dondolio.",
    intenseVariant: "Aggiungi una breve pausa di percezione nei due punti più comodi del gesto.",
    dose: "60 secondi lenti"
  },
  {
    id: "scapole-al-muro",
    name: "Scapole al muro",
    description:
      "Un esercizio posturale semplice per aprire il torace e sentire meglio la schiena alta.",
    category: "postura",
    bodyArea: "Schiena alta, spalle, petto",
    benefit: "Aiuta a ridurre la sensazione di chiusura davanti al busto.",
    steps: [
      "Appoggiati al muro con schiena e testa in contatto, se comodo.",
      "Piega i gomiti e fai scorrere lentamente le braccia verso l'alto e verso il basso.",
      "Mantieni il collo morbido e il petto aperto."
    ],
    commonMistakes: [
      "Sollevare le spalle verso le orecchie.",
      "Inarcare troppo la zona lombare.",
      "Muoversi con scatti."
    ],
    easierVariant: "Riduci l'altezza del movimento delle braccia.",
    intenseVariant: "Aggiungi una breve tenuta nel punto più alto che senti comodo.",
    dose: "8 ripetizioni lente"
  },
  {
    id: "allungamento-petto-parete",
    name: "Apertura del petto alla parete",
    description:
      "Un'apertura dolce per il torace, utile dopo giornate sedute o spalle chiuse.",
    category: "postura",
    bodyArea: "Petto, spalle, respirazione",
    benefit: "Dà una sensazione immediata di più spazio nella parte alta del corpo.",
    steps: [
      "Appoggia l'avambraccio a una parete o a uno stipite.",
      "Ruota lentamente il busto nella direzione opposta finché senti un'apertura leggera.",
      "Respira con calma e poi cambia lato."
    ],
    commonMistakes: [
      "Forzare troppo l'allungamento.",
      "Bloccare il respiro.",
      "Stringere la spalla verso il collo."
    ],
    easierVariant: "Riduci l'angolo del gomito e l'ampiezza della rotazione.",
    intenseVariant: "Allunga il tempo di permanenza di qualche respiro.",
    dose: "3 respiri lenti per lato"
  }
];

export const programs: Program[] = [
  {
    id: "10-minuti-dolci",
    title: "10 minuti dolci",
    durationMinutes: 10,
    category: "ripartenza_dolce",
    focus: "Ripartenza, respiro e tono leggero",
    description:
      "Una sequenza breve e rassicurante per rimettere il corpo in moto senza fatica inutile.",
    frequency: "Ideale 2-4 volte a settimana",
    levelLabel: "Molto delicato",
    idealFor: [
      "Giornate piene o poca energia",
      "Ripartenza dopo un periodo fermo",
      "Bisogno di tornare a muoversi con calma"
    ],
    exerciseIds: [
      "respirazione-addominale-profonda",
      "heel-slides",
      "ponte-glutei",
      "mobilita-bacino-colonna",
      "allungamento-petto-parete"
    ]
  },
  {
    id: "15-minuti-tonificazione-base",
    title: "15 minuti tonificazione base",
    durationMinutes: 15,
    category: "total_body_leggero",
    focus: "Tono generale e continuità",
    description:
      "Una routine semplice per attivare bene gambe, glutei, core e postura senza sentirti travolta.",
    frequency: "Ideale 3 volte a settimana",
    levelLabel: "Base sostenibile",
    idealFor: [
      "Creare un'abitudine chiara",
      "Sentire il corpo più presente",
      "Lavorare sulla tonicità generale"
    ],
    exerciseIds: [
      "squat-alla-sedia",
      "ponte-glutei",
      "bird-dog",
      "sollevamenti-polpacci",
      "scapole-al-muro"
    ]
  },
  {
    id: "20-minuti-glutei-gambe",
    title: "20 minuti glutei e gambe",
    durationMinutes: 20,
    category: "glutei_gambe",
    focus: "Glutei attivi, gambe più toniche e stabili",
    description:
      "Un percorso mirato per la parte inferiore con movimenti accessibili ma molto utili.",
    frequency: "Ideale 2-3 volte a settimana",
    levelLabel: "Base attiva",
    idealFor: [
      "Dare tono a glutei e gambe",
      "Migliorare stabilità e appoggio",
      "Allenarti a casa senza attrezzi"
    ],
    exerciseIds: [
      "ponte-glutei",
      "squat-alla-sedia",
      "wall-sit",
      "affondo-assistito-indietro",
      "slanci-laterali-in-piedi",
      "side-leg-lifts"
    ]
  },
  {
    id: "20-minuti-core-postura",
    title: "20 minuti core e postura",
    durationMinutes: 20,
    category: "core_pancia_profonda",
    focus: "Centro più presente e postura più aperta",
    description:
      "Una sequenza controllata per addome profondo, bacino, schiena e parte alta del busto.",
    frequency: "Ideale 2-4 volte a settimana",
    levelLabel: "Controllo e sostegno",
    idealFor: [
      "Sentire il core più attivo",
      "Curare postura e stabilità",
      "Muoversi meglio anche fuori dall'allenamento"
    ],
    exerciseIds: [
      "respirazione-addominale-profonda",
      "heel-slides",
      "dead-bug-semplificato",
      "bird-dog",
      "ponte-con-marcia",
      "scapole-al-muro",
      "mobilita-bacino-colonna"
    ]
  },
  {
    id: "25-minuti-total-body-tonificante",
    title: "25 minuti total body tonificante",
    durationMinutes: 25,
    category: "total_body_leggero",
    focus: "Routine completa, lineare e tonificante",
    description:
      "Il percorso più completo: tutto il corpo, intensità moderata, sensazione di lavoro pieno ma sostenibile.",
    frequency: "Ideale 3 volte a settimana",
    levelLabel: "Completo ma gentile",
    idealFor: [
      "Allenamenti più completi",
      "Tonicità generale e postura",
      "Chi vuole una routine chiara da ripetere"
    ],
    exerciseIds: [
      "squat-alla-sedia",
      "ponte-glutei",
      "sollevamenti-polpacci",
      "bird-dog",
      "side-leg-lifts",
      "scapole-al-muro",
      "allungamento-petto-parete"
    ]
  }
];
