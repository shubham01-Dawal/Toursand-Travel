/* =========================================
   BASE PATH HELPER
   (pages inside /templates/ need a different
   relative path than index.html at the root)
========================================= */

const basePath =
    window.location.pathname.includes("/templates/")
        ? ""
        : "templates/";


document.addEventListener("DOMContentLoaded", function () {

    /* Home page tours */
    displayHomeTours();


    /* Home search */
    setupHomeSearch();


    /* Tours page */
    displayAllTours();


    /* Tours page search */
    setupTourPageSearch();


    /* Contact form */
    setupContactForm();


    /* Login form */
    setupLoginForm();


    /* Register form */
    setupRegisterForm();


    /* Booking page */
    setupBookingPage();


    /* Navbar scroll behavior */
    setupNavbarScroll();


    /* Scroll reveal animations */
    setupScrollAnimations();

});


/* =========================================
   HOME TOURS
========================================= */

function displayHomeTours() {

    const container =
        document.getElementById("homeTourCards");

    if (!container) return;


    const popularTours =
        tours.slice(0, 3);


    container.innerHTML = "";


    popularTours.forEach(function (tour) {

        container.innerHTML += createTourCard(tour);

    });

}


/* =========================================
   CREATE TOUR CARD
========================================= */

function createTourCard(tour) {

    return `

        <div class="col-md-6 col-lg-4">

            <div class="tour-card">

                <div class="tour-card-image">

                    <img
                        src="${tour.image}"
                        alt="${tour.name}"
                        loading="lazy">

                    <span class="tour-badge">

                        ${tour.type}

                    </span>

                </div>


                <div class="tour-body">

                    <h4>

                        ${tour.name}

                    </h4>


                    <p class="tour-description">

                        ${tour.description}

                    </p>


                    <div class="tour-info">

                        <span>

                            <i class="bi bi-geo-alt"></i>

                            ${tour.destination}

                        </span>


                        <span>

                            <i class="bi bi-clock"></i>

                            ${tour.duration}

                        </span>

                    </div>


                    <div
                        class="d-flex
                               justify-content-between
                               align-items-center">

                        <span class="tour-price">

                            ₹${tour.price.toLocaleString("en-IN")}

                        </span>


                        <a
                            href="${basePath}booking.html?id=${tour.id}"
                            class="btn btn-primary btn-sm">

                            Book Now

                        </a>

                    </div>

                </div>

            </div>

        </div>

    `;

}


/* =========================================
   HOME SEARCH
========================================= */

function setupHomeSearch() {

    const form =
        document.getElementById("homeSearchForm");

    if (!form) return;


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const destination =
            document
                .getElementById("homeDestination")
                .value
                .trim();


        const type =
            document
                .getElementById("homeTourType")
                .value;


        const budget =
            document
                .getElementById("homeBudget")
                .value;


        const params =
            new URLSearchParams();


        if (destination) {

            params.set(
                "destination",
                destination
            );

        }


        if (type) {

            params.set(
                "type",
                type
            );

        }


        if (budget) {

            params.set(
                "budget",
                budget
            );

        }


        window.location.href =
            "templates/tours.html?" +
            params.toString();

    });

}


/* =========================================
   ALL TOURS PAGE
========================================= */

function displayAllTours() {

    const container =
        document.getElementById("allTourCards");

    if (!container) return;


    const noResult =
        document.getElementById("noTourResult");


    let filteredTours = [...tours];


    const params =
        new URLSearchParams(
            window.location.search
        );


    const destination =
        params.get("destination");


    const type =
        params.get("type");


    const budget =
        params.get("budget");


    if (destination) {

        const searchText =
            destination.toLowerCase();


        filteredTours =
            filteredTours.filter(function (tour) {

                return (

                    tour.name
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    tour.destination
                        .toLowerCase()
                        .includes(searchText)

                );

            });

    }


    if (type) {

        filteredTours =
            filteredTours.filter(function (tour) {

                return tour.type === type;

            });

    }


    if (budget) {

        filteredTours =
            filteredTours.filter(function (tour) {

                return (
                    tour.price <=
                    Number(budget)
                );

            });

    }


    container.innerHTML = "";


    if (filteredTours.length === 0) {

        if (noResult) {

            noResult.style.display =
                "block";

        }

        return;

    }


    if (noResult) {

        noResult.style.display =
            "none";

    }


    filteredTours.forEach(function (tour) {

        container.innerHTML +=
            createTourCard(tour);

    });

}


