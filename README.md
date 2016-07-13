# DM4REVA
Datastore Manager for the Reconstruction of Execution View Architecture

## Overview
DM4REVA는 소프트웨어 아키텍처 뷰[^1] 중 하나인 실행 뷰(Execution view)[^2]를 재구축하기 위한 작업 공간(Workspace)을 관리해주는 프로그램이다. 이 프로그램을 통해, 소스코드로부터 실행 뷰 아키텍처를 재구축 하기 위해 필요한 중간 산출물들(Execution view element type, Interface, Dependency relationship, Monitoring unit, Execution record, Execution view element 등[^3])을 정의하고 관리(추가, 삭제, 수정)할 수  있다.

## Technology stack
* [Electron](http://electron.atom.io): JavaScript, HTML, CSS를 이용하는 크로스 플랫폼 데스크탑 어플리케이션 프레임워크. 기반에는 Node, Chromium, V8 JavaScript Engine이 있으며, 웹과 Node에서 사용하는 모든 기술을 활용하여 데스크탑 프로그램을 만들 수 있으며, 배포가 쉽다. GitHub에서 관리, 개발한다.
* [NeDB](https://github.com/louischatriot/nedb): MongoDB 스타일의 embeded 데이터베이스로, in-memory DB와 file DB로 사용할 수 있다. 또한 API가 MongoDB API의 서브셋이기 때문에 MongoDB에 익숙한 개발자는 손쉽게 사용할 수 있다.
* [React](https://facebook.github.io/react/) (v1.2.2): UI 개발을 위한 JavaScript 라이브러리이다. React는 UI 컴포넌트들이 데이터가 단방향으로 흐르는 명시적인 계층 구조를 갖게 함으로써 유지보수, 코드 재사용에 강점을 갖는다.
* [Twitter Bootstrap 3](http://getbootstrap.com): 본인같은 디자인 고자를 위한 UI 프레임워크이다.
* [jQuery](http://getbootstrap.com) (v2.2.4): 프론트엔드 개발에서 널리 활용되고 있는 JavaScript 라이브러리로 Twitter Bootstrap을 실행시키기 위한 필수 라이브러리이며, 많은 좋은 기능들을 API로 제공한다.
* [showdown](https://github.com/showdownjs/showdown): markdown 문법으로 기록된 텍스트를 html로 변환해주는 JavaScript 라이브러리이다.

### Technology used during the development
* [Gulp](http://gulpjs.com): JavaScript 빌드 도구. Electron의 JavaScript 파일들에서 ES6 표준 문법을 사용하기 위해 활용하였다.(Electron은 Chromium 기반이기 때문에 Chromium에서 아직 지원하지 않는 ES6 문법은 실행하지 못한다.) Gulp에 [Babel](http://babeljs.io)을 결합하여, Electron의 모든 JavaScript 파일들을 변환하여 실행하였다.

## Software architecture

![](http://byron1st.pe.kr/wp-content/uploads/2016/07/DM4REVA-1.png)

프로그램의 거의 모든 작업은 Exdef 프로세스를 통해 이루어진다. Exdef 프로세스의 구조는 Facebook에서 발표한 [Flux Architecture](https://facebook.github.io/flux/)를 따르고 있다.

![](http://byron1st.pe.kr/wp-content/uploads/2016/07/DM4REVA-2.png)

React 컴포넌트의 모든 <code>state</code>는 최상위 컴포넌트인 <code>main</code> 컴포넌트 외에는 없으며, 이하 모든 컴포넌트들은 <code>props</code> 값을 표현하는데만 집중한다. <code>main</code> 컴포넌트의 <code>state</code>는 모든 컴포넌트들에서 사용되는 값들을 계층구조로 갖고 있고, Flux Architecture 구조를 따라, 이 <code>state</code> 값은 <code>dispatcher</code>를 통해서만 변경된다. 즉, React 컴포넌트의 UI 중 <code>save</code> 버튼을 누를 경우, 이 버튼은 '저장 기능'을 수행하기 위해서 해당 Action을 수행해야 한다. 그러기 위해, 수행하고자 하는 Action의 종류(type)와 실행에 필요한 값(value)을 <code>dispatcher</code>로 넘긴다. <code>dispatcher</code>는 미리 등록(register)된 액션들 중 Action의 종류에 따라 적절한 것을 골라 실행 시킨다(Main 프로세스와의 소통이 필요한 경우, 여기서 Electron의 IPC를 통해 연결한다.). Action은 필요한 기능을 모두 수행한 후 최종적으로 <code>store</code>의 값을 변화시키고, <code>store</code>는 최상위 React 컴포넌트인 <code>main</code>의 <code>state</code>를 변경시킨다. 데이터는 이와같이 단방향으로 이루어져 있고, Exdef 프로세스의 구조는 충실히 Flux Architecture를 따르고 있다.

<pre>
let store = {
  editMode: {
    list: false,
    def: false,
    id: false
  },
  detailsTab: '',
  exdefList: remote.getCurrentWindow().exdefList,
  selected: {
    exdef: {},
    muList: [],
    drList: [],
    erList: []
  },
  updated: {
    exdef: {},
    muList: []
  }
}
</pre>

<code>store</code>의 구조는 위와 같다. `editMode` 프로퍼티는 수정 모드가 따로 있는 모든 페이지의 값들을 갖고 있다. `exdefList` 프로퍼티는 모든 `exdef`(Execution View Element Type Definition)들을 리스트로 가지고 있으며, 사용자가 이중 하나를 선택할 경우, 해당 항목을 "복사"하여 `selected` 프로퍼티 내의 `exdef` 프로퍼티에 할당한다. 그리고 그와 동시에 Main 프로세스에 연결하여 관련된 Monitoring Units 리스트(`muList`)와 Dependency Relationships 리스트 (`drList`), Execution Records(`erList`)를 불러와 각각 `selected` 항목 내에 저장한다. 그리고 동시에 '수정 모드'에서 수정이 가능한 `exdef`와 `muList`는 `updated` 프로퍼티 내에 한번 더 "복사" 해둔다. 수정 모드에서 해당 값들에 수정이 발생하면 `updated` 프로퍼티 내의 값을 바꾸고, 수정 종료 후 '저장'을 수행할 경우, `updated` 프로퍼티 내의 값을 그대로 `selected` 값으로 옮긴다. (분리한 이유는, 변경 사항을 저장하지 않고 취소할 경우가 있기 때문이다.)

### Statics
* SLOC: 1,640 ([sloc](https://www.npmjs.com/package/sloc) 사용)

## License
[MIT license](https://github.com/showdownjs/showdown)

## Homepage
[Polymorphism](http://byron1st.pe.kr/?page_id=119)

[^1]: [ISO/IEC/IEEE 42010 Systems and software engineering — Architecture description](http://www.iso-architecture.org/ieee-1471/cm/)
[^2]: "Execution architecture view" (C. Hofmeister *et. al.*, *Applied Software Architecture*. Addison-Wesley Professional, 2000.) "System-level concurrency model" (N. Rozanski and E. Woods, *Software Systems Architecture*. 2nd Edition, Addison-Wesley, 2012.) "실행뷰" (강성원, *소프트웨어 아키텍처로의 초대*. 개정판, 홍릉과학출판사, 2015.
[^3]: 관련 내용은 연구 내용으로 퍼블리시 예정.