/* =========================================
   TRAVELGO ADMIN PANEL - SIMPLIFIED DATA STORE
   ========================================= */

const AdminData = (function () {
    const STORAGE_KEYS = {
        TOURS: "travelgo_admin_tours",
        BOOKINGS: "travelgo_admin_bookings",
        DESTINATIONS: "travelgo_admin_destinations",
        PAYMENTS: "travelgo_admin_payments",
        SETTINGS: "travelgo_admin_settings"
    };

    // Initial Mock Seed Data
    const INITIAL_SEED = {
        tours: [
            { id: 1, name: "Goa Beach Tour", destination: "Goa", type: "Beach", duration: "3 Days / 2 Nights", price: 8999, availableSeats: 15, status: "Active", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85", description: "Enjoy beautiful beaches, nightlife and exciting places in Goa." },
            { id: 2, name: "Manali Adventure", destination: "Manali", type: "Hill Station", duration: "5 Days / 4 Nights", price: 14999, availableSeats: 8, status: "Active", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85", description: "Explore mountains, snow and beautiful valleys of Manali." },
            { id: 3, name: "Royal Rajasthan", destination: "Rajasthan", type: "Historical", duration: "6 Days / 5 Nights", price: 16999, availableSeats: 12, status: "Active", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85", description: "Discover forts, palaces and royal culture of Rajasthan." },
            { id: 4, name: "Kerala Backwaters", destination: "Kerala", type: "Beach", duration: "4 Days / 3 Nights", price: 12999, availableSeats: 20, status: "Active", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85", description: "Relax in beautiful backwaters and greenery of Kerala." },
            { id: 5, name: "Ladakh Adventure", destination: "Ladakh", type: "Adventure", duration: "6 Days / 5 Nights", price: 18999, availableSeats: 5, status: "Active", image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85", description: "Experience mountains, monasteries and adventurous roads." },
            { id: 6, name: "Agra Heritage Tour", destination: "Agra", type: "Historical", duration: "2 Days / 1 Night", price: 6999, availableSeats: 25, status: "Active", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85", description: "Visit the Taj Mahal and explore the history of Agra." }
        ],
        destinations: [
            { id: 1, name: "Goa", state: "Goa", status: "Active", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", description: "Sun, sand, and vibrant coastal culture." },
            { id: 2, name: "Manali", state: "Himachal Pradesh", status: "Active", image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80", description: "Snowy peaks and scenic alpine river valleys." },
            { id: 3, name: "Rajasthan", state: "Rajasthan", status: "Active", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80", description: "Majestic palaces, deserts, and grand heritage." },
            { id: 4, name: "Kerala", state: "Kerala", status: "Active", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80", description: "God's Own Country with serene backwaters." },
            { id: 5, name: "Ladakh", state: "Ladakh", status: "Active", image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80", description: "High-altitude desert mountains and crystal lakes." },
            { id: 6, name: "Agra", state: "Uttar Pradesh", status: "Active", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80", description: "Home of the iconic Taj Mahal monument." }
        ],
        bookings: [
            { id: "BK1001", customerName: "Rahul Sharma", email: "rahul.sharma@example.com", phone: "+91 98765 11111", tourId: 1, tourName: "Goa Beach Tour", destination: "Goa", travelDate: "2026-09-10", travelers: 2, amount: 17998, bookingDate: "2026-08-25", paymentStatus: "Paid", bookingStatus: "Confirmed" },
            { id: "BK1002", customerName: "Priya Patel", email: "priya.p@example.com", phone: "+91 98765 22222", tourId: 2, tourName: "Manali Adventure", destination: "Manali", travelDate: "2026-09-15", travelers: 3, amount: 44997, bookingDate: "2026-08-26", paymentStatus: "Paid", bookingStatus: "Confirmed" },
            { id: "BK1003", customerName: "Amit Verma", email: "amit.verma@example.com", phone: "+91 98765 33333", tourId: 3, tourName: "Royal Rajasthan", destination: "Rajasthan", travelDate: "2026-09-20", travelers: 2, amount: 33998, bookingDate: "2026-08-27", paymentStatus: "Pending", bookingStatus: "Pending" },
            { id: "BK1004", customerName: "Sneha Gupta", email: "sneha.g@example.com", phone: "+91 98765 44444", tourId: 4, tourName: "Kerala Backwaters", destination: "Kerala", travelDate: "2026-10-05", travelers: 4, amount: 51996, bookingDate: "2026-08-28", paymentStatus: "Paid", bookingStatus: "Confirmed" },
            { id: "BK1005", customerName: "Vikas Singh", email: "vikas.s@example.com", phone: "+91 98765 55555", tourId: 5, tourName: "Ladakh Adventure", destination: "Ladakh", travelDate: "2026-10-12", travelers: 1, amount: 18999, bookingDate: "2026-08-28", paymentStatus: "Failed", bookingStatus: "Cancelled" },
            { id: "BK1006", customerName: "Ananya Roy", email: "ananya.roy@example.com", phone: "+91 98765 66666", tourId: 6, tourName: "Agra Heritage Tour", destination: "Agra", travelDate: "2026-09-02", travelers: 2, amount: 13998, bookingDate: "2026-08-29", paymentStatus: "Paid", bookingStatus: "Completed" }
        ],
        payments: [
            { id: "TXN901", bookingId: "BK1001", customerName: "Rahul Sharma", amount: 17998, method: "Credit Card", date: "2026-08-25", status: "Paid" },
            { id: "TXN902", bookingId: "BK1002", customerName: "Priya Patel", amount: 44997, method: "UPI / Google Pay", date: "2026-08-26", status: "Paid" },
            { id: "TXN903", bookingId: "BK1003", customerName: "Amit Verma", amount: 33998, method: "Net Banking", date: "2026-08-27", status: "Pending" },
            { id: "TXN904", bookingId: "BK1004", customerName: "Sneha Gupta", amount: 51996, method: "Credit Card", date: "2026-08-28", status: "Paid" },
            { id: "TXN905", bookingId: "BK1005", customerName: "Vikas Singh", amount: 18999, method: "Debit Card", date: "2026-08-28", status: "Failed" },
            { id: "TXN906", bookingId: "BK1006", customerName: "Ananya Roy", amount: 13998, method: "UPI / PhonePe", date: "2026-08-29", status: "Paid" }
        ],
        settings: {
            siteName: "TravelGo",
            contactEmail: "support@travelgo.com",
            phone: "+91 98765 43210",
            address: "Mumbai, Maharashtra, India",
            autoConfirmBookings: false,
            allowCancellation: true,
            cancellationDays: 3,
            paymentGateway: "Razorpay / UPI",
            adminName: "Admin TravelGo",
            adminEmail: "admin@travelgo.com"
        }
    };

    function initStore() {
        if (!localStorage.getItem(STORAGE_KEYS.TOURS)) {
            localStorage.setItem(STORAGE_KEYS.TOURS, JSON.stringify(INITIAL_SEED.tours));
        }
        if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
            localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_SEED.destinations));
        }
        if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_SEED.bookings));
        }
        if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
            localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_SEED.payments));
        }
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SEED.settings));
        }
    }

    initStore();

    function getItem(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            return [];
        }
    }

    function setItem(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    return {
        getBookings: () => getItem(STORAGE_KEYS.BOOKINGS),
        saveBookings: (data) => setItem(STORAGE_KEYS.BOOKINGS, data),

        getTours: () => getItem(STORAGE_KEYS.TOURS),
        saveTours: (data) => setItem(STORAGE_KEYS.TOURS, data),

        getDestinations: () => getItem(STORAGE_KEYS.DESTINATIONS),
        saveDestinations: (data) => setItem(STORAGE_KEYS.DESTINATIONS, data),

        getPayments: () => getItem(STORAGE_KEYS.PAYMENTS),
        savePayments: (data) => setItem(STORAGE_KEYS.PAYMENTS, data),

        getSettings: () => {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || INITIAL_SEED.settings;
            } catch (e) { return INITIAL_SEED.settings; }
        },
        saveSettings: (data) => setItem(STORAGE_KEYS.SETTINGS, data),

        showToast: function (message, type = "success") {
            let container = document.getElementById("toast-container");
            if (!container) {
                container = document.createElement("div");
                container.id = "toast-container";
                document.body.appendChild(container);
            }

            const toast = document.createElement("div");
            toast.className = `admin-toast admin-toast-${type}`;
            const iconClass = type === "success" ? "bi-check-circle-fill text-success" : type === "error" ? "bi-x-circle-fill text-danger" : "bi-exclamation-triangle-fill text-warning";
            toast.innerHTML = `<i class="bi ${iconClass} fs-5"></i><span>${message}</span>`;
            
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.transition = "opacity 0.3s ease";
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    };
})();
