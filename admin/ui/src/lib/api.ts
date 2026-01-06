const getApiUrl = () => {
    try {
        return (globalThis as any).process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    } catch {
        return 'http://localhost:3001';
    }
};

const API_URL = `${getApiUrl()}/api`;

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
    apply: (data: any) => apiRequest('/member/apply', { method: 'POST', body: JSON.stringify(data) }),
    referElite: (data: any) => apiRequest('/member/refer-elite', { method: 'POST', body: JSON.stringify(data) }),
};

export const chefApi = {
    getDashboard: () => apiRequest('/chef/dashboard'),
    updateStatus: (orderId: string | number, status: string) =>
        apiRequest(`/chef/orders/${orderId}/update-status`, {
            method: 'POST',
            body: JSON.stringify({ status })
        }),
    updateAvailability: (slots: any[]) =>
        apiRequest('/chef/availability', {
            method: 'POST',
            body: JSON.stringify({ slots })
        }),
    verifyMember: (memberId: string) => apiRequest(`/chef/verify-member/${memberId}`),
};

export const adminApi = {
    getDashboard: () => apiRequest('/admin/dashboard'),
    getUsers: () => apiRequest('/admin/users'),
    getBookings: () => apiRequest('/admin/bookings'),
    getMenus: () => apiRequest('/admin/menus'),
    approveApplication: (id: string | number) => apiRequest(`/admin/applications/${id}/approve`, { method: 'POST' }),
    rejectApplication: (id: string | number) => apiRequest(`/admin/applications/${id}/reject`, { method: 'POST' }),
    createChef: (data: any) => apiRequest('/admin/chefs', { method: 'POST', body: JSON.stringify(data) }),
    updateChef: (id: string | number, data: FormData) => {
        const token = localStorage.getItem('auth_token');
        return fetch(`${API_URL}/admin/chefs/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: data
        }).then(res => res.json());
    },
    createMenu: async (data: FormData) => {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/admin/menus`, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create menu' }));
            throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    },
    updateMenu: async (id: string | number, data: FormData) => {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/admin/menus/${id}`, {
            method: 'POST',
            body: data,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to update menu' }));
            throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    },
    deleteMenu: (id: string | number) => apiRequest(`/admin/menus/${id}`, { method: 'DELETE' }),
    getAllApplications: () => apiRequest('/admin/applications'),
    createMember: (data: any) => apiRequest('/admin/members', { method: 'POST', body: JSON.stringify(data) }),
    updateUser: (id: string | number, data: any) => apiRequest(`/admin/users/${id}`, { method: 'POST', body: JSON.stringify(data) }),
    deleteUser: (id: string | number) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
    syncUsers: () => apiRequest('/admin/sync', { method: 'POST' }),
};

