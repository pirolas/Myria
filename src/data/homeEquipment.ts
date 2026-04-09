export interface HomeEquipmentTip {
  title: string;
  body: string;
  ideas: string[];
}

export const homeEquipmentTips: Record<string, HomeEquipmentTip> = {
  "squat-alla-sedia": {
    title: "Se vuoi più tono, puoi aggiungere un piccolo carico",
    body: "Per questo movimento non servono pesi da palestra. Basta qualcosa di stabile e facile da gestire.",
    ideas: ["due bottiglie d'acqua", "uno zaino con libri", "una cassa d'acqua piccola"]
  },
  "affondo-assistito-indietro": {
    title: "Puoi renderlo più tonificante anche a casa",
    body: "Prima conta la stabilità. Se il gesto è già sicuro, puoi aggiungere un carico domestico leggero.",
    ideas: ["due bottiglie piene", "uno zaino leggero", "una borsa ben bilanciata"]
  },
  "ponte-glutei": {
    title: "Se in futuro vorrai sentire più lavoro",
    body: "Questo esercizio resta efficace anche senza attrezzi. Quando il gesto è pulito, puoi intensificarlo con oggetti di casa.",
    ideas: ["uno zaino morbido appoggiato sul bacino", "una borsa compatta", "una coperta piegata per proteggere l'appoggio"]
  },
  "wall-sit": {
    title: "Qui non serve peso: serve il giusto appoggio",
    body: "Per il wall sit conta soprattutto trovare un'altezza sostenibile e tenere il respiro regolare.",
    ideas: ["una sedia vicina per sicurezza", "un asciugamano dietro la schiena se il muro è rigido"]
  },
  "sollevamenti-polpacci": {
    title: "Puoi usare appoggi semplici di casa",
    body: "Per sentirti più stabile o aggiungere un po' di intensità, bastano strumenti molto comuni.",
    ideas: ["una parete o lo schienale di una sedia", "uno zaino leggero", "una cassa d'acqua piccola tenuta vicino al corpo"]
  },
  "scapole-al-muro": {
    title: "Per l'assetto possono bastare oggetti semplici",
    body: "Se vuoi percepire meglio l'allineamento, puoi usare piccoli riferimenti domestici senza complicarti la vita.",
    ideas: ["un manico di scopa per sentire il busto lungo", "un asciugamano arrotolato tra muro e braccia"]
  }
};
