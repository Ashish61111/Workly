import {apiRequest} from "./authApi";

// Fetch gigs created by the logged-in freelancer.
export async function getMyGigs() {
    return apiRequest("/gigs/my-gigs", {
        authenticated: true,
    });
}

// Fetch publicly available gigs.
export async function getPublishedGigs({
                                           search = "",
                                           category = "",
                                           offset = 0,
                                           limit = 20,
                                       } = {}) {
    const params = new URLSearchParams({
        offset: String(offset),
        limit: String(limit),
    });

    if (search.trim()) {
        params.set("search", search.trim());
    }

    if (category) {
        params.set("category", category);
    }

    return apiRequest(`/gigs?${params.toString()}`);
}

// Create a new gig.
export async function createGig(gigData) {
    return apiRequest("/gigs", {
        method: "POST",
        authenticated: true,
        body: gigData,
    });
}

// Update an existing gig.
export async function updateGig(gigId, gigData) {
    return apiRequest(`/gigs/${encodeURIComponent(gigId)}`, {
        method: "PATCH",
        authenticated: true,
        body: gigData,
    });
}

// Delete an existing gig.
export async function deleteGig(gigId) {
    return apiRequest(`/gigs/${encodeURIComponent(gigId)}`, {
        method: "DELETE",
        authenticated: true,
    });
}

