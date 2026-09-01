/* =========================================
   TRAVELGO ADMIN PANEL - TOURS CONTROLLER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AdminData === "undefined") return;

    renderTours();
    setupTourFilters();
    setupAddTourForm();
    setupEditTourForm();
});

let currentDeleteTourId = null;

function renderTours() {
    const container = document.getElementById("tours-grid-container");
    if (!container) return;

    let tours = AdminData.getTours();

    const searchVal = (document.getElementById("search-tour")?.value || "").toLowerCase().trim();
    const typeVal = document.getElementById("filter-tour-type")?.value || "All";
    const statusVal = document.getElementById("filter-tour-status")?.value || "All";

    if (searchVal) {
        tours = tours.filter(t => 
            t.name.toLowerCase().includes(searchVal) ||
            t.destination.toLowerCase().includes(searchVal) ||
            t.description.toLowerCase().includes(searchVal)
        );
    }

    if (typeVal !== "All") {
        tours = tours.filter(t => t.type === typeVal);
    }

    if (statusVal !== "All") {
        tours = tours.filter(t => t.status === statusVal);
    }

    document.getElementById("tours-count").textContent = tours.length;

    if (tours.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="admin-card text-center py-5">
                    <i class="bi bi-compass empty-state-icon"></i>
                    <h4 class="empty-state-title">No Tours Found</h4>
                    <p class="empty-state-text">No tour packages match your current search or filter criteria.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = tours.map(t => {
        const isActive = t.status === "Active";
        const badgeClass = isActive ? "badge-active" : "badge-inactive";

        return `
            <div class="col-md-6 col-lg-4">
                <div class="admin-card h-100 mb-0 d-flex flex-direction-column">
                    <div class="position-relative" style="height: 200px; overflow: hidden; background: #f1f5f9;">
                        <img src="${t.image}" alt="${t.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span class="badge-status ${badgeClass} position-absolute top-0 start-0 m-3 shadow-sm">${t.status}</span>
                        <span class="badge bg-dark bg-opacity-75 text-white position-absolute bottom-0 end-0 m-3 small"><i class="bi bi-tag me-1"></i>${t.type}</span>
                    </div>
                    <div class="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h4 class="h5 fw-bold mb-0 text-dark">${t.name}</h4>
                                <span class="fs-5 fw-bold text-primary">₹${t.price.toLocaleString("en-IN")}</span>
                            </div>
                            <p class="small text-muted mb-2 line-clamp-2">${t.description}</p>
                            <div class="d-flex justify-content-between small text-muted border-top pt-2 mb-3">
                                <span><i class="bi bi-geo-alt text-primary me-1"></i>${t.destination}</span>
                                <span><i class="bi bi-clock text-primary me-1"></i>${t.duration}</span>
                                <span><i class="bi bi-people text-primary me-1"></i>${t.availableSeats || 10} Seats</span>
                            </div>
                        </div>

                        <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                            <div class="form-check form-switch small">
                                <input class="form-check-input" type="checkbox" role="switch" id="switch-tour-${t.id}" ${isActive ? 'checked' : ''} onchange="toggleTourStatus(${t.id})">
                                <label class="form-check-label small text-muted" for="switch-tour-${t.id}">${isActive ? 'Active' : 'Inactive'}</label>
                            </div>
                            <div class="action-btn-group">
                                <button class="btn-icon-action" onclick="openEditTourModal(${t.id})" title="Edit Tour"><i class="bi bi-pencil"></i></button>
                                <button class="btn-icon-action btn-icon-danger" onclick="promptDeleteTourModal(${t.id})" title="Delete Tour"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function setupTourFilters() {
    const searchInput = document.getElementById("search-tour");
    const typeSelect = document.getElementById("filter-tour-type");
    const statusSelect = document.getElementById("filter-tour-status");

    if (searchInput) searchInput.addEventListener("input", renderTours);
    if (typeSelect) typeSelect.addEventListener("change", renderTours);
    if (statusSelect) statusSelect.addEventListener("change", renderTours);
}

function toggleTourStatus(id) {
    let tours = AdminData.getTours();
    const index = tours.findIndex(t => t.id === id);
    if (index !== -1) {
        tours[index].status = tours[index].status === "Active" ? "Inactive" : "Active";
        AdminData.saveTours(tours);
        AdminData.showToast(`Tour status updated to ${tours[index].status}`, "info");
        renderTours();
    }
}

function setupAddTourForm() {
    const addForm = document.getElementById("add-tour-form");
    if (!addForm) return;

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const tours = AdminData.getTours();
        const newId = tours.length ? Math.max(...tours.map(t => t.id)) + 1 : 1;

        const newTour = {
            id: newId,
            name: document.getElementById("add-tour-name").value.trim(),
            destination: document.getElementById("add-tour-destination").value.trim(),
            type: document.getElementById("add-tour-type").value,
            duration: document.getElementById("add-tour-duration").value.trim(),
            price: parseFloat(document.getElementById("add-tour-price").value) || 0,
            availableSeats: parseInt(document.getElementById("add-tour-seats").value) || 10,
            status: document.getElementById("add-tour-status").value,
            image: document.getElementById("add-tour-image").value.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            description: document.getElementById("add-tour-description").value.trim()
        };

        tours.unshift(newTour);
        AdminData.saveTours(tours);
        AdminData.showToast("New tour created successfully!", "success");
        renderTours();

        addForm.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addTourModal"));
        if (modal) modal.hide();
    });
}

function openEditTourModal(id) {
    const tours = AdminData.getTours();
    const t = tours.find(item => item.id === id);
    if (!t) return;

    document.getElementById("edit-tour-id").value = t.id;
    document.getElementById("edit-tour-name").value = t.name;
    document.getElementById("edit-tour-destination").value = t.destination;
    document.getElementById("edit-tour-type").value = t.type;
    document.getElementById("edit-tour-duration").value = t.duration;
    document.getElementById("edit-tour-price").value = t.price;
    document.getElementById("edit-tour-seats").value = t.availableSeats || 10;
    document.getElementById("edit-tour-status").value = t.status;
    document.getElementById("edit-tour-image").value = t.image;
    document.getElementById("edit-tour-description").value = t.description;

    const modal = new bootstrap.Modal(document.getElementById("editTourModal"));
    modal.show();
}

function setupEditTourForm() {
    const editForm = document.getElementById("edit-tour-form");
    if (!editForm) return;

    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById("edit-tour-id").value);
        let tours = AdminData.getTours();
        const index = tours.findIndex(t => t.id === id);
        if (index !== -1) {
            tours[index].name = document.getElementById("edit-tour-name").value.trim();
            tours[index].destination = document.getElementById("edit-tour-destination").value.trim();
            tours[index].type = document.getElementById("edit-tour-type").value;
            tours[index].duration = document.getElementById("edit-tour-duration").value.trim();
            tours[index].price = parseFloat(document.getElementById("edit-tour-price").value) || 0;
            tours[index].availableSeats = parseInt(document.getElementById("edit-tour-seats").value) || 10;
            tours[index].status = document.getElementById("edit-tour-status").value;
            tours[index].image = document.getElementById("edit-tour-image").value.trim();
            tours[index].description = document.getElementById("edit-tour-description").value.trim();

            AdminData.saveTours(tours);
            AdminData.showToast("Tour package updated!", "success");
            renderTours();

            const modal = bootstrap.Modal.getInstance(document.getElementById("editTourModal"));
            if (modal) modal.hide();
        }
    });
}

function promptDeleteTourModal(id) {
    currentDeleteTourId = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteTourModal"));
    modal.show();
}

function confirmDeleteTour() {
    if (!currentDeleteTourId) return;
    let tours = AdminData.getTours();
    tours = tours.filter(t => t.id !== currentDeleteTourId);
    AdminData.saveTours(tours);
    AdminData.showToast("Tour deleted successfully.", "error");
    renderTours();

    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteTourModal"));
    if (modal) modal.hide();
}
