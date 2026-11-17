import {mkdir,writeFile,readFile,copyFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {officialThemes,themeFile,shortcuts,RELEASE} from '../dist/themes.mjs';
const app=process.argv[2];
if(!app)throw new Error('Usage: node scripts/prepare-content.mjs <MidiStudio project path>');
await mkdir('dist/themes',{recursive:true});await mkdir('dist/downloads',{recursive:true});
for(const theme of officialThemes)await writeFile(`dist/themes/${theme.id}.mptheme`,themeFile(theme));
const release={version:RELEASE,platform:'Windows 10+ x64',installer:null,portable:null};
for(const [key,relative] of [['installer',`installer/out/MidiStudio-Setup-${RELEASE}.exe`],['portable',`dist/MidiStudio-${RELEASE}.zip`]]){const file=path.join(app,relative);const bytes=await readFile(file);release[key]={name:path.basename(file),bytes:(await stat(file)).size,sha256:createHash('sha256').update(bytes).digest('hex').toUpperCase(),url:`https://github.com/seominku/midistudio-web/releases/download/v${RELEASE}/${path.basename(file)}`};}
await writeFile('dist/release.json',JSON.stringify(release,null,2)+'\n');
await writeFile('dist/downloads/SHA256SUMS.txt',[release.installer,release.portable].map(a=>`${a.sha256}  ${a.name}`).join('\n')+'\n');
await copyFile(path.join(app,'docs','사용법.md'),'dist/downloads/MidiStudio-Guide.md');
await writeFile('dist/downloads/MidiStudio-Shortcuts.txt',`MidiStudio ${RELEASE} — 주요 단축키\n\n`+shortcuts.map(s=>`${s.keys.join(' + ').padEnd(22)} ${s.name}`).join('\n')+'\n\n편집 단축키는 포커스된 편집기에 적용됩니다. 전체 목록은 앱에서 F1.\n');
console.log(`Prepared ${officialThemes.length} native .mptheme files, guide, shortcuts and release checksums.`);
