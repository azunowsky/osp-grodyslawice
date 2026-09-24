/* =========================================================
   OSP GRODYSŁAWICE
   Vanilla JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       HEADER
    ====================================================== */

    const header = document.getElementById("siteHeader");

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 20);
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();


    /* =====================================================
       MENU MOBILNE
    ====================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const closeMenu = () => {
        menuToggle.classList.remove("active");
        mainNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });


    /* =====================================================
       AKTYWNA POZYCJA MENU
    ====================================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = mainNav.querySelectorAll("a");

    const sectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                navLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            });
        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );

    sections.forEach(section => sectionObserver.observe(section));


    /* =====================================================
       ANIMACJE PRZY PRZEWIJANIU
    ====================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* =====================================================
       LIGHTBOX GALERII
    ====================================================== */

    const galleryItems = [...document.querySelectorAll(".gallery-item")];
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxClose = document.getElementById("lightboxClose");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");

    let currentIndex = 0;

    const openLightbox = index => {
        currentIndex = index;

        const item = galleryItems[currentIndex];
        const image = item.querySelector("img");

        lightboxImage.src = item.dataset.full;
        lightboxImage.alt = image.alt;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");
    };

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");

        // Czyści źródło po zamknięciu.
        // Dzięki temu przeglądarka nie trzyma niepotrzebnie dużego zdjęcia.
        lightboxImage.src = "";
    };

    const showPrevious = () => {
        const nextIndex =
            (currentIndex - 1 + galleryItems.length) % galleryItems.length;

        openLightbox(nextIndex);
    };

    const showNext = () => {
        const nextIndex =
            (currentIndex + 1) % galleryItems.length;

        openLightbox(nextIndex);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrevious);
    lightboxNext.addEventListener("click", showNext);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });



    /* =====================================================
       FILM W GALERII
    ====================================================== */

    const videoItems = [...document.querySelectorAll(".gallery-video")];
    const videoLightbox = document.getElementById("videoLightbox");
    const videoLightboxClose = document.getElementById("videoLightboxClose");
    const lightboxVideo = document.getElementById("lightboxVideo");

    const openVideo = item => {
        const source = item.dataset.video;

        lightboxVideo.src = source;
        videoLightbox.classList.add("active");
        videoLightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("no-scroll");

        const playPromise = lightboxVideo.play();

        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Przeglądarka może wymagać ręcznego naciśnięcia Play.
            });
        }
    };

    const closeVideo = () => {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
        lightboxVideo.load();

        videoLightbox.classList.remove("active");
        videoLightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("no-scroll");
    };

    videoItems.forEach(item => {
        item.addEventListener("click", () => openVideo(item));
    });

    videoLightboxClose.addEventListener("click", closeVideo);

    videoLightbox.addEventListener("click", event => {
        if (event.target === videoLightbox) {
            closeVideo();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (videoLightbox.classList.contains("active")) {
                closeVideo();
                return;
            }

            if (lightbox.classList.contains("active")) {
                closeLightbox();
                return;
            }
        }

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "ArrowLeft") {
            showPrevious();
        }

        if (event.key === "ArrowRight") {
            showNext();
        }
    });

});
