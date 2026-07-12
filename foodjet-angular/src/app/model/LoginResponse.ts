export interface LoginResponse {
    token: string;
    isAuthenticated: boolean;
    role: string;
    nombre: string;
    email?: string;
}