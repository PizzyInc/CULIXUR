const getApiUrl = () => {
    try {
        return (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    } catch {
        return 'http://localhost:8000/api';
    }
};

const API_URL = getApiUrl();

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            // Optional: redirect to login
        }
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

export const authApi = {
    login: (credentials: any) => apiRequest('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => apiRequest('/logout', { method: 'POST' }),
    getUser: () => apiRequest('/user'),
};

export const memberApi = {
    getDashboard: () => apiRequest('/member/dashboard'),
    getBookingDetails: () => apiRequest('/member/booking-details'),
    book: (data: any) => apiRequest('/member/book', { method: 'POST', body: JSON.stringify(data) }),
};

export const chefApi = {
    getDashboard: () => apiRequest('/chef/dashboard'),
    updateStatus: (orderId: string, status: string) =>
        apiRequest(`/chef/orders/${orderId}/update-status`, {
            method: 'POST',
            body: JSON.stringify({ status })
        }),
};

export const adminApi = {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getUsers: () => apiRequest('/admin/users'),
    getBookings: () => apiRequest('/admin/bookings'),
    getMenus: () => apiRequest('/admin/menus'),
};
