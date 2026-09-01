/* =========================================
   TRAVELGO ADMIN PANEL - SETTINGS CONTROLLER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AdminData === "undefined") return;

    loadSettings();
    loadProfile();
    setupSettingsForms();
});

function loadSettings() {
    const s = AdminData.getSettings();
    if (!s) return;

    if (document.getElementById("set-site-name")) document.getElementById("set-site-name").value = s.siteName || "TravelGo";
    if (document.getElementById("set-email")) document.getElementById("set-email").value = s.contactEmail || "support@travelgo.com";
    if (document.getElementById("set-phone")) document.getElementById("set-phone").value = s.phone || "+91 98765 43210";
    if (document.getElementById("set-address")) document.getElementById("set-address").value = s.address || "Mumbai, Maharashtra, India";

    if (document.getElementById("set-auto-confirm")) document.getElementById("set-auto-confirm").checked = !!s.autoConfirmBookings;
    if (document.getElementById("set-allow-cancel")) document.getElementById("set-allow-cancel").checked = !!s.allowCancellation;
    if (document.getElementById("set-cancel-days")) document.getElementById("set-cancel-days").value = s.cancellationDays || 3;

    if (document.getElementById("set-gateway")) document.getElementById("set-gateway").value = s.paymentGateway || "Razorpay / UPI";
}

function loadProfile() {
    const user = AdminAuth.getUser();
    if (!user) return;

    if (document.getElementById("prof-name")) document.getElementById("prof-name").value = user.name || "Admin TravelGo";
    if (document.getElementById("prof-email")) document.getElementById("prof-email").value = user.email || "admin@travelgo.com";
}

function setupSettingsForms() {
    // Website Info Form
    const siteForm = document.getElementById("site-info-form");
    if (siteForm) {
        siteForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const s = AdminData.getSettings();
            s.siteName = document.getElementById("set-site-name").value.trim();
            s.contactEmail = document.getElementById("set-email").value.trim();
            s.phone = document.getElementById("set-phone").value.trim();
            s.address = document.getElementById("set-address").value.trim();

            AdminData.saveSettings(s);
            AdminData.showToast("Website information saved!", "success");
        });
    }

    // Booking Settings Form
    const bookingForm = document.getElementById("booking-settings-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const s = AdminData.getSettings();
            s.autoConfirmBookings = document.getElementById("set-auto-confirm").checked;
            s.allowCancellation = document.getElementById("set-allow-cancel").checked;
            s.cancellationDays = parseInt(document.getElementById("set-cancel-days").value) || 3;

            AdminData.saveSettings(s);
            AdminData.showToast("Booking settings updated!", "success");
        });
    }

    // Payment Settings Form
    const payForm = document.getElementById("payment-settings-form");
    if (payForm) {
        payForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const s = AdminData.getSettings();
            s.paymentGateway = document.getElementById("set-gateway").value;

            AdminData.saveSettings(s);
            AdminData.showToast("Payment configuration saved!", "success");
        });
    }

    // Admin Profile Form
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newName = document.getElementById("prof-name").value.trim();
            const newEmail = document.getElementById("prof-email").value.trim();

            const user = AdminAuth.getUser();
            if (user) {
                user.name = newName;
                user.email = newEmail;
                localStorage.setItem("travelgo_admin_session", JSON.stringify(user));
                AdminData.showToast("Admin profile updated!", "success");

                document.querySelectorAll(".admin-user-name").forEach(el => el.textContent = newName);
                document.querySelectorAll(".admin-avatar-initials").forEach(el => el.textContent = newName.charAt(0).toUpperCase());
            }
        });
    }

    // Password Change Form
    const pwdForm = document.getElementById("password-change-form");
    if (pwdForm) {
        pwdForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const newPwd = document.getElementById("new-password").value;
            const confPwd = document.getElementById("confirm-password").value;

            if (newPwd !== confPwd) {
                AdminData.showToast("Passwords do not match!", "error");
                return;
            }

            if (newPwd.length < 6) {
                AdminData.showToast("Password must be at least 6 characters.", "warning");
                return;
            }

            AdminData.showToast("Password changed successfully!", "success");
            pwdForm.reset();
        });
    }
}
