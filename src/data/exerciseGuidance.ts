export interface ExerciseGuidanceEntry {
  summary: string;
  purpose: string;
  practicalWhy?: string;
  startingPosition: string;
  movementCue: string;
  returnCue: string;
  feelCue: string;
  steps: string[];
  attention: string[];
  easierOption: string;
  microTip: string;
  visual: {
    startLabel: string;
    moveLabel: string;
  };
}

export const exerciseGuidance: Record<string, ExerciseGuidanceEntry> = {
  "ponte-glutei": {
    summary: "Un esercizio semplice per sentire subito glutei e parte posteriore delle gambe.",
    purpose: "Serve a dare più tono a glutei e retro coscia e a sostenere meglio il bacino.",
    startingPosition:
      "Sdraiata a terra, ginocchia piegate, piedi appoggiati alla larghezza del bacino e braccia morbide lungo il corpo.",
    movementCue:
      "Spingi bene i piedi nel pavimento e solleva il bacino finché il corpo forma una linea comoda tra spalle, bacino e ginocchia.",
    returnCue: "Scendi lentamente, senza lasciarti cadere e senza perdere il controllo.",
    feelCue: "Dovresti sentire soprattutto i glutei. La schiena deve restare tranquilla.",
    steps: [
      "Sdraiati con piedi ben appoggiati e ginocchia piegate.",
      "Spingi i piedi a terra e alza il bacino con un gesto lento.",
      "Fermati un attimo in alto senza inarcare la schiena.",
      "Scendi piano e riparti solo quando senti di avere ancora controllo."
    ],
    attention: [
      "Non spingere il movimento con la schiena.",
      "Non allargare o chiudere troppo le ginocchia.",
      "Non scendere di colpo."
    ],
    easierOption: "Solleva il bacino di poco e tieni la pausa in alto molto breve.",
    microTip: "Immagina di stringere leggermente i glutei in alto, non di spingere il petto verso il soffitto.",
    visual: {
      startLabel: "Bacino appoggiato",
      moveLabel: "Solleva il bacino"
    }
  },
  "squat-alla-sedia": {
    summary: "Uno squat guidato dalla sedia, chiaro e sicuro anche se non ti alleni da tempo.",
    purpose: "Serve a dare tono a gambe e glutei e a rendere più sicuri i piegamenti quotidiani.",
    startingPosition:
      "In piedi davanti a una sedia, piedi poco più larghi delle anche e sguardo avanti.",
    movementCue:
      "Porta il bacino indietro come per sederti, sfiora la sedia e poi spingi sui piedi per tornare in piedi.",
    returnCue: "Risali con calma, senza slancio e senza chiudere le ginocchia verso l'interno.",
    feelCue: "Dovresti sentire il lavoro in cosce e glutei, con il peso distribuito su tutto il piede.",
    steps: [
      "Mettiti davanti alla sedia con piedi stabili e petto aperto.",
      "Porta il bacino indietro come per cercare la sedia.",
      "Sfiorala o toccala appena, senza crollare.",
      "Spingi il pavimento via con i piedi e torna su con controllo."
    ],
    attention: [
      "Non buttare il busto in avanti.",
      "Non scendere troppo in fretta.",
      "Non lasciare che le ginocchia collassino verso l'interno."
    ],
    easierOption: "Scendi meno e usa la sedia come riferimento per sentirti più sicura.",
    microTip: "Pensa prima al movimento del bacino: è quello che rende lo squat più stabile.",
    visual: {
      startLabel: "In piedi davanti alla sedia",
      moveLabel: "Scendi e risali"
    }
  },
  "wall-sit": {
    summary: "Una tenuta al muro lineare e concreta per cosce e glutei.",
    purpose: "Serve a dare resistenza alle gambe con un esercizio semplice e facile da controllare.",
    startingPosition:
      "Schiena appoggiata al muro, piedi un po' avanti e spalle rilassate.",
    movementCue:
      "Scivola in basso fino a una seduta sostenibile, come se stessi per sederti su una sedia immaginaria.",
    returnCue: "Resta il tempo previsto e poi risali lentamente lungo il muro.",
    feelCue: "Dovresti sentire soprattutto la parte anteriore delle cosce, con un sostegno leggero dei glutei.",
    steps: [
      "Appoggia schiena e bacino al muro.",
      "Porta i piedi un po' avanti.",
      "Scivola verso il basso fino a una seduta comoda.",
      "Mantieni il respiro regolare e poi risali piano."
    ],
    attention: [
      "Non cercare una discesa troppo profonda.",
      "Non trattenere il respiro.",
      "Non portare il peso solo sulle punte."
    ],
    easierOption: "Resta più in alto e riduci il tempo di tenuta.",
    microTip: "Meglio pochi secondi ben fatti che una tenuta lunga e rigida.",
    visual: {
      startLabel: "Schiena al muro",
      moveLabel: "Scivola in basso"
    }
  },
  "slanci-laterali-in-piedi": {
    summary: "Un movimento in piedi per attivare il lato del gluteo e stabilizzare il bacino.",
    purpose: "Serve a lavorare sul lato del gluteo, utile per stabilità, appoggio e tono.",
    startingPosition:
      "In piedi vicino a un appoggio leggero, busto lungo e gamba di sostegno ben stabile.",
    movementCue:
      "Apri lentamente una gamba verso l'esterno, senza inclinare il busto e senza ruotare il bacino.",
    returnCue: "Torna al centro con calma, mantenendo il controllo anche nella discesa.",
    feelCue: "Dovresti sentire il lato del gluteo della gamba che si muove e stabilità sulla gamba ferma.",
    steps: [
      "Trova un appoggio leggero e resta alta con il busto.",
      "Apri una gamba di lato con un gesto piccolo ma preciso.",
      "Evita di inclinarti o di usare slancio.",
      "Torna al centro piano e ripeti."
    ],
    attention: [
      "Non inclinare il busto per alzare di più la gamba.",
      "Non fare uno slancio veloce.",
      "Non chiudere le spalle."
    ],
    easierOption: "Riduci l'ampiezza del gesto e tieni sempre una mano in appoggio.",
    microTip: "Pochi centimetri fatti bene valgono più di un'apertura ampia e confusa.",
    visual: {
      startLabel: "Stai alta e stabile",
      moveLabel: "Apri la gamba di lato"
    }
  },
  "affondo-assistito-indietro": {
    summary: "Un affondo guidato con appoggio, utile per gambe e glutei senza perdere sicurezza.",
    purpose: "Serve a rinforzare glutei e gambe e a migliorare l'equilibrio in modo graduale.",
    startingPosition:
      "In piedi con una mano in appoggio, busto alto e piedi paralleli.",
    movementCue:
      "Porta una gamba indietro e piega entrambe le ginocchia di poco, tenendo il busto stabile.",
    returnCue: "Spingi sul piede davanti e torna al centro con un gesto controllato.",
    feelCue: "Dovresti sentire soprattutto gluteo e coscia della gamba davanti.",
    steps: [
      "Usa una parete o una sedia come appoggio leggero.",
      "Fai un piccolo passo indietro con una gamba.",
      "Scendi poco, fin dove riesci a controllare bene il movimento.",
      "Spingi sul piede davanti e torna in piedi."
    ],
    attention: [
      "Non fare un passo troppo lungo.",
      "Non crollare in avanti con il busto.",
      "Non scendere oltre il punto in cui ti senti stabile."
    ],
    easierOption: "Fai un passo più corto e limita molto la discesa.",
    microTip: "L'appoggio serve a darti sicurezza, non a trascinarti su e giù.",
    visual: {
      startLabel: "In piedi con appoggio",
      moveLabel: "Un passo indietro"
    }
  },
  "bird-dog": {
    summary: "Da quattro appoggi, unisci controllo del core, schiena lunga e stabilità.",
    purpose: "Serve a dare più controllo a addome profondo, schiena e glutei.",
    startingPosition:
      "A quattro appoggi, mani sotto le spalle, ginocchia sotto il bacino e collo lungo.",
    movementCue:
      "Allunga un braccio in avanti e la gamba opposta indietro senza spostare il bacino.",
    returnCue: "Torna al centro lentamente e cambia lato.",
    feelCue: "Dovresti sentire il centro del corpo attivo e la schiena lunga, non rigida.",
    steps: [
      "Mettiti a quattro appoggi con mani e ginocchia ben allineate.",
      "Allunga prima il braccio e la gamba opposta con calma.",
      "Tieni fermo il bacino e non cercare un allungo esagerato.",
      "Rientra piano e cambia lato."
    ],
    attention: [
      "Non inarcare la schiena.",
      "Non ruotare il bacino lateralmente.",
      "Non muoverti in fretta."
    ],
    easierOption: "Muovi solo la gamba o solo il braccio, mantenendo il resto fermo.",
    microTip: "Pensa ad allungarti in due direzioni, non ad alzare troppo gli arti.",
    visual: {
      startLabel: "Quattro appoggi stabili",
      moveLabel: "Allunga lato opposto"
    }
  },
  "heel-slides": {
    summary: "Scivolamenti dei talloni per ritrovare controllo addominale con un gesto molto delicato.",
    purpose: "Serve a sentire meglio addome profondo e bacino senza irrigidire il corpo.",
    practicalWhy:
      "Questo esercizio prepara il centro del corpo a lavorare meglio negli esercizi successivi, senza partire da movimenti troppo intensi.",
    startingPosition:
      "Sdraiata con ginocchia piegate, piedi a terra e bacino il più possibile fermo.",
    movementCue:
      "Fai scivolare lentamente un tallone in avanti mentre mantieni il tronco stabile.",
    returnCue: "Riporta il piede indietro con calma e ripeti dall'altro lato.",
    feelCue: "Dovresti sentire una lieve attivazione dell'addome profondo mentre il bacino resta quieto.",
    steps: [
      "Sdraiati con piedi appoggiati e collo morbido.",
      "Espira e fai scivolare un tallone in avanti lentamente.",
      "Mantieni fermo il bacino mentre la gamba si allunga.",
      "Torna piano e cambia lato."
    ],
    attention: [
      "Non lasciare che il ventre spinga in fuori.",
      "Non muovere il bacino avanti e indietro.",
      "Non accelerare il gesto."
    ],
    easierOption: "Scivola solo di pochi centimetri e rallenta ancora di più.",
    microTip: "Se senti che perdi controllo, accorcia il movimento: va benissimo così.",
    visual: {
      startLabel: "Piede appoggiato",
      moveLabel: "Tallone che scivola"
    }
  },
  "dead-bug-semplificato": {
    summary: "Una versione accessibile del dead bug per sentire il centro del corpo più stabile.",
    purpose: "Serve a migliorare controllo del core, coordinazione e stabilità del bacino.",
    startingPosition:
      "Sdraiata, con almeno un piede ben appoggiato a terra o entrambe le gambe in posizione comoda.",
    movementCue:
      "Abbassa lentamente un tallone verso il pavimento mantenendo il tronco fermo e il respiro regolare.",
    returnCue: "Riporta la gamba su senza fretta e poi cambia lato.",
    feelCue: "Dovresti sentire il centro attivo, non tensione nel collo o pressione lombare.",
    steps: [
      "Sdraiati e trova una posizione in cui il tronco resta tranquillo.",
      "Abbassa lentamente un tallone verso terra.",
      "Mantieni il bacino fermo e il respiro regolare.",
      "Torna su con calma e cambia lato."
    ],
    attention: [
      "Non spingere il ventre in fuori.",
      "Non tirare il collo in avanti.",
      "Non scendere più di quanto riesci a controllare."
    ],
    easierOption: "Lavora con un piede sempre a terra e abbassa l'altro solo di poco.",
    microTip: "L'obiettivo non è arrivare in basso, ma restare stabile mentre ti muovi.",
    visual: {
      startLabel: "Centro stabile",
      moveLabel: "Abbassa un tallone"
    }
  },
  "ponte-con-marcia": {
    summary: "Una progressione del ponte glutei per lavorare insieme su glutei e stabilità.",
    purpose: "Serve a rinforzare il bacino e il centro del corpo in modo più preciso.",
    startingPosition:
      "Parti da un ponte glutei comodo, con il bacino già sollevato e stabile.",
    movementCue:
      "Stacca un piede di poco dal pavimento mantenendo il bacino fermo e alla stessa altezza.",
    returnCue: "Riappoggia il piede e alterna con l'altro lato senza perdere la linea del ponte.",
    feelCue: "Dovresti sentire glutei e addome che lavorano insieme per tenerti stabile.",
    steps: [
      "Entra nel ponte glutei con un'altezza sostenibile.",
      "Stacca un piede di pochi centimetri.",
      "Mantieni il bacino fermo, senza farlo oscillare.",
      "Riappoggia e ripeti dall'altro lato."
    ],
    attention: [
      "Non alzare troppo il piede.",
      "Non lasciare che il bacino balli da un lato all'altro.",
      "Non trattenere il respiro."
    ],
    easierOption: "Resta nel ponte statico senza sollevare i piedi.",
    microTip: "Qui conta più la stabilità della marcia che l'altezza del bacino.",
    visual: {
      startLabel: "Ponte stabile",
      moveLabel: "Solleva un piede"
    }
  },
  "sollevamenti-polpacci": {
    summary: "Un gesto semplice per polpacci, caviglie e appoggio della gamba.",
    purpose: "Serve a rendere caviglie e polpacci più forti e più stabili.",
    startingPosition:
      "In piedi, con una mano in appoggio leggero e piedi paralleli.",
    movementCue:
      "Sali sulle punte in modo controllato mantenendo il corpo alto e stabile.",
    returnCue: "Scendi lentamente, senza lasciarti cadere verso il pavimento.",
    feelCue: "Dovresti sentire polpacci e caviglie lavorare, con il busto che resta lungo.",
    steps: [
      "Mettiti in piedi con un appoggio leggero vicino.",
      "Sali sulle punte con calma.",
      "Fermati un attimo in alto.",
      "Scendi piano controllando bene il ritorno."
    ],
    attention: [
      "Non spingerti in avanti.",
      "Non scendere di colpo.",
      "Non bloccare le ginocchia."
    ],
    easierOption: "Riduci l'altezza del sollevamento e usa un appoggio più presente.",
    microTip: "Pensa a crescere verso l'alto, non a buttarti sulle punte.",
    visual: {
      startLabel: "Piedi ben appoggiati",
      moveLabel: "Sali sulle punte"
    }
  },
  "side-leg-lifts": {
    summary: "Da sdraiata su un fianco, lavori sul lato del gluteo con un gesto molto leggibile.",
    purpose: "Serve a dare tono al lato del gluteo e a migliorare la stabilità del bacino.",
    startingPosition:
      "Sdraiata su un fianco, testa sostenuta, gambe allineate e bacino fermo.",
    movementCue:
      "Solleva lentamente la gamba sopra senza ruotare il busto e senza spostare il fianco.",
    returnCue: "Scendi con controllo e ripeti senza usare slancio.",
    feelCue: "Dovresti sentire il lato del gluteo della gamba sopra, non tensione nel collo.",
    steps: [
      "Sdraiati su un fianco in modo comodo e stabile.",
      "Tieni il piede della gamba sopra quasi parallelo al pavimento.",
      "Solleva la gamba di poco con un gesto lento.",
      "Scendi con controllo e ripeti."
    ],
    attention: [
      "Non ruotare il bacino all'indietro.",
      "Non usare slancio.",
      "Non alzare la gamba così tanto da perdere la posizione."
    ],
    easierOption: "Riduci l'altezza del sollevamento e fai meno ripetizioni ma ben controllate.",
    microTip: "È normale che il movimento sia piccolo: il lavoro giusto si sente proprio così.",
    visual: {
      startLabel: "Su un fianco, bacino fermo",
      moveLabel: "Solleva la gamba sopra"
    }
  },
  "respirazione-addominale-profonda": {
    summary: "Un inizio concreto per respirare meglio e sentire il centro del corpo più presente.",
    purpose: "Serve a preparare addome profondo, respiro e controllo prima degli altri esercizi.",
    practicalWhy:
      "Lo trovi spesso all'inizio perché aiuta a entrare meglio nel lavoro: prima ritrovi respiro e sostegno, poi i movimenti successivi diventano più chiari e più utili.",
    startingPosition:
      "Sdraiata o seduta comoda, con busto lungo e spalle lasciate andare.",
    movementCue:
      "Inspira allargando le costole e poi espira lentamente, come per svuotare l'aria senza stringerti troppo.",
    returnCue:
      "Alla fine dell'espirazione lascia tornare il respiro naturale e riparti con calma.",
    feelCue:
      "Dovresti sentire il respiro più ampio e una lieve attivazione nella parte bassa dell'addome, mai uno sforzo duro.",
    steps: [
      "Trova una posizione comoda in cui spalle e collo possano rilassarsi.",
      "Inspira sentendo le costole che si aprono ai lati.",
      "Espira lentamente e senti il basso addome che si raccoglie appena.",
      "Ripeti con un ritmo tranquillo, senza forzare."
    ],
    attention: [
      "Non irrigidire la pancia.",
      "Non sollevare le spalle per inspirare.",
      "Non forzare l'espirazione."
    ],
    easierOption: "Fallo da seduta con una mano sulle costole per sentire meglio il respiro.",
    microTip: "Qui non devi fare fatica: devi solo sentire meglio il corpo prima di partire.",
    visual: {
      startLabel: "Respiro ampio nelle costole",
      moveLabel: "Espira e raccogli il centro"
    }
  },
  "mobilita-bacino-colonna": {
    summary: "Un dondolio piccolo e utile per sciogliere bacino e parte bassa della schiena.",
    purpose: "Serve a rendere più fluido il bacino e a ridurre la sensazione di rigidità.",
    practicalWhy:
      "È utile soprattutto all'inizio o nei giorni più stanchi, perché aiuta il corpo a muoversi con più comfort prima del lavoro vero e proprio.",
    startingPosition:
      "Sdraiata o seduta comoda, con il respiro tranquillo e il corpo ben appoggiato.",
    movementCue:
      "Alterna una piccola retroversione del bacino e un ritorno neutro, con un gesto corto e morbido.",
    returnCue: "Non fermarti in posizioni rigide: lascia che il movimento resti fluido.",
    feelCue: "Dovresti sentire la zona lombare e il bacino muoversi con più comfort, non tensione.",
    steps: [
      "Trova una posizione comoda in cui il bacino si muova bene.",
      "Porta il bacino leggermente indietro.",
      "Lascia poi che torni in una posizione neutra.",
      "Ripeti come un piccolo dondolio, coordinandoti con il respiro."
    ],
    attention: [
      "Non cercare un movimento ampio.",
      "Non irrigidire collo e spalle.",
      "Non correre."
    ],
    easierOption: "Rendi il movimento ancora più piccolo e pensa solo a percepire il bacino.",
    microTip: "Se il gesto è piccolo ma ti fa sentire più sciolta, stai già facendo bene.",
    visual: {
      startLabel: "Bacino neutro",
      moveLabel: "Piccolo dondolio"
    }
  },
  "scapole-al-muro": {
    summary: "Un esercizio posturale semplice per aprire il petto e sentire meglio la schiena alta.",
    purpose: "Serve a migliorare la postura e a dare più presenza alla parte alta della schiena.",
    startingPosition:
      "Schiena al muro, collo lungo, gomiti piegati e spalle lontane dalle orecchie.",
    movementCue:
      "Fai scorrere lentamente le braccia verso l'alto e poi di nuovo in basso, senza perdere l'assetto.",
    returnCue: "Torna giù con controllo, mantenendo il collo morbido.",
    feelCue: "Dovresti sentire la parte alta della schiena attiva e il petto un po' più aperto.",
    steps: [
      "Appoggiati al muro in modo comodo, senza irrigidirti.",
      "Piega i gomiti e prepara le braccia vicino al busto.",
      "Fai scivolare le braccia verso l'alto con calma.",
      "Torna in basso mantenendo il petto aperto e il collo morbido."
    ],
    attention: [
      "Non sollevare le spalle verso le orecchie.",
      "Non inarcare troppo la zona lombare.",
      "Non fare il movimento con scatti."
    ],
    easierOption: "Riduci l'altezza del movimento e resta in un'escursione più piccola.",
    microTip: "Anche un movimento corto può essere molto utile se resti ordinata nella postura.",
    visual: {
      startLabel: "Braccia piegate al muro",
      moveLabel: "Scorri verso l'alto"
    }
  },
  "allungamento-petto-parete": {
    summary: "Un'apertura dolce del petto, utile quando senti spalle e torace troppo chiusi.",
    purpose: "Serve a dare più spazio al petto e a rendere la parte alta del corpo meno rigida.",
    startingPosition:
      "In piedi accanto a una parete o a uno stipite, con un avambraccio appoggiato.",
    movementCue:
      "Ruota lentamente il busto nella direzione opposta finché senti un'apertura leggera davanti al petto.",
    returnCue: "Respira con calma, torna al centro e poi cambia lato.",
    feelCue: "Dovresti sentire un'apertura leggera sul petto e davanti alla spalla, mai un fastidio forte.",
    steps: [
      "Appoggia l'avambraccio alla parete o allo stipite.",
      "Tieni la spalla lontana dall'orecchio.",
      "Ruota il busto piano nella direzione opposta.",
      "Respira, torna al centro e ripeti dall'altro lato."
    ],
    attention: [
      "Non forzare l'allungamento.",
      "Non bloccare il respiro.",
      "Non stringere la spalla verso il collo."
    ],
    easierOption: "Riduci la rotazione del busto e piega un po' di più il gomito.",
    microTip: "Deve sembrare un'apertura piacevole, non una prova di forza.",
    visual: {
      startLabel: "Avambraccio in appoggio",
      moveLabel: "Apri il petto piano"
    }
  }
};
