
/* =========================================================
   VELMORA HOTELS & RESORTS
   Main JavaScript
   File: js/script.js
========================================================= */

"use strict";

/* =========================================================
   1. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializePreloader();
    initializePageTransitions();
    initializeHeader();
    initializeMobileMenu();
    initializeActiveNavigation();
    initializeBackToTop();
    initializeScrollAnimations();
    initializeRoomFilters();
    initializeRoomWishlist();
    initializeRoomReservation();
    initializeOfferActions();
    initializeOfferModal();
    initializeHomeBookingForm();
    initializeContactForm();
    initializeBookingForm();
    initializeFormValidation();
    initializeSmoothScroll();
    initializeImageFallback();
    initializeFooterYear();
    initializeHeaderScroll();
});


/* =========================================================
   2. PRELOADER ANIMATION
========================================================= */

function initializePreloader() {
    const preloader = document.getElementById("preloader");
    const progressBar = document.getElementById("preloader-progress");
    const percentage = document.getElementById("preloader-percent");
    const preloaderText = document.getElementById("preloader-text");

    if (!preloader) return;

    let progress = 0;
    let completed = false;

    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.floor(Math.random() * 5) + 1;
            progress = Math.min(progress, 90);
        }

        updateProgress();
    }, 80);

    function updateProgress() {
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (percentage) {
            percentage.textContent = `${progress}%`;
        }

        if (preloaderText) {
            if (progress < 30) {
                preloaderText.textContent = "Preparing Your Experience";
            } else if (progress < 65) {
                preloaderText.textContent = "Discovering Luxury";
            } else {
                preloaderText.textContent = "Almost Ready";
            }
        }
    }

    function finishPreloader() {
        if (completed) return;
        completed = true;

        clearInterval(progressInterval);

        progress = 100;
        updateProgress();

        setTimeout(() => {
            preloader.classList.add("preloader-hidden");
            document.body.classList.add("page-loaded");

            setTimeout(() => {
                preloader.style.display = "none";
            }, 900);
        }, 350);
    }

    if (document.readyState === "complete") {
        finishPreloader();
    } else {
        window.addEventListener("load", finishPreloader, {
            once: true
        });
    }

    // Safety fallback
    setTimeout(finishPreloader, 5000);

    // Back/forward cache: never leave the loader stuck on screen
    window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
            preloader.classList.add("preloader-hidden");
            preloader.style.display = "none";
            document.body.classList.add("page-loaded");
        }
    });
}


/* =========================================================
   3. PAGE TRANSITIONS
========================================================= */

function initializePageTransitions() {
    const preloader = document.getElementById("preloader");

    if (!preloader) return;

    const internalLinks = document.querySelectorAll(
        'a[href$=".html"], a[href*=".html?"]'
    );

    internalLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (
                !href ||
                href.startsWith("#") ||
                link.target === "_blank" ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const destination = new URL(href, window.location.href);

            if (destination.origin !== window.location.origin) {
                return;
            }

            if (destination.href === window.location.href) {
                return;
            }

            event.preventDefault();

            preloader.style.display = "flex";
            preloader.classList.remove("preloader-hidden");

            document.body.classList.remove("page-loaded");

            const progressBar = document.getElementById(
                "preloader-progress"
            );

            const percentage = document.getElementById(
                "preloader-percent"
            );

            let progress = 0;

            const transitionInterval = setInterval(() => {
                progress += 10;

                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }

                if (percentage) {
                    percentage.textContent = `${progress}%`;
                }

                if (progress >= 100) {
                    clearInterval(transitionInterval);
                    window.location.href = destination.href;
                }
            }, 35);

            setTimeout(() => {
                window.location.href = destination.href;
            }, 1200);
        });
    });
}


/* =========================================================
   4. HEADER INITIALIZATION
========================================================= */

function initializeHeader() {
    const header = document.getElementById("site-header");

    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("header-scrolled");
    }
}


/* =========================================================
   5. HEADER SCROLL EFFECT
========================================================= */

function initializeHeaderScroll() {
    const header = document.getElementById("site-header");

    if (!header) return;

    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 60) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }

        if (currentScroll > lastScroll && currentScroll > 400) {
            header.classList.add("header-hidden");
        } else {
            header.classList.remove("header-hidden");
        }

        lastScroll = currentScroll;
    }, { passive: true });
}


