/* =========================================================
   INTRO SCROLL
   HERO → WORK PREVIEW
========================================================= */

/* =========================================================
   INTRO SCROLL
   HERO → WORK PREVIEW
========================================================= */
(function () {
    const intro = document.querySelector('.intro-scroll');
    const stage = intro?.querySelector('.intro-sticky');
    const hero = intro?.querySelector('.hero');
    const works = intro?.querySelector('.work-preview');
    if (!intro || !stage || !hero || !works) return;
    const simpleView = window.matchMedia('(prefers-reduced-motion: reduce), (max-height: 650px)');
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const phase = (progress, start, end) => clamp((progress - start) / (end - start));
    let framePending = false;
    function distance() { return Math.max(intro.offsetHeight - stage.offsetHeight, 1); }
    function render() {
        framePending = false;
        intro.classList.toggle('is-ready', !simpleView.matches);
        if (simpleView.matches) { hero.inert = false; works.inert = false; return; }
        const progress = clamp(-intro.getBoundingClientRect().top / distance());
        const decorationOut = phase(progress, 0, .30);
        const heroOut = phase(progress, .08, .36);
        const workIn = phase(progress, .36, .78);
        const properties = {
            '--decoration-opacity': 1 - decorationOut,
            '--decoration-scale': 1 + decorationOut * .18,
            '--hero-opacity': 1 - heroOut,
            '--hero-y': `${-40 * heroOut}px`,
            '--work-opacity': workIn,
            '--work-scale': .82 + workIn * .18,
            '--work-y': `${80 * (1 - workIn)}px`
        };
        Object.entries(properties).forEach(([name, value]) => { intro.style.setProperty(name, String(value)); });
        hero.inert = progress >= .4; works.inert = progress < .4;
    }
    function requestRender() { if (framePending) return; framePending = true; requestAnimationFrame(render); }
    function goToScene(hash, behavior = 'auto', focus = false) {
        if (simpleView.matches || !['#about', '#work-preview'].includes(hash)) return false;
        const target = hash === '#about' ? hero : works;
        const start = window.scrollY + intro.getBoundingClientRect().top;
        const progress = hash === '#about' ? 0 : .8;
        window.scrollTo({ top: start + distance() * progress, behavior });
        if (focus) { target.inert = false; target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
        requestRender(); return true;
    }
    document.querySelectorAll('a[href="#about"], a[href="#work-preview"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || simpleView.matches) return;
            event.preventDefault(); const hash = link.getAttribute('href'); goToScene(hash, 'smooth', true);
            if (location.hash !== hash) history.pushState(null, '', hash);
        });
    });
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender); window.addEventListener('pageshow', requestRender);
    window.addEventListener('hashchange', () => { goToScene(location.hash); });
    window.addEventListener('load', () => { goToScene(location.hash); requestRender(); });
    if (simpleView.addEventListener) simpleView.addEventListener('change', requestRender);
    render();
})();

