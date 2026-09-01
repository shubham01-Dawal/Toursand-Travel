/* =========================================
   TRAVELGO ADMIN PANEL - BOOKINGS CONTROLLER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AdminData === "undefined") return;

    renderBookings();
    setupFilters();
    setupAddBookingModal();
});

let currentDeleteId = null;
let currentCancelId = null;

function renderBookings() {
    const tbody = document.getElementById("bookings-tbody");
    if (!tbody) return;

    let bookings = AdminData.getBookings();

    const searchVal = (document.getElementById("search-booking")?.value || "").toLowerCase().trim();
    const statusVal = document.getElementById("filter-status")?.value || "All";
    const dateVal = document.getElementById("filter-date")?.value || "";

    if (searchVal) {
        bookings = bookings.filter(b => 
            b.id.toLowerCase().includes(searchVal) ||
            b.customerName.toLowerCase().includes(searchVal) ||
            b.email.toLowerCase().includes(searchVal) ||
            b.tourName.toLowerCase().includes(searchVal)
        );
    }

    if (statusVal !== "All") {
        bookings = bookings.filter(b => b.bookingStatus === statusVal);
    }

    if (dateVal) {
        bookings = bookings.filter(b => b.travelDate === dateVal);
    }

    document.getElementById("booking-count").textContent = bookings.length;

    if (bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-calendar-x empty-state-icon"></i>
                        <h4 class="empty-state-title">No Bookings Found</h4>
                        <p class="empty-state-text">No booking records matched your search or filter parameters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bookings.map(b => {
        const badgeClass = b.bookingStatus === "Confirmed" ? "badge-confirmed" :
                           b.bookingStatus === "Pending" ? "badge-pending" :
                           b.bookingStatus === "Cancelled" ? "badge-cancelled" : "badge-completed";

        const payBadgeClass = b.paymentStatus === "Paid" ? "badge-paid" :
                              b.paymentStatus === "Pending" ? "badge-pending" : "badge-failed";

        return `
            <tr>
                <td class="fw-bold text-primary">${b.id}</td>
                <td>
                    <div class="fw-bold">${b.customerName}</div>
                    <div class="small text-muted">${b.email}</div>
                    <div class="extra-small text-muted"><i class="bi bi-telephone me-1"></i>${b.phone || "N/A"}</div>
                </td>
                <td>
                    <div class="fw-semibold">${b.tourName}</div>
                    <div class="small text-muted"><i class="bi bi-geo-alt me-1"></i>${b.destination}</div>
                </td>
                <td>${b.travelDate}</td>
                <td><span class="badge bg-light text-dark border"><i class="bi bi-person me-1"></i>${b.travelers}</span></td>
                <td class="fw-bold text-dark">₹${b.amount.toLocaleString("en-IN")}</td>
                <td><span class="badge-status ${payBadgeClass}">${b.paymentStatus}</span></td>
                <td><span class="badge-status ${badgeClass}">${b.bookingStatus}</span></td>
                <td>
                    <div class="action-btn-group">
                        <button class="btn-icon-action" onclick="openViewModal('${b.id}')" title="View Details">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn-icon-action" onclick="openEditModal('${b.id}')" title="Edit Booking">
                            <i class="bi bi-pencil"></i>
                        </button>
                        ${b.bookingStatus !== "Cancelled" ? `
                        <button class="btn-icon-action btn-icon-danger" onclick="promptCancelModal('${b.id}')" title="Cancel Booking">
                            <i class="bi bi-x-circle"></i>
                        </button>` : ''}
                        <button class="btn-icon-action btn-icon-danger" onclick="promptDeleteModal('${b.id}')" title="Delete Booking">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function setupFilters() {
    const searchInput = document.getElementById("search-booking");
    const statusSelect = document.getElementById("filter-status");
    const dateInput = document.getElementById("filter-date");
    const resetBtn = document.getElementById("reset-filters");

    if (searchInput) searchInput.addEventListener("input", renderBookings);
    if (statusSelect) statusSelect.addEventListener("change", renderBookings);
    if (dateInput) dateInput.addEventListener("change", renderBookings);

    if (resetBtn) {
        resetBtn.addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            if (statusSelect) statusSelect.value = "All";
            if (dateInput) dateInput.value = "";
            renderBookings();
        });
    }
}

function openViewModal(id) {
    const bookings = AdminData.getBookings();
    const b = bookings.find(item => item.id === id);
    if (!b) return;

    document.getElementById("view-booking-id").textContent = b.id;
    document.getElementById("view-customer-name").textContent = b.customerName;
    document.getElementById("view-customer-email").textContent = b.email;
    document.getElementById("view-customer-phone").textContent = b.phone || "N/A";
    document.getElementById("view-tour-name").textContent = b.tourName;
    document.getElementById("view-destination").textContent = b.destination;
    document.getElementById("view-travel-date").textContent = b.travelDate;
    document.getElementById("view-travelers").textContent = b.travelers;
    document.getElementById("view-amount").textContent = "₹" + b.amount.toLocaleString("en-IN");
    document.getElementById("view-booking-date").textContent = b.bookingDate || "N/A";
    document.getElementById("view-payment-status").textContent = b.paymentStatus;
    document.getElementById("view-booking-status").textContent = b.bookingStatus;

    const modal = new bootstrap.Modal(document.getElementById("viewBookingModal"));
    modal.show();
}

function openEditModal(id) {
    const bookings = AdminData.getBookings();
    const b = bookings.find(item => item.id === id);
    if (!b) return;

    document.getElementById("edit-booking-id").value = b.id;
    document.getElementById("edit-customer-name").value = b.customerName;
    document.getElementById("edit-travel-date").value = b.travelDate;
    document.getElementById("edit-travelers").value = b.travelers;
    document.getElementById("edit-payment-status").value = b.paymentStatus;
    document.getElementById("edit-booking-status").value = b.bookingStatus;

    const modal = new bootstrap.Modal(document.getElementById("editBookingModal"));
    modal.show();
}

document.addEventListener("DOMContentLoaded", function () {
    const editForm = document.getElementById("edit-booking-form");
    if (editForm) {
        editForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const id = document.getElementById("edit-booking-id").value;
            let bookings = AdminData.getBookings();
            const index = bookings.findIndex(b => b.id === id);
            if (index !== -1) {
                bookings[index].travelDate = document.getElementById("edit-travel-date").value;
                bookings[index].travelers = parseInt(document.getElementById("edit-travelers").value);
                bookings[index].paymentStatus = document.getElementById("edit-payment-status").value;
                bookings[index].bookingStatus = document.getElementById("edit-booking-status").value;

                AdminData.saveBookings(bookings);
                AdminData.showToast("Booking updated successfully!", "success");
                renderBookings();

                const modal = bootstrap.Modal.getInstance(document.getElementById("editBookingModal"));
                if (modal) modal.hide();
            }
        });
    }
});

function setupAddBookingModal() {
    const addForm = document.getElementById("add-booking-form");
    if (!addForm) return;

    // Populate Tours dropdown
    const tourSelect = document.getElementById("add-tour-id");
    const tours = AdminData.getTours();
    if (tourSelect) {
        tourSelect.innerHTML = tours.map(t => `<option value="${t.id}">${t.name} (₹${t.price})</option>`).join("");
    }

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const selectedTourId = parseInt(document.getElementById("add-tour-id").value);
        const tour = tours.find(t => t.id === selectedTourId) || tours[0];
        const travelers = parseInt(document.getElementById("add-travelers").value) || 1;

        const newBooking = {
            id: "BK" + Math.floor(1000 + Math.random() * 9000),
            customerName: document.getElementById("add-customer-name").value.trim(),
            email: document.getElementById("add-customer-email").value.trim(),
            phone: document.getElementById("add-customer-phone").value.trim(),
            tourId: tour.id,
            tourName: tour.name,
            destination: tour.destination,
            travelDate: document.getElementById("add-travel-date").value,
            travelers: travelers,
            amount: tour.price * travelers,
            bookingDate: new Date().toISOString().split("T")[0],
            paymentStatus: document.getElementById("add-payment-status").value,
            bookingStatus: document.getElementById("add-booking-status").value
        };

        const bookings = AdminData.getBookings();
        bookings.unshift(newBooking);
        AdminData.saveBookings(bookings);
        AdminData.showToast("New booking created successfully!", "success");
        renderBookings();

        addForm.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addBookingModal"));
        if (modal) modal.hide();
    });
}

function promptCancelModal(id) {
    currentCancelId = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmCancelModal"));
    modal.show();
}

function confirmCancelBooking() {
    if (!currentCancelId) return;
    let bookings = AdminData.getBookings();
    const index = bookings.findIndex(b => b.id === currentCancelId);
    if (index !== -1) {
        bookings[index].bookingStatus = "Cancelled";
        AdminData.saveBookings(bookings);
        AdminData.showToast(`Booking ${currentCancelId} has been cancelled.`, "warning");
        renderBookings();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmCancelModal"));
    if (modal) modal.hide();
}

function promptDeleteModal(id) {
    currentDeleteId = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
    modal.show();
}

function confirmDeleteBooking() {
    if (!currentDeleteId) return;
    let bookings = AdminData.getBookings();
    bookings = bookings.filter(b => b.id !== currentDeleteId);
    AdminData.saveBookings(bookings);
    AdminData.showToast(`Booking ${currentDeleteId} deleted permanently.`, "error");
    renderBookings();

    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
    if (modal) modal.hide();
}
