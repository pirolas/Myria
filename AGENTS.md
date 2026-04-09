# AGENTS.md

## Contesto prodotto

Mirya è una web app mobile-first in italiano per un pubblico femminile adulto.
Il prodotto aiuta donne adulte a seguire un percorso di allenamento a casa semplice, guidato e personalizzato.

Mirya:
- non è una app fitness generica
- non è una app aggressiva da palestra
- non è una app medica
- non è una app focalizzata su calorie o body shaming

## Posizionamento

Ogni intervento su prodotto, UX, UI e contenuti deve rispettare questi principi:
- tono premium ma accessibile
- tono empatico, concreto, rassicurante
- linguaggio naturale, italiano corretto
- UX semplice e immediata
- l’utente non deve scegliere gli esercizi liberamente
- il valore è: "ti guidiamo noi con un percorso costruito su di te"

## Vincoli di copy

Tutti i testi devono rispettare queste regole:
- usare un italiano naturale, corretto e credibile
- evitare errori di accenti, apostrofi, concordanze e punteggiatura
- non mostrare mai in UI chiavi interne o label tecniche come `total_body`, `addome_core`, `glutei_gambe`
- non usare underscore, tilde, testo da JSON o frasi che sembrino traduzioni automatiche
- fare in modo che il copy sembri scritto da una persona italiana competente
- evitare tono da influencer fitness
- evitare tono medico o pseudo-clinico
- evitare promesse irreali
- evitare aggressività, colpevolizzazione o pressione inutile

## Vincoli prodotto

Le decisioni di prodotto devono restare coerenti con questi punti:
- onboarding semplice ma intelligente
- piano iniziale personalizzato gratuito
- continuità del percorso e aggiornamenti del piano come elemento premium
- piano mostrato in modo umano, chiaro ed empatico
- l’utente deve capire subito cosa deve fare oggi e perché

## Vincoli tecnici

La base tecnica del progetto deve restare coerente con:
- React
- TypeScript
- Vite
- Tailwind
- Supabase
- Supabase Edge Functions
- struttura pulita
- tipi forti
- logica separata dalla UI
- nessuna chiave segreta nel frontend

## Vincoli OpenAI

Per tutto ciò che riguarda il planner AI e le Edge Functions:
- su Supabase esiste già un secret chiamato esattamente `OpenAI-API`
- non deve essere rinominato
- nella Edge Function la chiave va letta con `Deno.env.get("OpenAI-API")`
- se esiste `OPENAI_MODEL` va usato
- se `OPENAI_MODEL` non esiste, il fallback deve essere `"gpt-5-mini"`

## Regole di lavoro

Per ogni modifica futura:
- non rompere quello che già funziona
- fare modifiche coerenti e incrementali
- se una label interna deve essere mostrata in UI, trasformarla prima in italiano naturale
- centralizzare i testi UI quando utile
- se si modificano copy o formatter, rendere il sistema mantenibile

## Output richiesto a fine intervento

Alla fine di ogni intervento bisogna sempre mostrare:
- file modificati
- cosa è stato cambiato
- eventuali cose da configurare
