// Only scalar color settings cross the community boundary. No paths, scripts or images.
export const REPO = 'seominku/midistudio-web';
export const RELEASE = '2.0.0';
export const officialThemes = [
  {id:'night-shift',name:'Night Shift',description:'깊은 차콜과 라임. 늦은 밤에도 선명한 아이디어.',category:'dark',gradient:true,start:'#10180f',end:'#253729',accent:'#c4f553',bg:.08,text:.94,rounding:5,panelalpha:.96,direction:2,strength:1},
  {id:'deep-ocean',name:'Deep Ocean',description:'차분한 심해의 블루와 시원한 청록빛 포인트.',category:'dark',gradient:true,start:'#0b1b2b',end:'#164c62',accent:'#65d6db',bg:.09,text:.94,rounding:6,panelalpha:.94,direction:2,strength:1},
  {id:'after-hours',name:'After Hours',description:'보랏빛 그라데이션으로 채우는 나만의 새벽.',category:'dark',gradient:true,start:'#1c122b',end:'#59395f',accent:'#d5a7ef',bg:.1,text:.94,rounding:6,panelalpha:.95,direction:3,strength:1},
  {id:'soft-signal',name:'Soft Signal',description:'따뜻한 아이보리 위로 부드럽게 흐르는 블루.',category:'light',gradient:false,start:'#e8e9df',end:'#e8e9df',accent:'#395aca',bg:.87,text:.14,rounding:5,panelalpha:1,direction:0,strength:1},
  {id:'warm-tape',name:'Warm Tape',description:'테이프의 온기를 닮은 브라운과 코럴 오렌지.',category:'dark',gradient:true,start:'#291a18',end:'#5a3529',accent:'#edaa7b',bg:.1,text:.93,rounding:4,panelalpha:.95,direction:2,strength:1},
  {id:'paper-chord',name:'Paper Chord',description:'연보라와 잿빛 종이의 편안한 조합.',category:'light',gradient:true,start:'#ddd9e5',end:'#b9c5cd',accent:'#6a4b9c',bg:.84,text:.14,rounding:7,panelalpha:.97,direction:2,strength:1}
].map(t=>({...t,source:'official',author:'MidiStudio',mode:t.gradient?2:1}));

