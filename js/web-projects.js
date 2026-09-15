(() => {

    const section =
        document.querySelector(
            '#web-projects'
        );


    if (!section) return;


    const gallery =
        section.querySelector(
            '.web-projects-gallery'
        );


    const heading =
        section.querySelector(
            '.section-heading'
        );


    if (!gallery) return;



    /* =========================================================
       VIEW PROJECTS BUTTON
    ========================================================= */

    if (
        heading &&
        !heading.querySelector(
            '.web-projects-link'
        )
    ) {

        const link =
            document.createElement(
                'a'
            );


        link.className =
            'web-projects-link';


        link.href =
            '#visual-works';


        link.innerHTML =
            'VIEW PROJECTS <span>→</span>';


        heading.appendChild(
            link
        );

    }



    /* =========================================================
       COLLAGE DATA
    ========================================================= */

    const projects = [

        './img/profile-workspace.jpg',

        './img/profile-detail.jpg',

        './img/ui-design.jpg',

        './img/projects.jpg',

        './img/poster.jpg',

        './img/branding.jpg',

        './img/popup.jpg',

        './img/detail-page.jpg'

    ];



    gallery.innerHTML = '';



    projects.forEach(
        (
            image,
            index
        ) => {

            const card =
                document.createElement(
                    'figure'
                );


            card.className =
                `project-collage-card project-card-${index + 1}`;


            card.dataset.depth =
                String(
                    0.4 +
                    index * 0.08
                );


            card.innerHTML = `

                <img
                    src="${image}"
                    alt=""
                >

            `;


            const img =
                card.querySelector(
                    'img'
                );


            img.addEventListener(
                'error',
                () => {

                    img.style.display =
                        'none';


                    card.style.background =
                        'linear-gradient(145deg,#e8ddd1,#bca892)';

                }
            );


            gallery.appendChild(
                card
            );

        }
    );



    /* =========================================================
       HAND NOTES
    ========================================================= */

    const notes = [

        [
            'project-note-1',
            'Design<br>a brighter<br>tomorrow'
        ],

        [
            'project-note-2',
            'Build<br>Create<br>Share'
        ],

        [
            'project-note-3',
            'Small<br>details<br>Big impact'
        ]

    ];


    notes.forEach(
        (
            [
                className,
                text
            ]
        ) => {

            const note =
                document.createElement(
                    'div'
                );


            note.className =
                `project-hand-note ${className}`;


            note.innerHTML =
                text;


            section.appendChild(
                note
            );

        }
    );



    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            section.classList.add(
                                'is-visible'
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.22
            }
        );


    observer.observe(
        section
    );



    /* =========================================================
       MOUSE PARALLAX
    ========================================================= */

    const cards =
        [
            ...gallery.querySelectorAll(
                '.project-collage-card'
            )
        ];


    section.addEventListener(
        'mousemove',
        (event) => {

            if (
                window.innerWidth <=
                820
            ) {
                return;
            }


            const rect =
                section.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width -
                0.5;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height -
                0.5;


            cards.forEach(
                (card) => {

                    const depth =
                        Number(
                            card.dataset.depth
                        ) || 1;


                    const moveX =
                        x *
                        25 *
                        depth;


                    const moveY =
                        y *
                        20 *
                        depth;


                    card.style.translate =
                        `${moveX}px ${moveY}px`;

                }
            );

        }
    );



    section.addEventListener(
        'mouseleave',
        () => {

            cards.forEach(
                (card) => {

                    card.style.translate =
                        '0 0';

                }
            );

        }
    );

})();