/* =========================================
   TRAVELGO ADMIN PANEL - AUTHENTICATION GUARD
   ========================================= */

const AdminAuth = (function () {
    const AUTH_KEY = "travelgo_admin_session";
    const DEMO_EMAIL = "admin@travelgo.com";
    const DEMO_PASSWORD = "Admin@123";

    function isLoginPage() {
        return window.location.pathname.endsWith("login.html") || window.location.pathname.endsWith("login");
    }

    function getSession() {
        const session = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
        if (!session) return null;
        try {
            return JSON.parse(session);
        } catch (e) {
            return null;
        }
    }

    function checkAccess() {
        const session = getSession();
        if (!session && !isLoginPage()) {
            window.location.href = "login.html";
        } else if (session && isLoginPage()) {
            window.location.href = "dashboard.html";
        }
    }

    checkAccess();

    document.addEventListener("DOMContentLoaded", function () {
        const session = getSession();
        if (session) {
            const nameEls = document.querySelectorAll(".admin-user-name");
            const avatarEls = document.querySelectorAll(".admin-avatar-initials");

            nameEls.forEach(el => el.textContent = session.name || "Admin TravelGo");
            avatarEls.forEach(el => {
                const initial = (session.name || "A").charAt(0).toUpperCase();
                el.textContent = initial;
            });
        }

        const logoutBtns = document.querySelectorAll(".btn-admin-logout");
        logoutBtns.forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                logout();
            });
        });

        const toggleBtn = document.getElementById("sidebar-toggle-btn");
        const sidebar = document.getElementById("sidebar");
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener("click", function () {
                sidebar.classList.toggle("show");
            });
        }
    });

    function login(email, password, remember = false) {
        if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
            const sessionData = {
                email: DEMO_EMAIL,
                name: "Admin TravelGo",
                loginTime: new Date().toISOString()
            };
            if (remember) {
                localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
            }
            return { success: true };
        }

        return { success: false, message: "Invalid email address or password." };
    }

    function logout() {
        localStorage.removeItem(AUTH_KEY);
        sessionStorage.removeItem(AUTH_KEY);
        if (typeof AdminData !== "undefined") {
            AdminData.showToast("Logged out successfully.", "warning");
        }
        setTimeout(() => {
            window.location.href = "login.html";
        }, 300);
    }

    return {
        login: login,
        logout: logout,
        getUser: getSession
    };
})();