/* =========================================================
    DESIGN BANNER
    원형 메뉴 + 이미지 변경
========================================================= */
(function () {
    const orbit = document.querySelector('.design-orbit');
    const orbitItems = [...document.querySelectorAll('.design-orbit-item')];
    if (!orbit || !orbitItems.length) return;

    /* =====================================================
       미리보기 요소
    ====================================================== */

    const previewImage =
        document.querySelector(
            '#designPreviewImage'
        );


    const previewMedia =
        document.querySelector(
            '.design-work-preview-media'
        );


    /*
        이미지 밑에 있던

        PUBLISHING
        Web Publishing
        설명
        VIEW PROJECT

        부분은 사용하지 않음
    */

    const previewInfo =
        document.querySelector(
            '.design-work-preview-info'
        );


    if (
        previewInfo
    ) {

        previewInfo.hidden =
            true;

    }



    /* =====================================================
       기존 가운데 글씨 숨김
    ====================================================== */

    const orbitCenter =
        document.querySelector(
            '#designOrbitCenter'
        );


    if (
        orbitCenter
    ) {

        orbitCenter.hidden =
            true;

    }



    /* =====================================================
       원 둘레에 메뉴 자동 배치
    ====================================================== */

    function positionOrbitItems() {

        const total =
            orbitItems.length;
        /*
            원 크기 기준 반지름

            숫자가 커질수록
            글자가 원 바깥쪽으로 이동

            추천:
            34 ~ 41
        */

        const radius =
            39;
        /*
            첫 번째 글자 시작 위치

            -90 = 원 위쪽
              0 = 오른쪽
             90 = 아래
            180 = 왼쪽
        */

        const startAngle =
            -90;
        orbitItems.forEach(
            (
                item, index
            ) => {

                const angle =
                    startAngle +
                    (
                        360 /
                        total
                    ) *
                    index;



                const radian =
                    angle *
                    Math.PI /
                    180;



                const x =
                    50 +
                    Math.cos(
                        radian
                    ) *
                    radius;



                const y =
                    50 +
                    Math.sin(
                        radian
                    ) *
                    radius;



                item.style.left =
                    `${x}%`;


                item.style.top =
                    `${y}%`;



                /*
                    글자를 모두 수평으로 유지

                    원을 따라 글자 자체도
                    회전시키고 싶다면
                    아래 0 대신
                    angle + 90 사용
                */

                item.style.setProperty(
                    '--item-rotation',
                    '0deg'
                );

            }
        );

    }



    /* 최초 위치 */

    positionOrbitItems();

    // 스크롤 1px당 0.2도 회전. 위로 스크롤하면 반대 방향으로 돌아갑니다.
    const orbitCircle = orbit.querySelector('.design-orbit-circle');
    const orbitMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let orbitFramePending = false;

    function renderOrbitRotation() {
        orbitFramePending = false;
        if (!orbitCircle) return;
        const angle = orbitMotionPreference.matches ? 0 : window.scrollY * 0.2;
        orbitCircle.style.setProperty('--orbit-scroll-angle', `${angle}deg`);
    }

    function requestOrbitRotation() {
        if (orbitFramePending) return;
        orbitFramePending = true;
        requestAnimationFrame(renderOrbitRotation);
    }

    window.addEventListener('scroll', requestOrbitRotation, { passive: true });
    window.addEventListener('pageshow', requestOrbitRotation);
    orbitMotionPreference.addEventListener('change', requestOrbitRotation);
    renderOrbitRotation();



    /* =====================================================
       이미지 변경
    ====================================================== */

    const previewTrack = document.querySelector('#designPreviewTrack');
    const previewPagination = document.querySelector('.design-preview-pagination');
    let slideIndex = 0;
    let slideCount = 1;
    let useOriginalRatio = false;
    let autoplayTimer;
    const bannerBackground = document.querySelector('.design-banner-bg');
    const backgroundLayers = bannerBackground ? [0, 1].map(() => {
        const layer = document.createElement('div');
        layer.className = 'design-banner-bg-layer';
        bannerBackground.append(layer);
        return layer;
    }) : [];
    let activeBackgroundLayer = 0;
    let backgroundSource = '';

    function updateBannerBackground() {
        const image = previewTrack.children[slideIndex];
        const source = image?.currentSrc || image?.src;
        if (!source || !backgroundLayers.length || source === backgroundSource) return;
        backgroundSource = source;
        activeBackgroundLayer = 1 - activeBackgroundLayer;
        backgroundLayers[activeBackgroundLayer].style.backgroundImage = `url(${JSON.stringify(source)})`;
        backgroundLayers.forEach((layer, index) => {
            layer.classList.toggle('is-current', index === activeBackgroundLayer);
        });
    }

    function restartAutoplay() {
        window.clearTimeout(autoplayTimer);
        if (slideCount < 2 || document.hidden) return;
        autoplayTimer = window.setTimeout(() => moveSlide(1), 2500);
    }

    document.addEventListener('visibilitychange', restartAutoplay);

    function updatePreviewRatio() {
        if (!previewMedia) return;
        const image = previewTrack.children[slideIndex];
        if (useOriginalRatio && image?.naturalWidth && image.naturalHeight) {
            previewMedia.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
        } else {
            previewMedia.style.removeProperty('aspect-ratio');
        }
    }

    function updateControls() {
        [...previewTrack.children].forEach((image, index) => {
            image.classList.toggle('is-current', index === slideIndex);
            image.setAttribute('aria-hidden', String(index !== slideIndex));
        });
        [...previewPagination.children].forEach((button, index) => {
            if (index === slideIndex) button.setAttribute('aria-current', 'true');
            else button.removeAttribute('aria-current');
        });
        updatePreviewRatio();
        updateBannerBackground();
    }

    function moveSlide(direction) {
        slideIndex = (slideIndex + direction + slideCount) % slideCount;
        updateControls();
        restartAutoplay();
    }

    previewTrack.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        moveSlide(event.key === 'ArrowLeft' ? -1 : 1);
    });
    let swipeStart = null;
    previewTrack.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        swipeStart = { x: event.clientX, y: event.clientY };
        previewTrack.setPointerCapture(event.pointerId);
    });
    previewTrack.addEventListener('pointerup', (event) => {
        if (!swipeStart) return;
        const dx = event.clientX - swipeStart.x;
        const dy = event.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) moveSlide(dx < 0 ? 1 : -1);
    });
    previewTrack.addEventListener('pointercancel', () => { swipeStart = null; });

    let categoryFadeTimer;
    let previewInitialized = false;

    function updatePreview(item) {
        if (!item || !previewTrack) return;
        window.clearTimeout(autoplayTimer);
        window.clearTimeout(categoryFadeTimer);
        if (!previewInitialized || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            renderPreview(item);
            previewInitialized = true;
            previewTrack.classList.remove('is-fading');
            return;
        }
        previewTrack.classList.add('is-fading');
        categoryFadeTimer = window.setTimeout(() => {
            renderPreview(item);
            previewTrack.classList.remove('is-fading');
        }, 200);
    }

    function renderPreview(item) {
        if (!item || !previewImage || !previewTrack) return;
        const title = item.dataset.title || item.dataset.center || item.textContent.trim();
        const images = item.dataset.images
            ? JSON.parse(item.dataset.images)
            : [item.dataset.image || './img/profile-workspace.jpg'];

        slideIndex = 0;
        slideCount = images.length;
        useOriginalRatio = item.matches('.orbit-popup, .orbit-poster');
        previewTrack.replaceChildren(...images.map((source, index) => {
            const image = document.createElement('img');
            if (index === 0) image.id = 'designPreviewImage';
            image.alt = `${title} 미리보기 ${index + 1} / ${slideCount}`;
            image.draggable = false;
            image.addEventListener('load', () => {
                if (previewTrack.children[slideIndex] === image) {
                    updatePreviewRatio();
                    updateBannerBackground();
                }
            });
            image.addEventListener('error', () => {
                image.src = './img/profile-workspace.jpg';
                image.alt = `${title} 준비 중`;
            }, { once: true });
            image.src = source;
            return image;
        }));
        previewTrack.setAttribute('aria-label', `${title} 이미지 갤러리`);
        previewPagination.replaceChildren(...images.map((source, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', `${index + 1}번 이미지 보기`);
            button.setAttribute('aria-controls', 'designPreviewTrack');
            button.addEventListener('click', () => {
                slideIndex = index;
                updateControls();
                restartAutoplay();
            });
            return button;
        }));
        previewPagination.hidden = slideCount < 2;
        updateControls();
        restartAutoplay();
    }
    function selectItem(
        item
    ) {

        orbitItems.forEach(
            (button) => {

                const active =
                    button ===
                    item;


                button.classList.toggle(
                    'is-active',
                    active
                );


                button.setAttribute(
                    'aria-pressed',
                    String(
                        active
                    )
                );

            }
        );



        updatePreview(
            item
        );

    }



    /* =====================================================
       CLICK
    ====================================================== */

    orbitItems.forEach(
        (item) => {

            item.setAttribute(
                'type',
                'button'
            );


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

                    selectItem(
                        item
                    );

                }
            );

        }
    );



    /* =====================================================
       첫 화면
    ====================================================== */

    const initialItem =
        document.querySelector(
            '.design-orbit-item.is-active'
        ) ||
        orbitItems.find(
            (item) =>
                item.dataset.center ===
                'Publishing'
        ) ||
        orbitItems[0];



    if (
        initialItem
    ) {

        selectItem(
            initialItem
        );

    }



    /* =====================================================
       반응형
    ====================================================== */

    window.addEventListener(
        'resize',
        positionOrbitItems
    );

})();