/* =========================================================
   6. MOBILE NAVIGATION
========================================================= */

function initializeMobileMenu() {
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (!menuToggle || !navMenu) return;

    function closeMenu() {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");

        document.body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
    }

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        document.body.classList.toggle("menu-open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", event => {
        if (
            !navMenu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 991) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
}


/* =========================================================
   7. ACTIVE NAVIGATION LINK
========================================================= */

function initializeActiveNavigation() {
    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() || "index.html";

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (!linkPage) return;

        const cleanLink = linkPage.split("?")[0].toLowerCase();

        if (cleanLink === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}


/* =========================================================
   8. SCROLL REVEAL ANIMATIONS
========================================================= */

function initializeScrollAnimations() {
    // AOS animation library
    function startAOS() {
        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 900,
                easing: "ease-out-cubic",
                once: true,
                offset: 80,
                delay: 50,
                mirror: false
            });
        }
    }

    startAOS();

    window.addEventListener("load", startAOS, {
        once: true
    });

    // Additional reveal animation
    const revealElements = document.querySelectorAll(
        ".signature-card, " +
        ".featured-room-card, " +
        ".feature-card, " +
        ".hotel-property-card, " +
        ".room-card, " +
        ".offer-card, " +
        ".why-choose-card, " +
        ".about-value-card, " +
        ".contact-info-card, " +
        ".membership-benefit"
    );

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(element => {
            element.classList.add("revealed");
        });
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach(element => {
        element.classList.add("reveal-ready");
        revealObserver.observe(element);
    });
}


/* =========================================================
   9. BACK TO TOP BUTTON
========================================================= */

function initializeBackToTop() {
    const backToTop = document.getElementById("back-to-top");

    if (!backToTop) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 450) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    }, { passive: true });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =========================================================
   10. TOAST NOTIFICATION
========================================================= */

function showToast(message, type = "success") {
    let toast = document.getElementById("toast-message");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-message";
        toast.className = "toast-message";
        document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.remove(
        "show",
        "success",
        "error",
        "warning"
    );

    toast.classList.add(type);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    clearTimeout(toast.toastTimer);

    toast.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


/* =========================================================
   11. ROOM FILTER SYSTEM
========================================================= */

function initializeRoomFilters() {
    const filterButtons = document.querySelectorAll(
        ".room-filter-btn"
    );

    const roomCards = document.querySelectorAll(".room-card");

    const roomsCount = document.getElementById("rooms-count");

    const emptyState = document.getElementById(
        "rooms-empty-state"
    );

    if (!filterButtons.length || !roomCards.length) return;

    function applyFilter(category) {
        let visibleCount = 0;

        roomCards.forEach(card => {
            const cardCategory = card.dataset.category;

            const shouldShow =
                category === "all" ||
                cardCategory === category;

            if (shouldShow) {
                card.hidden = false;
                card.classList.remove("room-hidden");

                requestAnimationFrame(() => {
                    card.classList.add("room-visible");
                });

                visibleCount++;
            } else {
                card.classList.remove("room-visible");
                card.classList.add("room-hidden");
                card.hidden = true;
            }
        });

        if (roomsCount) {
            roomsCount.textContent = `${visibleCount} ${visibleCount === 1 ? "Room" : "Rooms"} Available`;
        }

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            const category = button.dataset.filter || "all";

            applyFilter(category);
        });
    });

    const activeButton = document.querySelector(
        ".room-filter-btn.active"
    );

    applyFilter(
        activeButton?.dataset.filter || "all"
    );
}


/* =========================================================
   12. ROOM WISHLIST
========================================================= */

function initializeRoomWishlist() {
    const wishlistButtons = document.querySelectorAll(
        ".room-wishlist-btn"
    );

    wishlistButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isSaved = button.classList.toggle("saved");

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fas", isSaved);
                icon.classList.toggle("far", !isSaved);
            }

            button.setAttribute(
                "aria-pressed",
                String(isSaved)
            );

            showToast(
                isSaved
                    ? "Room added to your wishlist."
                    : "Room removed from your wishlist."
            );
        });
    });
}


/* =========================================================
   13. ROOM RESERVATION MODAL
========================================================= */

