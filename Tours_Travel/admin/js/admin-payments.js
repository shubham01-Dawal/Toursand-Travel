/* =========================================
   TRAVELGO ADMIN PANEL - PAYMENTS CONTROLLER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AdminData === "undefined") return;

    renderPayments();
    setupPaymentFilters();
});

function renderPayments() {
    const tbody = document.getElementById("payments-tbody");
    if (!tbody) return;

    let payments = AdminData.getPayments();
    const searchVal = (document.getElementById("search-payment")?.value || "").toLowerCase().trim();
    const statusVal = document.getElementById("filter-payment-status")?.value || "All";

    if (searchVal) {
        payments = payments.filter(p => 
            p.id.toLowerCase().includes(searchVal) ||
            p.bookingId.toLowerCase().includes(searchVal) ||
            p.customerName.toLowerCase().includes(searchVal) ||
            p.method.toLowerCase().includes(searchVal)
        );
    }

    if (statusVal !== "All") {
        payments = payments.filter(p => p.status === statusVal);
    }

    document.getElementById("payments-count").textContent = payments.length;

    const totalPaidSum = payments
        .filter(p => p.status === "Paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const sumEl = document.getElementById("payments-total-sum");
    if (sumEl) sumEl.textContent = "₹" + totalPaidSum.toLocaleString("en-IN");

    if (payments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <div class="empty-state">
                        <i class="bi bi-credit-card empty-state-icon"></i>
                        <h4 class="empty-state-title">No Transactions Found</h4>
                        <p class="empty-state-text">No payment records matched your search parameters.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = payments.map(p => {
        const badgeClass = p.status === "Paid" ? "badge-paid" :
                           p.status === "Pending" ? "badge-pending" :
                           p.status === "Refunded" ? "badge-refunded" : "badge-failed";

        return `
            <tr>
                <td class="fw-bold text-primary">${p.id}</td>
                <td class="fw-bold">${p.bookingId}</td>
                <td>${p.customerName}</td>
                <td class="fw-bold text-dark">₹${p.amount.toLocaleString("en-IN")}</td>
                <td><span class="badge bg-light text-dark border"><i class="bi bi-wallet2 me-1"></i>${p.method}</span></td>
                <td>${p.date}</td>
                <td><span class="badge-status ${badgeClass}">${p.status}</span></td>
            </tr>
        `;
    }).join("");
}

function setupPaymentFilters() {
    const searchInput = document.getElementById("search-payment");
    const statusSelect = document.getElementById("filter-payment-status");

    if (searchInput) searchInput.addEventListener("input", renderPayments);
    if (statusSelect) statusSelect.addEventListener("change", renderPayments);
}
