# MidiStudio Website

MidiStudio 2.0.0의 한국어 소개·배포·단축키·테마 커뮤니티 웹사이트입니다.

- 공개 GitHub Pages: https://seominku.github.io/midistudio-web/
- 설치/포터블 배포: https://github.com/seominku/midistudio-web/releases/tag/v2.0.0
- 기술: 빌드 없는 HTML/CSS/ES Modules. Node 22+로 테스트. 런타임 라이브러리, 광고/분석 추적, 비밀키 없음.
- `dist/`는 배포할 완성 파일이며 GitHub Actions가 테스트 후 Pages에 자동 배포합니다.
- 기존 MidiStudio 앱 소스 및 사용자 프로필은 이 저장소에 포함하지 않습니다.

## 로컬 실행

```powershell
npm run dev
npm test
```

미리보기: http://127.0.0.1:3940

## 앱 버전 업데이트

1. 실제 앱과 설치 프로그램을 빌드·검증합니다. 웹사이트가 앱을 자동 빌드하지는 않습니다.
2. `dist/themes.mjs`의 RELEASE, 화면 표시 버전/릴리스 링크를 갱신합니다.
3. `node scripts/prepare-content.mjs <MidiStudio 소스 폴더>`로 공개 사용법·치트시트·SHA-256을 갱신합니다.
4. GitHub Release에 정확히 같은 설치 파일과 ZIP, `dist/downloads/SHA256SUMS.txt`를 올립니다.
5. 테스트 후 main에 push하면 GitHub Pages가 갱신됩니다. Sites 사본은 Sites 워크플로로 별도 동기화·배포합니다.

## 테마 커뮤니티

사이트에서 .mptheme(5MB 이하)을 읽고 전역 색상/배경/둥글기/패널 불투명도만 추출합니다. 파일 자체나 이미지, 개인 경로, 스킨은 전송하지 않습니다. 사용자가 GitHub 작성 링크를 누르고 최종 게시해야 공개됩니다. GitHub 로그인은 게시/댓글에만 필요합니다.

`theme` 라벨이 붙은 열린 Issues에서 `midistudio-theme` JSON 블록을 가져옵니다. API 요청은 익명이며 토큰을 브라우저에 두지 않습니다. 요청 한도/오류/빈 목록을 표시하고 페이지 단위로 더 불러올 수 있습니다. 승인된 숫자와 HEX 값으로 새 `.mptheme`을 생성하므로 외부 첨부파일이나 HTML은 실행하지 않습니다. 등록은 즉시 보이며 수정은 새로고침 시 반영됩니다. 관리자는 부적절한 게시물을 닫아 숨길 수 있습니다. 공식 6개 테마는 정적 파일로 항상 제공됩니다.

공유 테마는 **색상 설정**만 지원합니다. 앱의 이미지/창별 스킨 전체 패키지는 게시판에서 의도적으로 지원하지 않습니다. 미리보기는 실제 앱 스크린샷이 아닌 색상 설명 그래픽입니다. 테마 적용은 앱의 기존 드래그 앤 드롭/가져오기 기능을 사용합니다.

## 디자인·이미지

Splice의 큰 타이포그래피, 흑백 이미지, 음악 관련 편집형 배치를 참고했습니다. 로고·문구·소스·이미지를 복사하지 않았으며 제휴 관계가 없습니다. 스튜디오 사진은 내장 이미지 생성 도구로 신규 생성했습니다. 생성 프롬프트/출처는 `docs/ASSETS.md`에 있습니다. 앱 기능 그림과 테마 썸네일은 CSS 기반 개념 그래픽입니다. 제품 기능은 로컬 MidiStudio 2.0.0 사용법/코드를 확인해 작성했습니다. 코드 서명 없는 개발 빌드임을 다운로드 화면에 알립니다.