function initializeRoomReservation() {
    const modal = document.getElementById(
        "room-reservation-modal"
    );

    const openButtons = document.querySelectorAll(
        ".room-book-btn"
    );

    const closeButton = document.getElementById(
        "room-modal-close"
    );

    const form = document.getElementById(
        "room-reservation-form"
    );

    if (!modal) return;

    const selectedRoomName = document.getElementById(
        "selected-room-name"
    );

    const selectedRoomPrice = document.getElementById(
        "selected-room-price"
    );

    const selectedRoom = document.getElementById(
        "selected-room"
    );

    const selectedPrice = document.getElementById(
        "selected-price"
    );

    const status = document.getElementById(
        "room-reservation-status"
    );

    function openModal(roomName, roomPrice) {
        if (selectedRoomName) {
            selectedRoomName.textContent = roomName;
        }

        if (selectedRoomPrice) {
            selectedRoomPrice.textContent = roomPrice;
        }

        if (selectedRoom) {
            selectedRoom.value = roomName;
        }

        if (selectedPrice) {
            selectedPrice.value = roomPrice;
        }

        modal.classList.add("active");
        document.body.classList.add("modal-open");

        if (status) {
            status.textContent = "";
        }
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const roomName =
                button.dataset.room || "Selected Room";

            const roomPrice =
                button.dataset.price || "Contact for price";

            openModal(roomName, roomPrice);
        });
    });

    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }

    modal.querySelectorAll("[data-close-modal]").forEach(
        element => {
            element.addEventListener("click", closeModal);
        }
    );

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            closeModal();
        }
    });

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const checkin = form.querySelector('[name="checkin"]');
            const checkout = form.querySelector('[name="checkout"]');
            if (checkin?.value && checkout?.value && checkout.value <= checkin.value) {
                showToast("Please choose a check-out date after check-in.", "error");
                checkout.focus();
                return;
            }

            if (status) {
                status.textContent =
                    "Your reservation request was submitted successfully.";
            }

            showToast(
                "Reservation request submitted successfully!"
            );

            form.reset();

            setTimeout(closeModal, 1800);
        });
    }
}


/* =========================================================
   14. OFFER SAVE / WISHLIST BUTTONS
========================================================= */

function initializeOfferActions() {
    const saveButtons = document.querySelectorAll(
        ".offer-save-btn"
    );

    saveButtons.forEach(button => {
        button.addEventListener("click", () => {
            const isSaved = button.classList.toggle("saved");

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fas", isSaved);
                icon.classList.toggle("far", !isSaved);
            }

            button.setAttribute(
                "aria-pressed",
                String(isSaved)
            );

            showToast(
                isSaved
                    ? "Offer saved to your favourites."
                    : "Offer removed from favourites."
            );
        });
    });
}


/* =========================================================
   15. OFFER CLAIM MODAL
========================================================= */

function initializeOfferModal() {
    const modal = document.getElementById("offer-modal");

    const form = document.getElementById("offer-claim-form");

    const closeButton = document.getElementById(
        "offer-modal-close"
    );

    const selectedOffer = document.getElementById(
        "selected-offer"
    );

    const status = document.getElementById(
        "offer-modal-status"
    );

    if (!modal) return;

    function openOfferModal(offerName) {
        if (selectedOffer) {
            selectedOffer.value = offerName;
        }

        if (status) {
            status.textContent = "";
        }

        modal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeOfferModal() {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    document.querySelectorAll(
        ".offer-claim-btn, .offer-card-link"
    ).forEach(button => {
        button.addEventListener("click", event => {
            const offerName =
                button.dataset.offer ||
                button.closest(".offer-card")
                    ?.querySelector(".offer-card-title")
                    ?.textContent.trim() ||
                "Special Offer";

            // Allow normal navigation for links with real URLs.
            if (
                button.tagName === "A" &&
                button.getAttribute("href") &&
                button.getAttribute("href") !== "#"
            ) {
                return;
            }

            event.preventDefault();

            openOfferModal(offerName);
        });
    });

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeOfferModal
        );
    }

    modal.querySelectorAll("[data-close-offer]").forEach(
        element => {
            element.addEventListener(
                "click",
                closeOfferModal
            );
        }
    );

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {
            closeOfferModal();
        }
    });

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (status) {
                status.textContent =
                    "Your offer request has been received.";
            }

            showToast(
                "Your offer request has been submitted!"
            );

            form.reset();

            setTimeout(closeOfferModal, 1800);
        });
    }
}


