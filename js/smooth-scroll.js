/* =========================================================
   ULTRA FAST INERTIA SCROLL
   매우 강한 휠 파워 + 강한 관성
========================================================= */

(() => {
    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

    if (isTouchDevice) return;

    let velocity = 0;
    let animationId = null;

    /* =====================================================
       ULTRA 설정
    ===================================================== */

    // 휠 한 번에 화면 높이의 몇 배 힘을 줄지
    const impulsePower = 1.8;

    // 휠 입력값 추가 증폭
    const wheelPower = 40;

    // 최대 속도
    const maxVelocity = 3000;

    // 관성 지속
    const friction = 0.95;

    // 정지 기준
    const stopVelocity = 1;


    /* =====================================================
       DELTA 정규화
    ===================================================== */

    function normalizeDelta(event) {
        let delta = event.deltaY;

        if (event.deltaMode === 1) {
            delta *= 16;
        }

        if (event.deltaMode === 2) {
            delta *= window.innerHeight;
        }

        return delta;
    }


    /* =====================================================
       관성 스크롤
    ===================================================== */

    function animateScroll() {
        window.scrollBy(
            0,
            velocity
        );

        // 관성 감속
        velocity *= friction;

        const scrollTop =
            window.scrollY;

        const maxScroll =
            document.documentElement.scrollHeight -
            window.innerHeight;

        // 페이지 끝에서 정지
        if (
            scrollTop <= 0 &&
            velocity < 0
        ) {
            velocity = 0;
        }

        if (
            scrollTop >= maxScroll &&
            velocity > 0
        ) {
            velocity = 0;
        }

        if (
            Math.abs(velocity) >
            stopVelocity
        ) {
            animationId =
                requestAnimationFrame(
                    animateScroll
                );
        } else {
            velocity = 0;
            animationId = null;
        }
    }


    /* =====================================================
       WHEEL
    ===================================================== */

    window.addEventListener(
        'wheel',
        (event) => {
            if (event.ctrlKey) return;

            if (
                Math.abs(event.deltaX) >
                Math.abs(event.deltaY)
            ) {
                return;
            }

            event.preventDefault();

            const delta =
                normalizeDelta(event);

            const direction =
                delta > 0 ? 1 : -1;

            /*
               핵심:
               휠 값이 작더라도
               화면 높이를 기준으로
               강제 추진력 부여
            */

            const viewportImpulse =
                window.innerHeight *
                impulsePower;

            const wheelImpulse =
                Math.abs(delta) *
                wheelPower;

            const impulse =
                direction *
                Math.max(
                    viewportImpulse,
                    wheelImpulse
                );

            velocity += impulse;

            // 최대 속도 제한
            velocity = Math.max(
                -maxVelocity,
                Math.min(
                    maxVelocity,
                    velocity
                )
            );

            if (!animationId) {
                animationId =
                    requestAnimationFrame(
                        animateScroll
                    );
            }
        },
        {
            passive: false
        }
    );
})();