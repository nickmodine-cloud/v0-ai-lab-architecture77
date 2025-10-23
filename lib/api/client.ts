import { ApiResponse, PaginatedResponse } from './types'

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api') {
    this.baseURL = baseURL
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    // Проверяем, что мы на клиенте
    if (typeof window === 'undefined') {
      console.warn('API request attempted on server side, skipping...');
      throw new Error('API requests are not available on server side');
    }

    const token = localStorage.getItem('accessToken');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Handle token refresh here if needed
          throw new Error('Unauthorized');
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  public get<T>(url: string, config?: any) {
    return this.request<T>(url, { method: 'GET' });
  }

  public post<T>(url: string, data?: any, config?: any) {
    return this.request<T>(url, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    });
  }

  public put<T>(url: string, data?: any, config?: any) {
    return this.request<T>(url, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    });
  }

  public patch<T>(url: string, data?: any, config?: any) {
    return this.request<T>(url, { 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined 
    });
  }

  public delete<T>(url: string, config?: any) {
    return this.request<T>(url, { method: 'DELETE' });
  }

  public getPaginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<PaginatedResponse<T>>(`${url}${queryString}`);
  }
}

const apiClient = new ApiClient();

export { apiClient };
export default apiClient;