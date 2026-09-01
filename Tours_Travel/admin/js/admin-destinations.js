/* =========================================
   TRAVELGO ADMIN PANEL - DESTINATIONS CONTROLLER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    if (typeof AdminData === "undefined") return;

    renderDestinations();
    setupAddDestinationForm();
    setupEditDestinationForm();
});

let currentDeleteDestId = null;

function renderDestinations() {
    const container = document.getElementById("destinations-grid-container");
    if (!container) return;

    let dests = AdminData.getDestinations();
    const searchVal = (document.getElementById("search-destination")?.value || "").toLowerCase().trim();

    if (searchVal) {
        dests = dests.filter(d => 
            d.name.toLowerCase().includes(searchVal) ||
            d.state.toLowerCase().includes(searchVal) ||
            d.description.toLowerCase().includes(searchVal)
        );
    }

    document.getElementById("destinations-count").textContent = dests.length;

    if (dests.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="admin-card text-center py-5">
                    <i class="bi bi-geo-alt empty-state-icon"></i>
                    <h4 class="empty-state-title">No Destinations Found</h4>
                    <p class="empty-state-text">No destination records match your search criteria.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = dests.map(d => {
        const isActive = d.status === "Active";
        const badgeClass = isActive ? "badge-active" : "badge-inactive";

        return `
            <div class="col-md-6 col-lg-4">
                <div class="admin-card h-100 mb-0 d-flex flex-column">
                    <div class="position-relative" style="height: 180px; overflow: hidden; background: #f1f5f9;">
                        <img src="${d.image}" alt="${d.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span class="badge-status ${badgeClass} position-absolute top-0 end-0 m-3 shadow-sm">${d.status}</span>
                    </div>
                    <div class="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                        <div>
                            <h4 class="h5 fw-bold text-dark mb-1">${d.name}</h4>
                            <div class="small text-muted mb-2"><i class="bi bi-pin-map text-primary me-1"></i>${d.state}</div>
                            <p class="small text-muted mb-3 line-clamp-2">${d.description}</p>
                        </div>
                        <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                            <div class="form-check form-switch small">
                                <input class="form-check-input" type="checkbox" role="switch" id="switch-dest-${d.id}" ${isActive ? 'checked' : ''} onchange="toggleDestStatus(${d.id})">
                                <label class="form-check-label small text-muted" for="switch-dest-${d.id}">${isActive ? 'Active' : 'Inactive'}</label>
                            </div>
                            <div class="action-btn-group">
                                <button class="btn-icon-action" onclick="openEditDestModal(${d.id})" title="Edit Destination"><i class="bi bi-pencil"></i></button>
                                <button class="btn-icon-action btn-icon-danger" onclick="promptDeleteDestModal(${d.id})" title="Delete Destination"><i class="bi bi-trash"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-destination");
    if (searchInput) searchInput.addEventListener("input", renderDestinations);
});

function toggleDestStatus(id) {
    let dests = AdminData.getDestinations();
    const index = dests.findIndex(d => d.id === id);
    if (index !== -1) {
        dests[index].status = dests[index].status === "Active" ? "Inactive" : "Active";
        AdminData.saveDestinations(dests);
        AdminData.showToast(`Destination status set to ${dests[index].status}`, "info");
        renderDestinations();
    }
}

function setupAddDestinationForm() {
    const addForm = document.getElementById("add-dest-form");
    if (!addForm) return;

    addForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const dests = AdminData.getDestinations();
        const newId = dests.length ? Math.max(...dests.map(d => d.id)) + 1 : 1;

        const newDest = {
            id: newId,
            name: document.getElementById("add-dest-name").value.trim(),
            state: document.getElementById("add-dest-state").value.trim(),
            status: document.getElementById("add-dest-status").value,
            image: document.getElementById("add-dest-image").value.trim() || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
            description: document.getElementById("add-dest-description").value.trim()
        };

        dests.unshift(newDest);
        AdminData.saveDestinations(dests);
        AdminData.showToast("Destination added successfully!", "success");
        renderDestinations();

        addForm.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addDestModal"));
        if (modal) modal.hide();
    });
}

function openEditDestModal(id) {
    const dests = AdminData.getDestinations();
    const d = dests.find(item => item.id === id);
    if (!d) return;

    document.getElementById("edit-dest-id").value = d.id;
    document.getElementById("edit-dest-name").value = d.name;
    document.getElementById("edit-dest-state").value = d.state;
    document.getElementById("edit-dest-status").value = d.status;
    document.getElementById("edit-dest-image").value = d.image;
    document.getElementById("edit-dest-description").value = d.description;

    const modal = new bootstrap.Modal(document.getElementById("editDestModal"));
    modal.show();
}

function setupEditDestinationForm() {
    const editForm = document.getElementById("edit-dest-form");
    if (!editForm) return;

    editForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById("edit-dest-id").value);
        let dests = AdminData.getDestinations();
        const index = dests.findIndex(d => d.id === id);

        if (index !== -1) {
            dests[index].name = document.getElementById("edit-dest-name").value.trim();
            dests[index].state = document.getElementById("edit-dest-state").value.trim();
            dests[index].status = document.getElementById("edit-dest-status").value;
            dests[index].image = document.getElementById("edit-dest-image").value.trim();
            dests[index].description = document.getElementById("edit-dest-description").value.trim();

            AdminData.saveDestinations(dests);
            AdminData.showToast("Destination updated successfully!", "success");
            renderDestinations();

            const modal = bootstrap.Modal.getInstance(document.getElementById("editDestModal"));
            if (modal) modal.hide();
        }
    });
}

function promptDeleteDestModal(id) {
    currentDeleteDestId = id;
    const modal = new bootstrap.Modal(document.getElementById("confirmDeleteDestModal"));
    modal.show();
}

function confirmDeleteDestination() {
    if (!currentDeleteDestId) return;
    let dests = AdminData.getDestinations();
    dests = dests.filter(d => d.id !== currentDeleteDestId);
    AdminData.saveDestinations(dests);
    AdminData.showToast("Destination removed.", "error");
    renderDestinations();

    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteDestModal"));
    if (modal) modal.hide();
}
