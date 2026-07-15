# 🗺️ LocalHub Seoul (서울 지역 취향별 가이드 및 AI 비서)

> **한국관광공사 TourAPI 4.0 데이터**를 기반으로 서울의 7대 카테고리 정보를 시각화하고, 로컬스토리지 기반의 익명 커뮤니티와 OpenAI 기반 맞춤형 AI 여행 비서를 제공하는 싱글 페이지 애플리케이션(SPA)입니다.

---

## 🚀 프로젝트 개요
* **개발 기간:** 2026.07.13 ~ 2026.07.15 (3일 간)
* **개발 인원:** 2명 (팀원 A: UI/UX 디자인 & 퍼블리싱, 팀원 B: 데이터 인프라 & 비즈니스 로직 설계)
* **핵심 목표:** 공공데이터의 직관적인 지도 시각화와 생성형 AI 기술을 결합하여, 유저에게 유실 없는 고품질 서울 여행 추천 경험을 제공합니다.

---

## 🌟 핵심 기능 (Key Features)

### 1. 📍 7대 카테고리 공공데이터 지도 시각화 (Leaflet.js)
* **API Key Free 구조:** 가벼운 오픈소스 지도 라이브러리인 Leaflet.js와 OpenStreetMap 타일을 사용하여 번거로운 API 키 발급 및 승인 대기 시간 없이 안정적인 오프라인 친화적 지도 렌더링 구현.
* **동적 마커(Pin) 바인딩:** 관광지, 문화시설, 레포츠, 숙박 등 7대 카테고리의 위도/경도 문자열 데이터를 실수형(`Float`) 좌표로 파싱하여 실시간으로 지도 위에 핀을 일괄 표시.
* **상세 정보 카드 인터랙션:** 지도 마커 클릭 시 인포윈도우(팝업)가 발생함과 동시에, Vue의 컴포넌트 통신(`Emit`)을 통해 우측 대시보드 영역에 해당 장소의 세부 카드 정보가 실시간 연동 및 동적 렌더링.

### 2. 📋 LocalStorage 기반 익명 커뮤니티 (CRUD)
* **무상태(Stateless) 데이터 보존:** 별도의 서버/데이터베이스 없이 브라우저의 `localStorage`를 제어하여 새로고침 시에도 글 작성이 유지되는 신뢰성 높은 동기화 처리.
* **안전한 암호 대조 알고리즘:** 수정 및 삭제 요청 시 모달(Modal) 창을 구현하여 작성 시 입력한 비밀번호 평문 대조 검증 후 가공 처리가 승인되는 완벽한 예외 처리 구현.

### 3. 🤖 OpenAI API 기반 자연어 AI 비서
* **실시간 데이터 기반 System Prompt 엔지니어링:** GPT 모델에게 가상의 환각 답변(Hallucination)을 방지하고 우리가 가진 실제 서울 공공데이터 정보 범위를 Context로 인지시켜 신뢰성 높은 정보만을 친절하게 답변하도록 프롬프트 튜닝 완료.
* **연동 시나리오 강화:** 지도의 상세 정보 카드에서 `이 장소에 대해 AI에게 물어보기` 버튼을 클릭하면, 챗봇 입력창에 질문 템플릿이 자동으로 완성 및 즉시 전송되는 통합 비즈니스 로직 구현.

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 |
|---|---|
| **Frontend Framework** | Vue 3 (Composition API), Vite |
| **State Management** | Pinia |
| **Routing** | Vue Router |
| **CSS styling** | Tailwind CSS v4 |
| **Map Engine** | Leaflet.js |
| **AI Integration** | OpenAI API (gpt-5-mini / gpt-4o-mini Fallback) |

---

## 📂 프로젝트 구조 (Folder Structure)

```text
seoul-localhub/
├── .env                  # 환경 변수 파일 (API Key 및 모델 정보)
├── .gitignore            # Git 관리 제외 파일 설정 (.env 보호)
├── index.html            # 메인 엔트리 HTML
├── package.json          # 라이브러리 의존성 정의
├── vite.config.js        # Vite 설정 파일
└── src/
    ├── assets/
    │   └── data/         # 서울 공공데이터 원본 JSON (7대 파일)
    ├── components/
    │   └── LeafletMap.vue # Leaflet 지도 컴포넌트
    ├── router/
    │   └── index.js      # 라우터 연결 정의
    ├── stores/
    │   ├── tour.js       # 7대 공공데이터 전역 상태 스토어
    │   ├── community.js  # 로컬스토리지 익명 게시판 CRUD 스토어
    │   └── chatbot.js    # OpenAI 비동기 통신 챗봇 스토어
    ├── views/            # 팀원 A의 퍼블리싱 화면 컴포넌트 폴더
    ├── App.vue           # 최상위 통합 컴포넌트
    └── main.js           # Vue 애플리케이션 엔트리 파일