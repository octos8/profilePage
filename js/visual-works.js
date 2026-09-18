(() => {
    document.querySelectorAll('.visual-works').forEach((section) => {
        const gallery = section.querySelector('.visual-works-gallery');
        if (!gallery) return;
        const previewFrames = gallery.querySelectorAll('.visual-site-frame');
        const projectURL = section.dataset.projectUrl;

        function resizePreview(iframe) {
            const screen = iframe.closest('.visual-preview-screen');
            const width = Number(iframe.dataset.width);
            const height = Number(iframe.dataset.height);
            if (!screen || !width || !height) return;
            iframe.style.width = `${width}px`;
            iframe.style.height = `${height}px`;
            if (!screen.clientWidth || !screen.clientHeight) return;
            const scale = Math.min(screen.clientWidth / width, screen.clientHeight / height);
            iframe.style.transform = `scale(${scale})`;
        }

        previewFrames.forEach((iframe) => {
            iframe.addEventListener('load', () => resizePreview(iframe));
            if (projectURL && iframe.getAttribute('src') !== projectURL) {
                iframe.src = projectURL;
            }
            resizePreview(iframe);
        });

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver((entries) => {
                entries.forEach(({ target }) => {
                    const iframe = target.querySelector('.visual-site-frame');
                    if (iframe) resizePreview(iframe);
                });
            });
            gallery.querySelectorAll('.visual-preview-screen').forEach((screen) => observer.observe(screen));
        }
        window.addEventListener('resize', () => previewFrames.forEach(resizePreview));

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                section.classList.add('is-visible');
                observer.disconnect();
            }, { threshold: 0.2 });
            observer.observe(gallery);
        } else {
            section.classList.add('is-visible');
        }
    });
})();