/* =========================================================
   16. HOME PAGE BOOKING SEARCH
========================================================= */

function initializeHomeBookingForm() {
    const form = document.getElementById(
        "home-booking-form"
    );

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const destination = document.getElementById(
            "home-destination"
        )?.value.trim();

        const checkin = document.getElementById(
            "home-checkin"
        )?.value;

        const checkout = document.getElementById(
            "home-checkout"
        )?.value;

        const guests = document.getElementById(
            "home-guests"
        )?.value;

        if (checkin && checkout && checkout <= checkin) {
            showToast(
                "Check-out date must be after check-in date.",
                "error"
            );
            return;
        }

        const params = new URLSearchParams();

        if (destination) {
            params.set("destination", destination);
        }

        if (checkin) {
            params.set("checkin", checkin);
        }

        if (checkout) {
            params.set("checkout", checkout);
        }

        if (guests) {
            params.set("guests", guests);
        }

        showToast(
            "Your search details are ready. Continue to booking."
        );

        setTimeout(() => {
            window.location.href =
                `booking.html?${params.toString()}`;
        }, 800);
    });
}


/* =========================================================
   17. CONTACT FORM
========================================================= */

function initializeContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const name = form.querySelector(
            '[name="name"], #contact-name'
        )?.value.trim();

        const status = document.getElementById(
            "contact-form-status"
        );

        if (status) {
            status.textContent =
                `Thank you${name ? `, ${name}` : ""}! Your message has been prepared successfully.`;
        }

        showToast(
            "Thank you! Your message has been submitted."
        );

        form.reset();
    });
}


/* =========================================================
   18. MAIN BOOKING FORM
========================================================= */

function initializeBookingForm() {
    const form = document.getElementById("booking-form");

    if (!form) return;

    // Read booking details passed from the home page.
    const params = new URLSearchParams(
        window.location.search
    );

    const destination = params.get("destination");
    const checkin = params.get("checkin");
    const checkout = params.get("checkout");
    const guests = params.get("guests");

    const destinationField = form.querySelector(
        '[name="destination"], #booking-destination'
    );

    const checkinField = form.querySelector(
        '[name="checkin"], #booking-checkin'
    );

    const checkoutField = form.querySelector(
        '[name="checkout"], #booking-checkout'
    );

    const guestsField = form.querySelector(
        '[name="guests"], #booking-guests'
    );

    if (destination && destinationField) {
        destinationField.value = destination;
    }

    if (checkin && checkinField) {
        checkinField.value = checkin;
    }

    if (checkout && checkoutField) {
        checkoutField.value = checkout;
    }

    if (guests && guestsField) {
        guestsField.value = guests;
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const checkinValue = checkinField?.value;
        const checkoutValue = checkoutField?.value;

        if (
            checkinValue &&
            checkoutValue &&
            checkoutValue <= checkinValue
        ) {
            showToast(
                "Please select a valid check-out date.",
                "error"
            );
            checkoutField?.focus();
            return;
        }

        const status = document.getElementById(
            "booking-form-status"
        );

        if (status) {
            status.textContent =
                "Your booking request has been prepared successfully.";
        }

        showToast(
            "Your booking request has been submitted successfully!"
        );

        form.reset();
    });
}


/* =========================================================
   19. FORM VALIDATION HELPERS
========================================================= */

function initializeFormValidation() {
    const dateInputs = document.querySelectorAll(
        'input[type="date"]'
    );

    const today = new Date();

    const localToday = new Date(
        today.getTime() -
        today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInputs.forEach(input => {
        if (!input.min) {
            input.min = localToday;
        }
    });

    const emailInputs = document.querySelectorAll(
        'input[type="email"]'
    );

    emailInputs.forEach(input => {
        input.addEventListener("input", () => {
            input.setCustomValidity("");

            if (
                input.value &&
                !input.validity.valid
            ) {
                input.setCustomValidity(
                    "Please enter a valid email address."
                );
            }
        });
    });

    const phoneInputs = document.querySelectorAll(
        'input[type="tel"]'
    );

    phoneInputs.forEach(input => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(
                /[^0-9+\-\s()]/g,
                ""
            );
        });
    });
}


