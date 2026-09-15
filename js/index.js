/* =========================================================
   INTRO SCROLL
========================================================= */

(() => {
  const intro = document.querySelector('.intro-scroll');
  const stage = intro?.querySelector('.intro-sticky');
  const hero = intro?.querySelector('.hero');
  const works = intro?.querySelector('.work-preview');

  if (!intro || !stage || !hero || !works) return;


  const simpleView = window.matchMedia(
    '(prefers-reduced-motion: reduce), (max-height: 650px)'
  );


  const clamp = (value) =>
    Math.min(1, Math.max(0, value));


  const phase = (progress, start, end) =>
    clamp(
      (progress - start) /
      (end - start)
    );


  let framePending = false;



  /* =========================================================
     스크롤 거리
  ========================================================= */

  function distance() {
    return Math.max(
      intro.offsetHeight -
      stage.offsetHeight,
      1
    );
  }



  /* =========================================================
     INTRO 애니메이션
  ========================================================= */

  function render() {
    framePending = false;


    intro.classList.toggle(
      'is-ready',
      !simpleView.matches
    );


    if (simpleView.matches) {
      hero.inert = false;
      works.inert = false;

      return;
    }


    const progress = safeRange(
      -intro.getBoundingClientRect().top /
      distance()
    );


    const decorationOut =
      phase(
        progress,
        0,
        0.3
      );


    const heroOut =
      phase(
        progress,
        0.08,
        0.36
      );


    const workIn =
      phase(
        progress,
        0.36,
        0.78
      );


    const properties = {
      '--decoration-opacity':
        1 - decorationOut,

      '--decoration-scale':
        1 + decorationOut * 0.18,

      '--hero-opacity':
        1 - heroOut,

      '--hero-y':
        `${-40 * heroOut}px`,

      '--work-opacity':
        workIn,

      '--work-scale':
        0.82 + workIn * 0.18,

      '--work-y':
        `${80 * (1 - workIn)}px`
    };


    Object.entries(
      properties
    ).forEach(
      ([name, value]) => {

        intro.style.setProperty(
          name,
          String(value)
        );

      }
    );


    hero.inert =
      progress >= 0.4;


    works.inert =
      progress < 0.4;
  }



  function requestRender() {
    if (framePending) return;


    framePending = true;


    requestAnimationFrame(
      render
    );
  }



  /* =========================================================
     INTRO 장면 이동
  ========================================================= */

  function goToScene(
    hash,
    behavior = 'auto',
    focus = false
  ) {

    if (
      simpleView.matches ||
      ![
        '#about',
        '#work-preview'
      ].includes(hash)
    ) {
      return false;
    }


    const target =
      hash === '#about'
        ? hero
        : works;


    const start =
      window.scrollY +
      intro.getBoundingClientRect().top;


    const progress =
      hash === '#about'
        ? 0
        : 0.8;


    window.scrollTo({
      top:
        start +
        distance() * progress,

      behavior
    });


    if (focus) {

      target.inert = false;


      target.setAttribute(
        'tabindex',
        '-1'
      );


      target.focus({
        preventScroll: true
      });

    }


    requestRender();


    return true;
  }



  /* =========================================================
     INTRO 링크
  ========================================================= */

  document
    .querySelectorAll(
      'a[href="#about"], a[href="#work-preview"]'
    )
    .forEach((link) => {

      link.addEventListener(
        'click',
        (event) => {

          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            simpleView.matches
          ) {
            return;
          }


          event.preventDefault();


          const hash =
            link.getAttribute(
              'href'
            );


          goToScene(
            hash,
            'instant',
            true
          );


          if (
            location.hash !== hash
          ) {

            history.pushState(
              null,
              '',
              hash
            );

          }

        }
      );

    });



  /* =========================================================
     INTRO 이벤트
  ========================================================= */

  window.addEventListener(
    'scroll',
    requestRender,
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    requestRender
  );


  window.addEventListener(
    'pageshow',
    requestRender
  );


  window.addEventListener(
    'hashchange',
    () => {

      goToScene(
        location.hash
      );

    }
  );


  window.addEventListener(
    'load',
    () => {

      goToScene(
        location.hash
      );


      requestRender();

    }
  );


  simpleView.addEventListener(
    'change',
    requestRender
  );


  render();

})();





