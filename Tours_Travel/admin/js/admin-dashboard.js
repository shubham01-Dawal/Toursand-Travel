/* =========================================
   TRAVELGO ADMIN PANEL - DASHBOARD CONTROLLER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AdminData === "undefined") return;

    renderStats();
    renderRecentBookings();
});

function renderStats() {
    const bookings = AdminData.getBookings();
    const tours = AdminData.getTours();

    const totalTours = tours.length;
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.bookingStatus === "Pending").length;
    const confirmedBookings = bookings.filter(b => b.bookingStatus === "Confirmed").length;
    const totalRevenue = bookings
        .filter(b => b.bookingStatus === "Confirmed" || b.bookingStatus === "Completed")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

    if (document.getElementById("stat-total-tours")) document.getElementById("stat-total-tours").textContent = totalTours;
    if (document.getElementById("stat-total-bookings")) document.getElementById("stat-total-bookings").textContent = totalBookings;
    if (document.getElementById("stat-pending-bookings")) document.getElementById("stat-pending-bookings").textContent = pendingBookings;
    if (document.getElementById("stat-confirmed-bookings")) document.getElementById("stat-confirmed-bookings").textContent = confirmedBookings;
    if (document.getElementById("stat-total-revenue")) document.getElementById("stat-total-revenue").textContent = "₹" + totalRevenue.toLocaleString("en-IN");
}

function renderRecentBookings() {
    const tableBody = document.getElementById("recent-bookings-tbody");
    if (!tableBody) return;

    const bookings = AdminData.getBookings().slice(-5).reverse();

    if (bookings.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No recent bookings found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = bookings.map(b => {
        const badgeClass = b.bookingStatus === "Confirmed" ? "badge-confirmed" :
                           b.bookingStatus === "Pending" ? "badge-pending" :
                           b.bookingStatus === "Cancelled" ? "badge-cancelled" : "badge-completed";

        return `
            <tr>
                <td class="fw-bold text-primary">${b.id}</td>
                <td>
                    <div class="fw-semibold">${b.customerName}</div>
                    <div class="small text-muted">${b.email}</div>
                </td>
                <td>${b.tourName}</td>
                <td>${b.travelDate}</td>
                <td class="fw-bold">₹${b.amount.toLocaleString("en-IN")}</td>
                <td><span class="badge-status ${badgeClass}">${b.bookingStatus}</span></td>
                <td>
                    <a href="bookings.html?id=${b.id}" class="btn btn-sm btn-outline-primary py-1 px-2.5 small">
                        <i class="bi bi-eye me-1"></i>View
                    </a>
                </td>
            </tr>
        `;
    }).join("");
}
