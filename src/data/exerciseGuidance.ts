export interface ExerciseGuidanceEntry {
  summary: string;
  startingPosition: string;
  movementCue: string;
  feelCue: string;
  microTip: string;
}

export const exerciseGuidance: Record<string, ExerciseGuidanceEntry> = {
  "ponte-glutei": {
    summary:
      "Sdraiata a terra, sollevi il bacino per attivare glutei e retro coscia senza impatto.",
    startingPosition:
      "Sdraiata, ginocchia piegate, piedi ben appoggiati a terra e braccia morbide lungo il corpo.",
    movementCue:
      "Spingi il pavimento con i piedi e alza il bacino finche spalle, bacino e ginocchia sono in una linea morbida.",
    feelCue:
      "Dovresti sentire soprattutto glutei e parte posteriore delle gambe, non pressione sulla schiena.",
    microTip: "Pensa a stringere i glutei in alto senza inarcare il torace."
  },
  "squat-alla-sedia": {
    summary:
      "Uno squat semplice e guidato, utile per dare tono a gambe e glutei senza perdere sicurezza.",
    startingPosition:
      "In piedi davanti a una sedia, piedi poco piu larghi delle anche e sguardo avanti.",
    movementCue:
      "Porta il bacino indietro come per sederti appena, sfiora la sedia e poi risali spingendo bene sui piedi.",
    feelCue:
      "Dovresti sentire il lavoro in cosce e glutei, con il peso stabile su tutto il piede.",
    microTip: "Se ti senti incerta, scendi meno e usa la sedia come riferimento visivo."
  },
  "wall-sit": {
    summary:
      "Una tenuta al muro per dare resistenza a cosce e glutei con un gesto molto lineare.",
    startingPosition:
      "Schiena appoggiata al muro, piedi leggermente avanti e spalle rilassate.",
    movementCue:
      "Scivola in basso fino a una seduta comoda, resta qualche secondo e poi risali con calma.",
    feelCue:
      "Dovresti sentire soprattutto la parte anteriore delle cosce, con un sostegno leggero dei glutei.",
    microTip: "Non cercare di scendere troppo: meglio una tenuta morbida ma pulita."
  },
  "slanci-laterali-in-piedi": {
    summary:
      "Un gesto in piedi per attivare il lato del gluteo e migliorare la stabilita del bacino.",
    startingPosition:
      "In piedi vicino a un appoggio leggero, busto lungo e gamba d'appoggio ben stabile.",
    movementCue:
      "Apri lentamente una gamba verso il lato senza inclinare il busto, poi torna al centro con controllo.",
    feelCue:
      "Dovresti sentire il lato del gluteo della gamba che si muove e stabilita sulla gamba ferma.",
    microTip: "Meglio un'apertura piccola ma precisa che uno slancio ampio e veloce."
  },
  "affondo-assistito-indietro": {
    summary:
      "Un affondo dolce con appoggio, utile per rinforzare glutei e gambe senza perdere equilibrio.",
    startingPosition:
      "In piedi con una mano in appoggio, busto alto e piedi paralleli.",
    movementCue:
      "Porta una gamba indietro, piega entrambe le ginocchia di poco e torna al centro spingendo sul piede davanti.",
    feelCue:
      "Dovresti sentire soprattutto gluteo e coscia della gamba davanti, non tensione nella schiena.",
    microTip: "Se senti instabilita, fai un passo piu corto e scendi molto meno."
  },
  "bird-dog": {
    summary:
      "Da quattro appoggi, allunghi braccio e gamba opposti per lavorare su centro, schiena e controllo.",
    startingPosition:
      "A quattro appoggi, mani sotto le spalle, ginocchia sotto il bacino e collo lungo.",
    movementCue:
      "Allunga insieme un braccio e la gamba opposta senza perdere l'assetto del tronco, poi torna piano.",
    feelCue:
      "Dovresti sentire il centro attivo e la schiena lunga, non compressa o rigida.",
    microTip: "Immagina di allungarti in due direzioni, non di alzare troppo gli arti."
  },
  "heel-slides": {
    summary:
      "Scivolamenti dei talloni a terra per ritrovare controllo del core in modo molto delicato.",
    startingPosition:
      "Sdraiata, ginocchia piegate, piedi a terra e bacino il piu possibile fermo.",
    movementCue:
      "Fai scivolare lentamente un tallone in avanti e riportalo indietro senza perdere il sostegno del tronco.",
    feelCue:
      "Dovresti sentire l'addome profondo che accompagna il movimento mentre il bacino resta calmo.",
    microTip: "Se perdi controllo, accorcia il gesto e rallenta ancora."
  },
  "dead-bug-semplificato": {
    summary:
      "Una versione accessibile del dead bug per sentire il centro del corpo piu presente e stabile.",
    startingPosition:
      "Sdraiata, con un piede a terra o con le gambe in tavolino se il controllo te lo permette.",
    movementCue:
      "Abbassa lentamente un tallone verso il pavimento mantenendo il tronco stabile, poi torna e cambia lato.",
    feelCue:
      "Dovresti sentire il centro attivo e il respiro regolare, senza tirare il collo.",
    microTip: "Se senti che il ventre spinge in fuori, torna alla variante piu facile."
  },
  "ponte-con-marcia": {
    summary:
      "Una progressione del ponte glutei in cui sollevi un piede alla volta senza far ballare il bacino.",
    startingPosition:
      "Parti da un ponte glutei comodo, con il bacino gia sollevato e stabile.",
    movementCue:
      "Stacca un piede di poco dal pavimento, riappoggialo e alterna senza cambiare l'altezza del bacino.",
    feelCue:
      "Dovresti sentire glutei e centro del corpo che lavorano insieme per tenerti ferma.",
    microTip: "Alza il piede di poco: la stabilita vale piu dell'ampiezza."
  },
  "sollevamenti-polpacci": {
    summary:
      "Un gesto essenziale per polpacci, caviglie e appoggio della gamba, utile anche nella vita di tutti i giorni.",
    startingPosition:
      "In piedi, con una mano in appoggio leggero e piedi paralleli.",
    movementCue:
      "Sali sulle punte in modo controllato e poi scendi lentamente senza lasciarti cadere.",
    feelCue:
      "Dovresti sentire polpacci e caviglie che lavorano, con il busto che resta alto.",
    microTip: "Pensa a crescere verso l'alto piu che a spingerti in avanti."
  },
  "side-leg-lifts": {
    summary:
      "Sdraiata su un fianco, sollevi la gamba sopra per attivare il lato del gluteo in modo molto preciso.",
    startingPosition:
      "Su un fianco, testa sostenuta, gambe allineate e bacino fermo.",
    movementCue:
      "Alza lentamente la gamba sopra senza ruotare il bacino e poi scendi con controllo.",
    feelCue:
      "Dovresti sentire il lato del gluteo della gamba sopra, non tensione nel collo.",
    microTip: "Mantieni il piede quasi parallelo al pavimento per non spostare il lavoro."
  },
  "respirazione-addominale-profonda": {
    summary:
      "Un esercizio base per respiro, addome profondo e percezione del centro del corpo.",
    startingPosition:
      "Sdraiata o seduta comoda, con busto lungo e spalle lasciate andare.",
    movementCue:
      "Inspira allargando le costole, poi espira lentamente e senti una lieve attivazione del basso addome.",
    feelCue:
      "Dovresti sentire il respiro piu ampio e il centro del corpo che si raccoglie senza sforzo duro.",
    microTip: "L'espirazione deve restare lunga e morbida, mai forzata."
  },
  "mobilita-bacino-colonna": {
    summary:
      "Un piccolo dondolio del bacino per sciogliere la colonna bassa e ritrovare fluidita.",
    startingPosition:
      "Sdraiata o seduta comoda, con il respiro tranquillo e il corpo appoggiato bene.",
    movementCue:
      "Alterna una piccola retroversione del bacino e un ritorno neutro, senza cercare ampiezza.",
    feelCue:
      "Dovresti sentire la zona lombare che si muove con piu comfort e meno rigidita.",
    microTip: "Pensa a un movimento piccolo e continuo, come un dondolio."
  },
  "scapole-al-muro": {
    summary:
      "Un esercizio al muro per aprire il torace e dare piu presenza alla parte alta della schiena.",
    startingPosition:
      "Schiena al muro, collo lungo, gomiti piegati e spalle lontane dalle orecchie.",
    movementCue:
      "Fai scorrere lentamente le braccia verso l'alto e poi di nuovo in basso, senza irrigidirti.",
    feelCue:
      "Dovresti sentire la parte alta della schiena attiva e il petto piu aperto.",
    microTip: "Se il muro ti fa perdere comfort, riduci l'escursione delle braccia."
  },
  "allungamento-petto-parete": {
    summary:
      "Un'apertura dolce del torace utile quando senti spalle e petto troppo chiusi.",
    startingPosition:
      "In piedi accanto a una parete o a uno stipite, con un avambraccio appoggiato.",
    movementCue:
      "Ruota piano il busto nella direzione opposta fino a sentire un'apertura leggera davanti alla spalla e al petto.",
    feelCue:
      "Dovresti sentire una tensione leggera davanti al petto, mai un fastidio forte sull'articolazione.",
    microTip: "Se l'allungamento tira troppo, ruota meno e ammorbidisci il gomito."
  }
};
