(() => {

    /* =========================================================
       VISUAL WORKS
    ========================================================= */

    const section =
        document.querySelector(
            '#visual-works'
        );
    if (!section) return;
    const gallery =
        section.querySelector(
            '.visual-works-gallery'
        );
    const exploreButton =
        section.querySelector(
            '#visual-explore-link'
        );
    const exploreText =
        section.querySelector(
            '.visual-explore-text'
        );
    const exploreArrow =
        section.querySelector(
            '.visual-explore-arrow'
        );
    if (!gallery) return;
    /* =========================================================
       홈페이지 주소
    ========================================================= */
    /*
        처음 목업에서 보여줄 프로젝트 홈페이지
    */
    const projectURL =
        'https://octos8.github.io/Aesop-projects/';
    /*
        EXPLORE WORKS 클릭 후
        보여줄 개인 홈페이지 주소

        아래 주소는 반드시
        실제 개인 홈페이지 주소로 변경하세요.
    */
    const personalURL =
        'https://octos8.github.io/LUNE-shoppingmall/';
    /* =========================================================
       IFRAME
    ========================================================= */
    const previewFrames =
        gallery.querySelectorAll(
            '.visual-site-frame'
        );
    /* =========================================================
       현재 상태
    ========================================================= */
    let isPersonal =
        false;
    /* =========================================================
       IFRAME 크기 계산
    ========================================================= */
    function resizePreview(iframe) {
        const screen = iframe.closest('.visual-preview-screen');
        if (!screen) return;
        const viewportWidth = Number(iframe.dataset.width);
        const viewportHeight = Number(iframe.dataset.height);
        if (!viewportWidth || !viewportHeight) { return; }
        /* =====================================================
           iframe 실제 브라우저 크기
        ====================================================== */
        iframe.style.width = `${viewportWidth}px`;
        iframe.style.height = `${viewportHeight}px`;
        /* =====================================================
           현재 목업 화면 크기
        ====================================================== */
        const screenWidth = screen.clientWidth;
        const screenHeight = screen.clientHeight;
        if (!screenWidth || !screenHeight) { return; }
        /* =====================================================
           목업 크기에 맞춰 축소
        ====================================================== */
        const scaleX = screenWidth / viewportWidth;
        const scaleY = screenHeight / viewportHeight;
        const scale = Math.min(scaleX, scaleY);
        iframe.style.transform = `scale(${scale})`;
    }
    /* =========================================================
       홈페이지 주소 변경
    ========================================================= */

    function changeWebsite(url) {
        const homepageLink = section.querySelector('#visual-homepage-link');
        if (homepageLink) {
            const label = isPersonal ? '개인 홈페이지 보기' : '팀 홈페이지 보기';
            homepageLink.href = url;
            homepageLink.setAttribute('aria-label', `${label} (새 탭)`);
            homepageLink.querySelector('span').textContent = label;
        }
        previewFrames.forEach(
            (iframe) => {
                const screen = iframe.closest('.visual-preview-screen');
                if (screen) { screen.classList.add('is-loading'); }
                iframe.src = url;
            }
        );
    }
    /* =========================================================
       최초 프로젝트 홈페이지 연결
    ======================================================== */
    previewFrames.forEach(
        (iframe) => {
            iframe.src = projectURL;
            resizePreview(iframe);
        }
    );
    /* =========================================================
       IFRAME 로딩 완료
    ========================================================= */
    previewFrames.forEach(
        (iframe) => {
            iframe.addEventListener('load', () => {
                resizePreview(iframe);
                const screen = iframe.closest('.visual-preview-screen');
                if (screen) {
                    window.setTimeout(() => {
                        screen.classList.remove(
                            'is-loading'
                        );
                    }, 180);
                }
            }
            );
        }
    );
    /* =========================================================
       EXPLORE WORKS
       프로젝트 ↔ 개인 홈페이지
    ========================================================= */
    if (exploreButton) {
        exploreButton.addEventListener('click',
            (event) => {
                event.preventDefault();
                /* =================================================
                   개인 홈페이지 → 프로젝트
                ================================================= */
                if (isPersonal) {
                    isPersonal = false;
                    section.classList.remove('is-personal');
                    changeWebsite(projectURL);
                    if (exploreText) { exploreText.textContent = '개인 프로젝트'; }
                    if (exploreArrow) { exploreArrow.textContent = '→'; }
                    return;
                }
                /* =================================================
                   프로젝트 → 개인 홈페이지
                ================================================= */
                isPersonal = true;
                section.classList.add('is-personal');
                changeWebsite(personalURL);
                if (exploreText) { exploreText.textContent = '팀 프로젝트'; }
                if (exploreArrow) { exploreArrow.textContent = '←'; }
            }
        );
    }
    /* =========================================================
       RESIZE OBSERVER
    ========================================================= */
    if ('ResizeObserver' in window) {
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const screen = entry.target;
                const iframe = screen.querySelector('.visual-site-frame');
                if (!iframe) return;
                resizePreview(iframe);
            }
            );
        }
        );
        gallery.querySelectorAll('.visual-preview-screen')
            .forEach((screen) => { resizeObserver.observe(screen); }
            );
    }
    /* =========================================================
       WINDOW RESIZE
    ========================================================= */
    window.addEventListener('resize', () => {
        previewFrames.forEach((iframe) => {
            resizePreview(iframe);
        }
        );
    }
    );
    /* =========================================================
       등장 애니메이션
    ========================================================= */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) { return; }
                    section.classList.add('is-visible');
                    observer.disconnect();
                }
                );
            },
            { threshold: .2 }
        );
        observer.observe(section);
    }
    else {
        section.classList.add(
            'is-visible'
        );
    }
})();
