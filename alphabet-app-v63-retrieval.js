'use strict';

// V6.3 · Darstellung des Vollalphabet-Abrufs.
//
// Die Antwortknöpfe tragen bewusst weiterhin data-ans, damit wireAnswers(),
// die Audio-Freigabe aus alphabet-app-v6-question-fixes.js und die
// Antwortauswertung unverändert greifen. Nur das Layout ist ein kompaktes
// Raster statt der zweispaltigen Antwortliste – 33 Optionen in zwei Spalten
// wären auf einem iPhone eine Bildschirmhöhe an Scrollen.

const taskBodyRetrievalBase=taskBody;
taskBody=function(t){
  if(t?.interaction!=='alphabetRecall')return taskBodyRetrievalBase(t);
  const options=t.options||[];
  return `${t.display?`<div class="pair">${esc(t.display)}</div>`:''}<div class="prompt">${esc(t.prompt)}</div>`
    +`<div class="alphabet-grid" role="group" aria-label="Vollständiges ukrainisches Alphabet">`
    +options.map(letter=>`<button class="answer alphabet-key" data-ans="${esc(letter)}" lang="uk" aria-label="Buchstabe ${esc(letter)}"><strong>${esc(letter)}</strong><small>${esc(C.DATA[letter]?.lower||'')}</small></button>`).join('')
    +`</div>`
    +`<p class="micro">Kein engeres Auswahlfeld: Hol den Buchstaben zuerst aus dem Gedächtnis, dann tippe ihn an.</p>`;
};
