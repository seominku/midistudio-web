import {REPO} from './themes.mjs';
export const releaseBase=`https://github.com/${REPO}/releases`;
export const latestDownloads={installer:`${releaseBase}/latest/download/MidiStudio-Setup.exe`,portable:`${releaseBase}/latest/download/MidiStudio-Portable.zip`};
export const latestApi=`https://api.github.com/repos/${REPO}/releases/latest`;
const versionPattern=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export function checkedVersion(value){if(typeof value!=='string'||!versionPattern.test(value)||value.split('.').some(n=>Number(n)>65535))throw new Error('정식 릴리스 버전이 올바르지 않습니다.');return value;}
export function releaseFromGitHub(release){
  if(!release||release.draft!==false||release.prerelease!==false)throw new Error('공개 정식 릴리스가 아닙니다.');
  const version=checkedVersion(String(release.tag_name||'').replace(/^v/,''));
  if(release.tag_name!==`v${version}`||!Array.isArray(release.assets))throw new Error('릴리스 형식이 올바르지 않습니다.');
  function asset(name){const matches=release.assets.filter(a=>a.name===name);if(matches.length!==1)throw new Error(`배포 파일이 없습니다: ${name}`);const a=matches[0];const url=`${releaseBase}/download/v${version}/${name}`;if(a.state!=='uploaded'||a.browser_download_url!==url||!Number.isSafeInteger(a.size)||a.size<1||!/^sha256:[0-9a-f]{64}$/i.test(a.digest||''))throw new Error('배포 파일 검증 정보가 올바르지 않습니다.');return {name,bytes:a.size,sha256:a.digest.slice(7).toUpperCase(),url};}
  const installer=asset(`MidiStudio-Setup-${version}.exe`),portable=asset(`MidiStudio-${version}.zip`);
  for(const [alias,original] of [['MidiStudio-Setup.exe',installer],['MidiStudio-Portable.zip',portable]]){const a=asset(alias);if(a.bytes!==original.bytes||a.sha256!==original.sha256)throw new Error('최신 다운로드 파일이 원본과 다릅니다.');}
  return {version,platform:'Windows 10+ x64',installer,portable};
}
export async function loadLatestRelease(fetcher=fetch){const response=await fetcher(latestApi,{headers:{Accept:'application/vnd.github+json'},cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('GitHub 최신 릴리스를 확인하지 못했습니다.');return releaseFromGitHub(await response.json());}

// An unavailable API must never pair a stale hash/version with a moving download URL.
export async function updateDownloadSection(doc=document,fetcher=fetch){
  const byId=id=>doc.getElementById(id);
  const versions=doc.querySelectorAll('[data-release-version]');
  byId('copy-checksum').disabled=true;byId('checksum').value='';
  byId('installer-download').href=latestDownloads.installer;
  byId('portable-download').href=latestDownloads.portable;
  try{const r=await loadLatestRelease(fetcher);versions.forEach(el=>el.textContent=r.version);doc.querySelectorAll('[data-release-series]').forEach(el=>el.textContent=r.version.split('.').slice(0,2).join('.'));byId('installer-download').href=r.installer.url;byId('portable-download').href=r.portable.url;byId('installer-meta').textContent=`Windows 10 / 11 · 64-bit · ${(r.installer.bytes/1048576).toFixed(1)} MB`;byId('checksum').value=r.installer.sha256;byId('copy-checksum').disabled=false;byId('release-status').textContent=`GitHub 최신 정식 버전 v${r.version} · 설치 파일과 포터블 검증 완료`;doc.querySelectorAll('[data-release-page]').forEach(a=>a.href=`${releaseBase}/tag/v${r.version}`);return r;}
  catch{versions.forEach(el=>el.textContent='최신');byId('installer-meta').textContent='Windows 10 / 11 · 64-bit';byId('release-status').textContent='버전 조회가 지연되고 있습니다. 다운로드 버튼은 GitHub의 최신 정식 설치 파일로 연결됩니다.';byId('copy-status').textContent='최신 파일의 SHA-256은 GitHub 릴리스에서 확인하세요.';return null;}
}
