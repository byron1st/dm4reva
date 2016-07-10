# DM4REVA
Datastore Manager for the Reconstruction of Execution View Architecture

## Overview
DM4REVA는 소프트웨어 아키텍처 뷰[^1] 중 하나인 실행 뷰(Execution view)[^2]를 재구축하기 위한 작업 공간(Workspace)을 관리해주는 프로그램이다. 이 프로그램을 통해, 소스코드로부터 실행 뷰 아키텍처를 재구축 하기 위해 필요한 중간 산출물들(Execution view element type, Interface, Dependency relationship, Monitoring unit, Execution record, Execution view element 등[^3])을 정의하고 관리(추가, 삭제, 수정)할 수  있다.

## Technology stack
* [Electron](http://electron.atom.io): JavaScript, HTML, CSS를 이용하는 크로스 플랫폼 데스크탑 어플리케이션 프레임워크. 기반에는 Node, Chromium, V8 JavaScript Engine이 있으며, 웹과 Node에서 사용하는 모든 기술을 활용하여 데스크탑 프로그램을 만들 수 있으며, 배포가 쉽다. GitHub에서 관리, 개발한다.
* [NeDB](https://github.com/louischatriot/nedb): MongoDB 스타일의 embeded 데이터베이스로, in-memory DB와 file DB로 사용할 수 있다. 또한 API가 MongoDB API의 서브셋이기 때문에 MongoDB에 익숙한 개발자는 손쉽게 사용할 수 있다.
* [vis.js](http://visjs.org): 네트워크 그래프를 그려주는 JavaScript 라이브러리이다.
* [React](https://facebook.github.io/react/) (v1.2.2): UI 개발을 위한 JavaScript 라이브러리이다. React는 UI 컴포넌트들이 데이터가 단방향으로 흐르는 명시적인 계층 구조를 갖게 함으로써 유지보수, 코드 재사용에 강점을 갖는다.
* [Twitter Bootstrap 3](http://getbootstrap.com): 본인같은 디자인 고자를 위한 UI 프레임워크이다.
* [jQuery](http://getbootstrap.com) (v2.2.4): 프론트엔드 개발에서 널리 활용되고 있는 JavaScript 라이브러리로 Twitter Bootstrap을 실행시키기 위한 필수 라이브러리이며, 많은 좋은 기능들을 API로 제공한다.
* [showdown](https://github.com/showdownjs/showdown): markdown 문법으로 기록된 텍스트를 html로 변환해주는 JavaScript 라이브러리이다.

### Technology used during the development
* [Gulp](http://gulpjs.com): JavaScript 빌드 도구. Electron의 JavaScript 파일들에서 ES6 표준 문법을 사용하기 위해 활용하였다.(Electron은 Chromium 기반이기 때문에 Chromium에서 아직 지원하지 않는 ES6 문법은 실행하지 못한다.) Gulp에 [Babel](http://babeljs.io)을 결합하여, Electron의 모든 JavaScript 파일들을 변환하여 실행하였다.

## Software architecture
![DM4REVA의 실행측면 아키텍처](http://byron1st.pe.kr/wp-content/uploads/2016/05/DM4REVA_architecture.png)

DM4REVA는 Electron 기반이기 때문에, 모든 창은 독립적인 프로세스로 실행된다. Main 프로세스는 Electron 어플리케이션의 전반적인 실행, 관리를 수행하며, 메인 메뉴를 생성하고, `db.js`를 통해 DB 파일들과 통신한다. 또한, Renderer 프로세스들의 생성, 파괴를 관리하고, Renderer 프로세스들과는 Electron에서 제공하는 IPC API를 사용하여 통신한다. `db.js`는 NeDB 라이브러리를 통해 DB 파일들과 통신한다.

Renderer 프로세스들은 각각 창을 생성하며, Exdef는 메인이 되는 창을, Init은 Workspace를 변경할 수 있는 세팅 창을 생성한다. 각각은 HTML, css, React component 들로 구성되어 있다.

![Exdef 모듈의 상세 구조](http://byron1st.pe.kr/wp-content/uploads/2016/06/DM4REVA_exdef_react_structure.png)

Exdef 모듈은 `exdef.*.js`, `index.exdef.html` 등으로 구성되어 있으며, 각각의 관계는 위의 그림과 같다. 각각의 React file들은 1개 ~ 여러개의 세부 React component 들로 구성되어 있으며, 유사한 계층 구조를 갖고 있다. `index.exdef.html`에서는 jQuery와 Twitter Bootstrap을 로드하고 `exdef.main.view.js` 파일을 로드한다.

![DB 구조](http://byron1st.pe.kr/wp-content/uploads/2016/06/DM4REVA_db.png)

마지막으로, DB 구조는 위의 그림과 같다. 기본적으로 NoSQL 기반이고, 본인 자체가 DB를 엄격하게 구조화할 정도로 잘 아는 것은 아니라, 최소한의 기본만 잡고 개발되었다. NeDB 자체는 Scheme을 강제하는 방법은 없으나, 잘못된 포멧의 json 문서가 삽입되지 않도록 최소한의 validation 기능을 `db.js`에 구현하였다. 링크의 경우도, NeDB에서 지원하지 않기 때문에, 구현 시 따로 신경을 써주어야 한다.

### Statics
* SLOC: 약 2,200

## License
[MIT license](https://github.com/showdownjs/showdown)

## Homepage
[Polymorphism](http://byron1st.pe.kr/?page_id=119)

[^1]: [ISO/IEC/IEEE 42010 Systems and software engineering — Architecture description](http://www.iso-architecture.org/ieee-1471/cm/)
[^2]: "Execution architecture view" (C. Hofmeister *et. al.*, *Applied Software Architecture*. Addison-Wesley Professional, 2000.) "System-level concurrency model" (N. Rozanski and E. Woods, *Software Systems Architecture*. 2nd Edition, Addison-Wesley, 2012.) "실행뷰" (강성원, *소프트웨어 아키텍처로의 초대*. 개정판, 홍릉과학출판사, 2015.
[^3]: 관련 내용은 연구 내용으로 퍼블리시 예정.