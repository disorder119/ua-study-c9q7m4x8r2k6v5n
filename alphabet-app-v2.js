'use strict';
if(typeof document!=='undefined'&&typeof document.write==='function'){
  ['alphabet-app-v4-style.js','alphabet-app-v4-a.js','alphabet-app-v4-b.js','alphabet-app-v4-c.js','alphabet-app-v4-d.js','alphabet-app-v4-init.js'].forEach(src=>document.write('<script src="./'+src+'"><\\/script>'));
}else{
  window.AlphabetLab={version:C.VERSION,state:()=>structuredClone(S),export:()=>JSON.stringify(S,null,2),reset(){if(confirm('Alphabet-Lernstand wirklich löschen?')){[STORAGE,LEGACY2,LEGACY1].forEach(k=>localStorage.removeItem(k));S=C.freshState();persist();screen='home';render()}},startExam};
  render();
}
