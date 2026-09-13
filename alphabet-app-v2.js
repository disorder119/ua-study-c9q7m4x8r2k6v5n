'use strict';
window.AlphabetLab={version:C.SCHEMA_VERSION||C.VERSION,state:()=>structuredClone(S),export:()=>JSON.stringify(S,null,2),reset(){if(confirm('Alphabet-Lernstand wirklich löschen?')){[STORAGE,LEGACY2,LEGACY1].forEach(k=>localStorage.removeItem(k));S=C.freshState();persist();screen='home';render()}},startExam,startMyTraining:typeof startMyTraining==='function'?startMyTraining:undefined};
render();
