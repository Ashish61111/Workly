const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "workly_access_token";


export function getAccessToken() {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}


function saveAccessToken(token) {
    if (!token) {
        throw new Error("The server did not return an access token.");
    }

    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}


export function clearAuthSession() {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}


export async function apiRequest(path, options = {}) {
    const {
        method = "GET",
        body,
        authenticated = false,
    } = options;

    const headers = {
        Accept: "application/json",
    };

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (authenticated) {
        const token = getAccessToken();

        if (!token) {
            throw new Error("Please sign in to continue.");
        }

        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body === undefined
                ? undefined
                : JSON.stringify(body),
        });
    } catch {
        throw new Error(
            "Unable to connect to Workly. Please check that the backend server is running."
        );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const detail = data?.detail;

        const message = Array.isArray(detail)
            ? detail.map((item) => item.msg).join(", ")
            : detail;

        throw new Error(
            message || `Request failed with status ${response.status}.`
        );
    }

    return data;
}


// Register a new Workly account.
export async function registerAccount(userData) {
    const data = await apiRequest("/auth/register", {
        method: "POST",
        body: userData,
    });

    saveAccessToken(data.access_token);

    return data;
}


// Authenticate an existing Workly account.
export async function loginAccount(credentials) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: credentials,
    });

    saveAccessToken(data.access_token);

    return data;
}


// Retrieve the currently authenticated user.
export async function getCurrentUser() {
    return apiRequest("/auth/me", {
        authenticated: true,
    });
}