/* =========================================
   TOURS PAGE SEARCH
========================================= */

function setupTourPageSearch() {

    const form =
        document.getElementById(
            "tourSearchForm"
        );

    if (!form) return;


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const destination =
            document
                .getElementById("tourDestination")
                .value
                .trim();


        const type =
            document
                .getElementById("tourType")
                .value;


        const budget =
            document
                .getElementById("tourBudget")
                .value;


        const params =
            new URLSearchParams();


        if (destination) {

            params.set(
                "destination",
                destination
            );

        }


        if (type) {

            params.set(
                "type",
                type
            );

        }


        if (budget) {

            params.set(
                "budget",
                budget
            );

        }


        window.location.search =
            params.toString();

    });

}


/* =========================================
   CONTACT FORM
========================================= */

function setupContactForm() {

    const form =
        document.getElementById(
            "contactForm"
        );

    if (!form) return;


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        // Show inline success alert
        const successAlert = document.getElementById("contactSuccessAlert");
        if (successAlert) {
            successAlert.classList.remove("d-none");
            successAlert.scrollIntoView({ behavior: "smooth", block: "center" });

            // Auto-hide after 5 seconds
            setTimeout(function () {
                successAlert.classList.add("d-none");
            }, 5000);
        }

        form.reset();

    });

}


/* =========================================
   LOGIN
========================================= */

function setupLoginForm() {

    const form =
        document.getElementById(
            "loginForm"
        );

    if (!form) return;


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        alert(
            "Login successful! Backend will be connected later."
        );


        form.reset();

    });

}


/* =========================================
   REGISTER
========================================= */

function setupRegisterForm() {

    const form =
        document.getElementById(
            "registerForm"
        );

    if (!form) return;


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const password =
            document.getElementById(
                "registerPassword"
            ).value;


        const confirmPassword =
            document.getElementById(
                "confirmPassword"
            ).value;


        if (password !== confirmPassword) {

            alert(
                "Password and Confirm Password do not match."
            );

            return;

        }


        alert(
            "Registration successful! Backend will be connected later."
        );


        form.reset();

    });

}


/* =========================================
   BOOKING
========================================= */

function setupBookingPage() {

    const form =
        document.getElementById(
            "bookingForm"
        );

    if (!form) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const tourId =
        Number(
            params.get("id")
        );


    const selectedTour =
        tours.find(function (tour) {

            return tour.id === tourId;

        });


    if (selectedTour) {

        const name =
            document.getElementById(
                "bookingTourName"
            );


        const price =
            document.getElementById(
                "bookingTourPrice"
            );


        if (name) {

            name.textContent =
                selectedTour.name;

        }


        if (price) {

            price.textContent =
                "₹" +
                selectedTour.price
                    .toLocaleString("en-IN");

        }

    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        alert(
            "Booking request submitted successfully! Backend will be connected later."
        );


        form.reset();

    });

}


/* =========================================
   NAVBAR SCROLL BEHAVIOR
========================================= */

function setupNavbarScroll() {
    const navbar = document.querySelector(".custom-navbar");
    if (!navbar) return;

    function handleScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add("navbar-scrolled");
        } else {
            navbar.classList.remove("navbar-scrolled");
        }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
}


/* =========================================
   SCROLL REVEAL ANIMATIONS
========================================= */

function setupScrollAnimations() {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("fade-in-up");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    const animateElements = document.querySelectorAll(
        ".tour-card, .feature-card, .contact-card, .form-card, .auth-card"
    );

    animateElements.forEach(function (el) {
        observer.observe(el);
    });
}