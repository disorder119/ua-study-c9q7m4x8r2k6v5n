'use strict';
const noveltyScoreV4Base=noveltyScore;
noveltyScore=function(task,state,session){
  let score=noveltyScoreV4Base(task,state,session),family=task.family||task.type;
  const recent=(session.mainAnswers||[]).slice(-3).map(x=>x.family||x.type);
  if(recent.at(-1)===family)score-=32;
  if(recent.length>=2&&recent.slice(-2).every(f=>f===family))score-=85;
  if(recent.length>=3&&recent.every(f=>f===family))score-=180;
  return score;
};
