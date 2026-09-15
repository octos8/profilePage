(() => {

    const section =
        document.querySelector(
            '#visual-works'
        );


    if (!section) return;


    const gallery =
        section.querySelector(
            '.visual-works-gallery'
        );


    const heading =
        section.querySelector(
            '.section-heading'
        );


    if (!gallery) return;



    /* =========================================================
       EXPLORE WORKS
    ========================================================= */

    if (
        heading &&
        !heading.querySelector(
            '.visual-explore-link'
        )
    ) {

        const link =
            document.createElement(
                'a'
            );


        link.className =
            'visual-explore-link';


        link.href =
            '#web-projects';


        link.innerHTML =
            `
            EXPLORE WORKS
            <span aria-hidden="true">→</span>
            `;


        heading.appendChild(
            link
        );

    }



    /* =========================================================
       PC + PAD + MO
       한 화면에 동시에 생성
    ========================================================= */

    gallery.innerHTML = `

        <!-- PC -->
        <article
            class="
                visual-device
                visual-device-pc
            "
        >

            <span
                class="
                    visual-device-label
                "
            >
                PC
            </span>


            <div
                class="
                    visual-pc-frame
                "
            >

                <div
                    class="
                        visual-pc-screen
                    "
                >

                    <img
                        src="./img/visual-pc.jpg"
                        alt="PC 디자인 작업 화면"
                    >

                </div>

            </div>


            <div
                class="
                    visual-pc-stand
                "
                aria-hidden="true"
            ></div>


            <div
                class="
                    visual-pc-base
                "
                aria-hidden="true"
            ></div>

        </article>



        <!-- PAD -->
        <article
            class="
                visual-device
                visual-device-pad
            "
        >

            <span
                class="
                    visual-device-label
                "
            >
                PAD
            </span>


            <div
                class="
                    visual-pad-frame
                "
            >

                <div
                    class="
                        visual-pad-screen
                    "
                >

                    <img
                        src="./img/visual-pad.jpg"
                        alt="태블릿 디자인 작업 화면"
                    >

                </div>

            </div>

        </article>



        <!-- MOBILE -->
        <article
            class="
                visual-device
                visual-device-mo
            "
        >

            <span
                class="
                    visual-device-label
                "
            >
                MO
            </span>


            <div
                class="
                    visual-mo-frame
                "
            >

                <div
                    class="
                        visual-mo-screen
                    "
                >

                    <img
                        src="./img/visual-mo.jpg"
                        alt="모바일 디자인 작업 화면"
                    >

                </div>

            </div>

        </article>

    `;



    /* =========================================================
       이미지가 없을 때 임시 이미지
    ========================================================= */

    const imageFallbacks = [
        './img/profile-workspace.jpg',
        './img/profile-detail.jpg',
        './img/popup.jpg'
    ];


    const images =
        gallery.querySelectorAll(
            'img'
        );


    images.forEach(
        (
            image,
            index
        ) => {

            image.addEventListener(
                'error',
                () => {

                    if (
                        image.dataset.fallback
                    ) {
                        return;
                    }


                    image.dataset.fallback =
                        'true';


                    image.src =
                        imageFallbacks[index] ||
                        './img/profile-workspace.jpg';

                }
            );

        }
    );



    /* =========================================================
       장식 이미지
    ========================================================= */

    if (
        !section.querySelector(
            '.visual-deco-left'
        )
    ) {

        const leftDeco =
            document.createElement(
                'div'
            );


        leftDeco.className =
            `
            visual-deco
            visual-deco-left
            `;


        leftDeco.innerHTML = `

            <img
                src="./img/profile-workspace.jpg"
                alt=""
            >

        `;


        const rightDeco =
            document.createElement(
                'div'
            );


        rightDeco.className =
            `
            visual-deco
            visual-deco-right
            `;


        rightDeco.innerHTML = `

            <img
                src="./img/profile-detail.jpg"
                alt=""
            >

        `;


        section.append(
            leftDeco,
            rightDeco
        );

    }



    /* =========================================================
       등장 애니메이션
    ========================================================= */

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        section.classList.add(
                            'is-visible'
                        );


                        observer.disconnect();

                    }
                );

            },
            {
                threshold: .2
            }
        );


    observer.observe(
        section
    );

})();