/* =========================================================
   20. SMOOTH SCROLL
========================================================= */

function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    anchorLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const header = document.getElementById(
                "site-header"
            );

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
}


/* =========================================================
   21. IMAGE FALLBACK
========================================================= */

function initializeImageFallback() {
    const images = document.querySelectorAll("img");

    images.forEach(image => {
        image.addEventListener("error", () => {
            image.classList.add("image-error");

            image.style.backgroundColor = "#e8e5dd";
            image.style.objectFit = "cover";

            if (!image.dataset.fallbackApplied) {
                image.dataset.fallbackApplied = "true";
                image.alt = image.alt || "VELMORA luxury hospitality";
            }
        });
    });
}


/* =========================================================
   22. FOOTER YEAR
========================================================= */

function initializeFooterYear() {
    const yearElements = document.querySelectorAll(
        ".current-year, #current-year"
    );

    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });
}


/* =========================================================
   23. BUTTON RIPPLE EFFECT
========================================================= */

document.addEventListener("click", event => {
    const button = event.target.closest(
        ".btn, " +
        ".nav-book-btn, " +
        ".booking-search-btn, " +
        ".offer-claim-btn, " +
        ".contact-submit-btn, " +
        ".booking-submit-btn"
    );

    if (!button) return;

    const ripple = document.createElement("span");

    ripple.className = "button-ripple";

    const rect = button.getBoundingClientRect();

    const size = Math.max(rect.width, rect.height);

    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;

    ripple.style.left =
        `${event.clientX - rect.left - size / 2}px`;

    ripple.style.top =
        `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 650);
});


/* =========================================================
   24. COUNTER ANIMATION
========================================================= */

function initializeCounters() {
    const counters = document.querySelectorAll(
        "[data-counter]"
    );

    if (!counters.length) return;

    if (!("IntersectionObserver" in window)) return;

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const counter = entry.target;

                const target = Number(
                    counter.dataset.counter
                );

                if (!Number.isFinite(target)) {
                    observer.unobserve(counter);
                    return;
                }

                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;

                    const progress = Math.min(
                        elapsed / duration,
                        1
                    );

                    const easedProgress =
                        1 - Math.pow(1 - progress, 4);

                    const currentValue = Math.floor(
                        target * easedProgress
                    );

                    counter.textContent = currentValue.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCounter);

                observer.unobserve(counter);
            });
        },
        {
            threshold: 0.5
        }
    );

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

initializeCounters();


/* =========================================================
   25. PARALLAX EFFECT
========================================================= */

function initializeParallax() {
    const parallaxElements = document.querySelectorAll(
        ".home-hero-background, " +
        ".luxury-banner-image, " +
        ".hotels-experience-background, " +
        ".membership-background"
    );

    if (!parallaxElements.length) return;

    let ticking = false;

    function updateParallax() {
        const scrollPosition = window.scrollY;

        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > window.innerHeight
            ) {
                return;
            }

            const movement =
                (rect.top - window.innerHeight / 2) * 0.08;

            element.style.transform =
                `translate3d(0, ${movement}px, 0)`;
        });

        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

initializeParallax();


/* =========================================================
   26. ACCESSIBILITY: MODAL FOCUS
========================================================= */

document.addEventListener("keydown", event => {
    if (event.key !== "Tab") return;

    const activeModal = document.querySelector(
        ".room-reservation-modal.active, " +
        "#room-reservation-modal.active, " +
        "#offer-modal.active"
    );

    if (!activeModal) return;

    const focusableElements = activeModal.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );

    const focusable = Array.from(focusableElements).filter(
        element => !element.disabled
    );

    if (!focusable.length) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (
        event.shiftKey &&
        document.activeElement === firstElement
    ) {
        event.preventDefault();
        lastElement.focus();
    } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
    ) {
        event.preventDefault();
        firstElement.focus();
    }
});


/* =========================================================
   27. INITIAL PAGE STATE
========================================================= */

window.addEventListener("load", () => {
    document.body.classList.add("page-ready");

    if (typeof AOS !== "undefined") {
        AOS.refresh();
    }
});

console.log(
    "%c VELMORA HOTELS & RESORTS ",
    "background:#142B32;color:#D6B779;padding:10px;font-size:14px;font-weight:bold;"
);

console.log(
    "Luxury hospitality experience initialized successfully."
);