/* =========================================================
   DESIGN BANNER
   원형 회전 작품 메뉴

   마우스 휠
   ↓
   원 위 글씨 회전

   글씨 클릭
   ↓
   원 위 글씨는 그대로 유지
   ↓
   가운데 선택 단어 변경
   ↓
   작품 이미지 / 제목 / 설명 변경
========================================================= */

(() => {

  const orbit =
    document.querySelector(
      '.design-orbit'
    );


  const workItems =
    [
      ...document.querySelectorAll(
        '.design-orbit-item'
      )
    ];


  if (
    !orbit ||
    !workItems.length
  ) {
    return;
  }



  /* =========================================================
     가운데 선택 단어
  ========================================================= */

  const orbitCenter =
    document.querySelector(
      '#designOrbitCenter'
    );



  /* =========================================================
     작품 미리보기
  ========================================================= */

  const previewImage =
    document.querySelector(
      '#designPreviewImage'
    );


  const previewCategory =
    document.querySelector(
      '#designPreviewCategory'
    );


  const previewTitle =
    document.querySelector(
      '#designPreviewTitle'
    );


  const previewDescription =
    document.querySelector(
      '#designPreviewDescription'
    );


  const previewLink =
    document.querySelector(
      '#designPreviewLink'
    );


  const previewMedia =
    document.querySelector(
      '.design-work-preview-media'
    );


  const previewInfo =
    document.querySelector(
      '.design-work-preview-info'
    );



  /* =========================================================
     메뉴별 기본 각도

     처음 화면에서 원 위에 놓일 위치
  ========================================================= */

  const defaultAngles = {
    'orbit-ui': -78,
    'orbit-branding': -27,
    'orbit-popup': 24,
    'orbit-poster': 75,
    'orbit-detail': 126,
    'orbit-projects': 177,
    'orbit-publishing': 228
  };



  /* =========================================================
     현재 회전값
  ========================================================= */

  let currentRotation = 0;

  let targetRotation = 0;

  let orbitAnimationFrame = null;

  let changeToken = 0;



  /* =========================================================
     해당 메뉴의 기본 각도 찾기
  ========================================================= */

  function getBaseAngle(
    item,
    index
  ) {

    const className =
      Object.keys(
        defaultAngles
      ).find(
        (name) =>
          item.classList.contains(
            name
          )
      );


    if (className) {

      return defaultAngles[
        className
      ];

    }


    /*
      혹시 새로운 메뉴가 추가되더라도
      자동으로 원 위에 배치
    */

    return (
      -90 +
      (
        360 /
        workItems.length
      ) *
      index
    );

  }



  /* =========================================================
     글씨가 거꾸로 보이지 않도록 각도 보정
  ========================================================= */

  function getReadableAngle(
    angle
  ) {

    let textAngle =
      angle + 90;


    textAngle =
      (
        (
          textAngle % 360
        ) +
        360
      ) %
      360;


    if (
      textAngle > 90 &&
      textAngle < 270
    ) {

      textAngle -= 180;

    }


    if (
      textAngle > 180
    ) {

      textAngle -= 360;

    }


    return textAngle;

  }



  /* =========================================================
     원 위에 글씨 배치
  ========================================================= */

  function layoutOrbit() {

    workItems.forEach(
      (
        item,
        index
      ) => {

        const baseAngle =
          getBaseAngle(
            item,
            index
          );


        const angle =
          baseAngle +
          currentRotation;


        const radian =
          angle *
          Math.PI /
          180;



        /*
          원의 반지름

          38~42 사이에서 바꾸면
          글씨가 원 안/밖으로 이동함
        */

        const radiusX =
          39;


        const radiusY =
          39;



        const x =
          50 +
          Math.cos(
            radian
          ) *
          radiusX;


        const y =
          50 +
          Math.sin(
            radian
          ) *
          radiusY;



        item.style.left =
          `${x}%`;


        item.style.top =
          `${y}%`;



        /*
          원 접선 방향으로 글씨 회전
        */

        const textAngle =
          getReadableAngle(
            angle
          );


        item.style.setProperty(
          '--item-rotation',
          `${textAngle}deg`
        );

      }
    );

  }



  /* =========================================================
     원을 부드럽게 회전
  ========================================================= */

  function animateOrbit() {

    const difference =
      targetRotation -
      currentRotation;


    currentRotation +=
      difference *
      0.12;


    layoutOrbit();



    if (
      Math.abs(
        difference
      ) >
      0.03
    ) {

      orbitAnimationFrame =
        requestAnimationFrame(
          animateOrbit
        );

    } else {

      currentRotation =
        targetRotation;


      layoutOrbit();


      orbitAnimationFrame =
        null;

    }

  }



  function startOrbitAnimation() {

    if (
      orbitAnimationFrame
    ) {
      return;
    }


    orbitAnimationFrame =
      requestAnimationFrame(
        animateOrbit
      );

  }



  /* =========================================================
     마우스 휠 회전

     원 위에 마우스를 올리고
     휠을 위 / 아래로 움직이면 회전
  ========================================================= */

  orbit.addEventListener(
    'wheel',
    (event) => {

      event.preventDefault();


      /*
        마우스 휠 값이 너무 큰 기기에서도
        갑자기 너무 많이 돌지 않도록 제한
      */

      const wheelAmount =
        Math.max(
          -100,
          Math.min(
            100,
            event.deltaY
          )
        );


      targetRotation +=
        wheelAmount *
        0.13;


      startOrbitAnimation();

    },
    {
      passive: false
    }
  );



  /* =========================================================
     가운데 선택 단어 변경
  ========================================================= */

  function changeCenter(
    item
  ) {

    if (
      !orbitCenter ||
      !item
    ) {
      return;
    }


    const centerText =
      item.dataset.center ||
      item.textContent.trim();



    orbitCenter.classList.add(
      'is-changing'
    );


    setTimeout(
      () => {

        orbitCenter.textContent =
          centerText;


        orbitCenter.classList.remove(
          'is-changing'
        );

      },
      140
    );

  }



  /* =========================================================
     작품 텍스트 변경
  ========================================================= */

  function changeText(
    category,
    title,
    description,
    target
  ) {

    if (
      previewCategory
    ) {

      previewCategory.textContent =
        category || '';

    }


    if (
      previewTitle
    ) {

      previewTitle.textContent =
        title || '';

    }


    if (
      previewDescription
    ) {

      previewDescription.textContent =
        description || '';

    }


    if (
      previewLink
    ) {

      previewLink.setAttribute(
        'href',
        target ||
        '#visual-works'
      );

    }

  }



  /* =========================================================
     작품 선택
  ========================================================= */

  function selectWork(
    item
  ) {

    if (!item) return;


    const image =
      item.dataset.image;


    const category =
      item.dataset.category;


    const title =
      item.dataset.title;


    const description =
      item.dataset.description;


    const target =
      item.dataset.target;



    /* =========================================================
       선택 글씨 표시

       중요:
       클릭한 원 위 글씨는 숨기지 않음
    ========================================================= */

    workItems.forEach(
      (button) => {

        const isActive =
          button === item;


        button.classList.toggle(
          'is-active',
          isActive
        );


        button.setAttribute(
          'aria-pressed',
          String(isActive)
        );

      }
    );



    /* =========================================================
       가운데 단어 변경
    ========================================================= */

    changeCenter(
      item
    );



    /* =========================================================
       이미지가 없을 경우
       글씨만 변경
    ========================================================= */

    if (
      !previewImage ||
      !image
    ) {

      changeText(
        category,
        title,
        description,
        target
      );


      return;

    }



    /* =========================================================
       같은 이미지일 경우
    ========================================================= */

    if (
      previewImage.getAttribute(
        'src'
      ) === image
    ) {

      changeText(
        category,
        title,
        description,
        target
      );


      previewImage.alt =
        `${
          title ||
          category ||
          '작품'
        } 작업 이미지`;


      return;

    }



    /* =========================================================
       새로운 작품 전환
    ========================================================= */

    changeToken++;


    const currentToken =
      changeToken;



    /*
      기존 이미지와 설명을
      잠시 숨김
    */

    previewMedia?.classList.add(
      'is-changing'
    );


    previewInfo?.classList.add(
      'is-changing'
    );



    /* =========================================================
       새 이미지 미리 로딩
    ========================================================= */

    const nextImage =
      new Image();


    nextImage.src =
      image;



    /* =========================================================
       이미지 로딩 성공
    ========================================================= */

    nextImage.onload =
      () => {

        if (
          currentToken !==
          changeToken
        ) {
          return;
        }


        setTimeout(
          () => {

            if (
              currentToken !==
              changeToken
            ) {
              return;
            }



            previewImage.src =
              image;


            previewImage.alt =
              `${
                title ||
                category ||
                '작품'
              } 작업 이미지`;



            changeText(
              category,
              title,
              description,
              target
            );



            requestAnimationFrame(
              () => {

                previewMedia
                  ?.classList
                  .remove(
                    'is-changing'
                  );


                previewInfo
                  ?.classList
                  .remove(
                    'is-changing'
                  );

              }
            );

          },
          160
        );

      };



    /* =========================================================
       이미지 경로 오류
    ========================================================= */

    nextImage.onerror =
      () => {

        if (
          currentToken !==
          changeToken
        ) {
          return;
        }


        previewMedia
          ?.classList
          .remove(
            'is-changing'
          );


        previewInfo
          ?.classList
          .remove(
            'is-changing'
          );


        console.warn(
          `이미지를 찾을 수 없습니다: ${image}`
        );

      };

  }



  /* =========================================================
     원 위 글씨 클릭
  ========================================================= */

  workItems.forEach(
    (item) => {

      item.setAttribute(
        'aria-pressed',
        String(
          item.classList.contains(
            'is-active'
          )
        )
      );


      item.addEventListener(
        'click',
        () => {

          selectWork(
            item
          );

        }
      );

    }
  );



  /* =========================================================
     창 크기 변경
  ========================================================= */

  window.addEventListener(
    'resize',
    () => {

      layoutOrbit();

    }
  );



  /* =========================================================
     처음 보여줄 작품
  ========================================================= */

  const initialItem =
    document.querySelector(
      '.design-orbit-item.is-active'
    ) ||
    workItems[0];



  /*
    먼저 원 위 글씨 배치
  */

  layoutOrbit();



  if (
    initialItem
  ) {

    /*
      초기 활성 상태
    */

    workItems.forEach(
      (item) => {

        const isActive =
          item === initialItem;


        item.classList.toggle(
          'is-active',
          isActive
        );


        item.setAttribute(
          'aria-pressed',
          String(isActive)
        );

      }
    );



    /*
      처음 가운데 글씨
    */

    if (
      orbitCenter
    ) {

      orbitCenter.textContent =
        initialItem.dataset.center ||
        initialItem.textContent.trim();

    }



    /*
      처음 작품 정보
    */

    changeText(
      initialItem.dataset.category,
      initialItem.dataset.title,
      initialItem.dataset.description,
      initialItem.dataset.target
    );

  }

})();