const hex = /^#[0-9a-f]{6}$/i;
const scalar = (n,min,max,label) => {if(typeof n!=='number'||!Number.isFinite(n)||n<min||n>max)throw new Error(`${label} 값이 유효하지 않습니다.`);return n;};
export function validateTheme(input) {
  if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('테마 데이터가 없습니다.');
  const name=typeof input.name==='string'?input.name.trim():'';
  const description=typeof input.description==='string'?input.description.trim():'';
  if(!name||name.length>48||/[\x00-\x1f]/.test(name))throw new Error('테마 이름은 1~48자로 입력하세요.');
  if(description.length>240||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(description))throw new Error('소개는 240자 이하로 입력하세요.');
  for(const k of ['start','end','accent'])if(!hex.test(input[k]))throw new Error('올바르지 않은 색상입니다.');
  const mode=scalar(input.mode,0,2,'배경 방식');
  const direction=scalar(input.direction,0,3,'방향');
  if(!Number.isInteger(mode)||!Number.isInteger(direction))throw new Error('테마 형식이 올바르지 않습니다.');
  const bg=scalar(input.bg,0,1,'배경 밝기');
  const text=scalar(input.text,0,1,'글자 밝기');
  return {schema:1,name,description,start:input.start.toLowerCase(),end:input.end.toLowerCase(),accent:input.accent.toLowerCase(),mode,direction,bg,text,rounding:scalar(input.rounding,0,12,'둥글기'),panelalpha:scalar(input.panelalpha,0,1,'패널 불투명도'),strength:scalar(input.strength,0,1,'그라데이션 강도'),category:bg>.6?'light':'dark',gradient:mode===2};
}
function rgb(h){return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);}
function rgbHex(a){return '#'+a.map(n=>Math.round(scalar(n,0,1,'색상')*255).toString(16).padStart(2,'0')).join('');}
export function themeFile(input){
  const t=validateTheme(input);
  return ['midipro_theme 1',`accent ${rgb(t.accent).map(n=>n.toFixed(6)).join(' ')}`,`bg ${t.bg}`,`text ${t.text}`,`rounding ${t.rounding}`,`panelalpha ${t.panelalpha}`,`bgfill ${t.mode} ${rgb(t.start).map(n=>n.toFixed(6)).join(' ')} ${rgb(t.end).map(n=>n.toFixed(6)).join(' ')} ${t.direction} ${t.strength}`,''].join('\n');
}
export function parseThemeFile(source,name,description){
  if(typeof source!=='string'||source.length>5*1024*1024)throw new Error('테마 파일은 5MB 이하여야 합니다.');
  const lines=source.replace(/^\uFEFF/,'').trim().split(/\r?\n/);
  if(lines.shift()!=='midipro_theme 1')throw new Error('MidiStudio .mptheme v1 파일이 아닙니다.');
  const found=new Map();
  const allowed=new Map([['accent',3],['bg',1],['text',1],['rounding',1],['panelalpha',1],['bgfill',9]]);
  for(const line of lines){const [key,...parts]=line.trim().split(/\s+/);if(!allowed.has(key))continue;if(found.has(key)||parts.length!==allowed.get(key)||parts.some(v=>!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(v)))throw new Error('테마 색상 값이 올바르지 않습니다.');found.set(key,parts.map(Number));}
  for(const k of ['accent','bg','text','rounding','panelalpha'])if(!found.has(k))throw new Error(`테마에 ${k} 값이 없습니다.`);
  const bg=found.get('bg')[0];const fill=found.get('bgfill')||[0,bg,bg,bg,bg,bg,bg,0,1];
  // Native bgfill has nine numeric values: mode + 3 + 3 + direction + strength.
  return validateTheme({name,description,accent:rgbHex(found.get('accent')),bg,text:found.get('text')[0],rounding:found.get('rounding')[0],panelalpha:found.get('panelalpha')[0],mode:fill[0],start:rgbHex(fill.slice(1,4)),end:rgbHex(fill.slice(4,7)),direction:fill[7],strength:fill[8]});
}
export function issueTheme(issue){
  if(issue.pull_request||issue.state!=='open'||!Array.isArray(issue.labels)||!issue.labels.some(l=>(typeof l==='string'?l:l.name)==='theme'))return null;
  if(typeof issue.body!=='string'||issue.body.length>16000)return null;
  const block=issue.body.match(/```midistudio-theme\s*\n([\s\S]*?)\n```/);
  if(!block)return null;
  try{const parsed=JSON.parse(block[1]);if(parsed.schema!==1)return null;const t=validateTheme(parsed);const number=Number(issue.number);if(!Number.isSafeInteger(number)||number<1)return null;return {...t,id:`community-${number}`,source:'community',author:String(issue.user?.login||'community').slice(0,39),url:`https://github.com/${REPO}/issues/${number}`};}catch{return null;}
}
export function issueUrl(input){const t=validateTheme(input);const body=`## 테마 소개\n${t.description}\n\n색상 설정만 공유합니다. 이미지와 개인 경로는 포함하지 않습니다.\n\n\`\`\`midistudio-theme\n${JSON.stringify(t,null,2)}\n\`\`\`\n\n작성자는 이 색상 테마를 공개하고 다른 사람이 다운로드·적용하는 것에 동의합니다.`;return `https://github.com/${REPO}/issues/new?${new URLSearchParams({template:'theme.md',labels:'theme',title:`[Theme] ${t.name}`,body})}`;}
export const shortcuts=[
  {name:'재생 / 정지',keys:['Space'],category:'트랜스포트'},
  {name:'MIDI 녹음',keys:['R'],category:'녹음'},
  {name:'오디오 녹음',keys:['Shift','R'],category:'녹음'},
  {name:'프로젝트 저장',keys:['Ctrl','S'],category:'파일'},
  {name:'프로젝트 열기',keys:['Ctrl','O'],category:'파일'},
  {name:'오디오 내보내기',keys:['Ctrl','E'],category:'파일'},
  {name:'처음으로 / 정지',keys:['Ctrl','Space'],category:'트랜스포트'},
  {name:'현재 마디 처음부터 재생',keys:['Shift','Space'],category:'트랜스포트'},
  {name:'메트로놈 켜기 / 끄기',keys:['M'],category:'트랜스포트'},
  {name:'루프 켜기 / 끄기',keys:['L'],category:'트랜스포트'},
  {name:'퀀타이즈',keys:['Q'],category:'편집'},
  {name:'실행 취소',keys:['Ctrl','Z'],category:'편집'},
  {name:'다시 실행',keys:['Ctrl','Y'],category:'편집'},
  {name:'복사 / 붙여넣기',keys:['Ctrl','C / V'],category:'편집'},
  {name:'복제',keys:['Ctrl','D'],category:'편집'},
  {name:'병합',keys:['Ctrl','M'],category:'편집'},
  {name:'선택 삭제',keys:['Del'],category:'편집'},
  {name:'구간 삭제 후 당겨 붙이기',keys:['Shift','Del'],category:'편집'},
  {name:'단축키 도움말',keys:['F1'],category:'도움말'},
  {name:'노브 미세 조절',keys:['Shift','드래그'],category:'컨트롤'}
];
