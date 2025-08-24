import { error } from "console";

const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
}

class ApiService {
    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        };
        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed: ', error);
            throw error;
        }
    }
    //health check
    async checkHealth(): Promise<{message: string}> {
        return this.request<{message: string}>('/health');
    }
    //user operations
    async getUsers(): Promise<User[]> {
        return this.request<User[]>('/users');
    }
    async createUser(user: CreateUserRequest): Promise<User>{
        return this.request<User>('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }
}
export const apiService = new ApiService();