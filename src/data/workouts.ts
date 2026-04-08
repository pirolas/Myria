import type { Exercise, Program } from "@/types/domain";

export const exercises: Exercise[] = [
  {
    id: "ponte-glutei",
    name: "Ponte glutei",
    description:
      "Un classico dolce ed efficace per attivare glutei e parte posteriore delle gambe.",
    category: "glutei_gambe",
    bodyArea: "Glutei, retro coscia, bacino",
    benefit: "Aiuta a dare sostegno al bacino e a sentire meglio i glutei.",
    steps: [
      "Sdraiati con ginocchia piegate e piedi appoggiati alla larghezza del bacino.",
      "Espira, attiva leggermente l'addome e solleva il bacino senza irrigidire la schiena.",
      "Resta un attimo in alto e scendi lentamente mantenendo il controllo."
    ],
    commonMistakes: [
      "Spingere troppo con la schiena invece che con i glutei.",
      "Allargare o chiudere eccessivamente le ginocchia.",
      "Scendere di colpo senza controllo."
    ],
    easierVariant: "Solleva il bacino di poco, con una pausa più breve.",
    intenseVariant: "Aggiungi una tenuta di 3 secondi nella posizione alta.",
    dose: "10-14 ripetizioni lente",
    caution:
      "Se senti pressione lombare, riduci l'ampiezza e concentra il lavoro sui glutei."
  },
  {
    id: "squat-alla-sedia",
    name: "Squat alla sedia",
    description:
      "Uno squat guidato dalla sedia per rinforzare gambe e glutei in modo semplice.",
    category: "glutei_gambe",
    bodyArea: "Cosce, glutei, stabilità",
    benefit: "Aiuta a costruire tono e sicurezza nei piegamenti quotidiani.",
    steps: [
      "Mettiti in piedi davanti a una sedia con i piedi poco più larghi delle anche.",
      "Porta il bacino indietro come per sfiorare la sedia, tenendo il petto aperto.",
      "Spingi il pavimento via con i piedi e torna in piedi con calma."
    ],
    commonMistakes: [
      "Scendere troppo in fretta.",
      "Far crollare il busto in avanti.",
      "Chiudere le ginocchia verso l'interno."
    ],
    easierVariant: "Scendi solo fino a toccare appena la sedia.",
    intenseVariant: "Aggiungi una piccola pausa appena sopra la sedia.",
    dose: "8-12 ripetizioni controllate"
  },
  {
    id: "wall-sit",
    name: "Wall sit",
    description:
      "Tenuta isometrica al muro per sentire bene cosce e glutei senza impatto.",
    category: "glutei_gambe",
    bodyArea: "Cosce, glutei, resistenza",
    benefit: "Dà tono e stabilità con un esercizio essenziale.",
    steps: [
      "Appoggia la schiena al muro e scivola verso il basso fino a trovare una seduta comoda.",
      "Mantieni il peso distribuito su tutto il piede.",
      "Respira in modo regolare e risali lentamente."
    ],
    commonMistakes: [
      "Scendere troppo se manca controllo.",
      "Trattenere il respiro.",
      "Portare il peso solo sulle punte."
    ],
    easierVariant: "Mantieni una seduta più alta e una tenuta più breve.",
    intenseVariant: "Aumenta di qualche secondo la tenuta.",
    dose: "20-40 secondi"
  },
  {
    id: "slanci-laterali-in-piedi",
    name: "Slanci laterali in piedi",
    description:
      "Movimento semplice per lavorare sul lato del gluteo e sulla stabilità.",
    category: "glutei_gambe",
    bodyArea: "Gluteo medio, anche, equilibrio",
    benefit: "Utile per sentire più sostegno laterale nel bacino.",
    steps: [
      "Mettiti in piedi vicino a un appoggio leggero.",
      "Allunga una gamba lateralmente senza inclinare il busto.",
      "Torna lentamente al centro mantenendo il piede attivo."
    ],
    commonMistakes: [
      "Muovere il busto più della gamba.",
      "Slanciare con troppa velocità.",
      "Chiudere le spalle."
    ],
    easierVariant: "Riduci l'ampiezza e tieni sempre una mano in appoggio.",
    intenseVariant: "Aggiungi una breve pausa alla massima apertura.",
    dose: "10 ripetizioni per lato"
  },
  {
    id: "affondo-assistito-indietro",
    name: "Affondo assistito indietro",
    description:
      "Affondo gentile con appoggio per gambe e glutei, più sicuro per chi riparte.",
    category: "glutei_gambe",
    bodyArea: "Glutei, cosce, equilibrio",
    benefit: "Rinforza in modo graduale anche coordinazione e stabilità.",
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
    easierVariant: "Riduci la profondità del piegamento.",
    intenseVariant: "Aggiungi una tenuta di 2 secondi nel punto basso.",
    dose: "8 ripetizioni per lato"
  },
  {
    id: "bird-dog",
    name: "Bird dog",
    description:
      "Un esercizio stabile e preciso per coordinare core profondo, schiena e glutei.",
    category: "core_pancia_profonda",
    bodyArea: "Core, schiena, glutei",
    benefit: "Aiuta a migliorare controllo e postura senza impatto.",
    steps: [
      "Posizionati a quattro appoggi con mani sotto le spalle e ginocchia sotto il bacino.",
      "Allunga lentamente una gamba dietro e il braccio opposto avanti.",
      "Rientra senza perdere l'assetto e cambia lato."
    ],
    commonMistakes: [
      "Inarcare troppo la schiena.",
      "Muoversi con fretta.",
      "Ruotare il bacino lateralmente."
    ],
    easierVariant: "Muovi solo la gamba o solo il braccio.",
    intenseVariant: "Aggiungi una pausa di 2 secondi in allungo.",
    dose: "6-8 ripetizioni per lato",
    caution:
      "Se senti instabilità addominale, riduci l'ampiezza del movimento."
  },
  {
    id: "heel-slides",
    name: "Heel slides",
    description:
      "Scivolamenti dei talloni per ritrovare controllo addominale in modo delicato.",
    category: "core_pancia_profonda",
    bodyArea: "Addome profondo, bacino",
    benefit: "Ottimo per un lavoro morbido sul centro senza irrigidire il collo.",
    steps: [
      "Sdraiati con ginocchia piegate e piedi a terra.",
      "Espira, senti l'addome attivo e fai scivolare lentamente un tallone in avanti.",
      "Ritorna al punto di partenza senza perdere il controllo del bacino."
    ],
    commonMistakes: [
      "Spingere la pancia in fuori durante il movimento.",
      "Muovere il bacino avanti e indietro.",
      "Usare troppa velocità."
    ],
    easierVariant: "Scivola solo di pochi centimetri.",
    intenseVariant: "Allunga completamente la gamba mantenendo il controllo.",
    dose: "8 ripetizioni per lato"
  },
  {
    id: "dead-bug-semplificato",
    name: "Dead bug semplificato",
    description:
      "Versione accessibile di un grande classico per il controllo del core.",
    category: "core_pancia_profonda",
    bodyArea: "Core, respiro, coordinazione",
    benefit: "Aiuta a dare sostegno al centro con movimenti piccoli e puliti.",
    steps: [
      "Sdraiati e solleva una gamba alla volta in posizione da tavolino, se comodo.",
      "Espira e abbassa lentamente un tallone verso terra mantenendo il bacino stabile.",
      "Torna su e alterna con calma."
    ],
    commonMistakes: [
      "Perdere il contatto stabile del tronco.",
      "Muovere bruscamente le gambe.",
      "Tirare il collo in avanti."
    ],
    easierVariant: "Lavora con un piede sempre appoggiato a terra.",
    intenseVariant: "Aggiungi il movimento alternato delle braccia.",
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
      "Appoggia e ripeti con l'altro lato alternando lentamente."
    ],
    commonMistakes: [
      "Oscillare troppo con il bacino.",
      "Salire oltre il proprio controllo.",
      "Trattenere il respiro."
    ],
    easierVariant: "Resta nel ponte statico senza marcia.",
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
      "Sali sulle punte con controllo, senza spingerti in avanti.",
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
    name: "Side leg lifts",
    description:
      "Slanci laterali da terra per lavorare gluteo laterale e stabilità del bacino.",
    category: "glutei_gambe",
    bodyArea: "Gluteo laterale, anca, fianco",
    benefit: "Aiuta a sentire il lavoro sul lato del corpo in modo preciso.",
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
      "Una base delicata per ritrovare respiro, sostegno e presenza nel centro.",
    category: "ripartenza_dolce",
    bodyArea: "Respiro, addome profondo, pavimento pelvico",
    benefit: "Rende più consapevole il lavoro del core senza spingere.",
    steps: [
      "Sdraiati o siediti comoda con il busto lungo.",
      "Inspira lateralmente nelle costole, poi espira lentamente come per appannare un vetro.",
      "Alla fine dell'espirazione senti una lieve attivazione del basso addome."
    ],
    commonMistakes: [
      "Stringere troppo l'addome.",
      "Sollevare le spalle durante l'inspirazione.",
      "Forzare il respiro."
    ],
    easierVariant: "Eseguila da seduta con una mano sulle costole.",
    intenseVariant: "Abbinala a un lieve sollevamento del bacino.",
    dose: "5-6 respiri lenti",
    caution:
      "Se il respiro diventa teso o senti fastidio pelvico, fermati e riparti più dolcemente."
  },
  {
    id: "mobilita-bacino-colonna",
    name: "Mobilità bacino e colonna",
    description:
      "Movimento fluido per sciogliere la parte bassa della schiena e risvegliare il bacino.",
    category: "mobilita_recupero",
    bodyArea: "Colonna, bacino, respiro",
    benefit: "Aiuta a ritrovare mobilità e comfort nei passaggi quotidiani.",
    steps: [
      "Sdraiati o siediti in posizione comoda.",
      "Alterna una leggera retroversione e un leggero ritorno neutro del bacino.",
      "Coordina il movimento con un respiro lento e regolare."
    ],
    commonMistakes: [
      "Fare movimenti troppo ampi.",
      "Irrigidire collo e spalle.",
      "Correre invece di sentire il gesto."
    ],
    easierVariant: "Riduci l'escursione e pensa solo a un piccolo dondolio.",
    intenseVariant: "Aggiungi una pausa di percezione nei due estremi comodi.",
    dose: "60 secondi lenti"
  },
  {
    id: "scapole-al-muro",
    name: "Scapole al muro",
    description:
      "Un esercizio di postura semplice per aprire il torace e sentire meglio la parte alta della schiena.",
    category: "postura",
    bodyArea: "Schiena alta, spalle, petto",
    benefit: "Aiuta a ridurre la sensazione di chiusura davanti al busto.",
    steps: [
      "Appoggiati al muro con schiena e testa in contatto, se comodo.",
      "Piega i gomiti e fai scorrere lentamente le braccia verso l'alto e verso il basso.",
      "Mantieni collo morbido e petto aperto senza irrigidirti."
    ],
    commonMistakes: [
      "Sollevare le spalle verso le orecchie.",
      "Inarcare troppo la zona lombare.",
      "Muoversi con scatti."
    ],
    easierVariant: "Riduci l'altezza del movimento delle braccia.",
    intenseVariant: "Aggiungi una breve tenuta nel punto più alto confortevole.",
    dose: "8 ripetizioni lente"
  },
  {
    id: "allungamento-petto-parete",
    name: "Apertura del petto alla parete",
    description:
      "Un'apertura gentile per il torace dopo giornate sedute o spalle chiuse.",
    category: "postura",
    bodyArea: "Petto, spalle, respirazione",
    benefit: "Dà una sensazione immediata di spazio nella parte alta del corpo.",
    steps: [
      "Appoggia l'avambraccio a una parete o a uno stipite.",
      "Ruota lentamente il busto nella direzione opposta finché senti un'apertura leggera.",
      "Respira con calma e cambia lato."
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
      "Lavorare su tonicità generale"
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
      "Il percorso più completo dell'MVP: tutto il corpo, intensità moderata, sensazione di lavoro pieno ma sostenibile.",
    frequency: "Ideale 3 volte a settimana",
    levelLabel: "Completo ma gentile",
    idealFor: [
      "Allenamenti più completi",
      "Tonicità generale e postura",
      "Chi vuole una routine da fare e rifare"
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
