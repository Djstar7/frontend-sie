import type { VisaFetch, VisaResourceType } from "@/types/visa";
import { api } from "./api";
import type { StatusMat } from "@/types/user";

export interface PaginatorResponse {
    data: VisaResourceType[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export class VisaEligibilityService {
    private endpoint = '/visa';

    async getEligibilities(): Promise<PaginatorResponse> {
        const response = await api.get<PaginatorResponse>(this.endpoint);
        return response.data;
    }

    async getEligibilityDetails(id: string): Promise<{ data: VisaResourceType & { status_mat: StatusMat, min_age: number, max_age: number }, message: string }> {
        const response = await api.get<{ data: VisaResourceType & { min_age: number, max_age: number }, message: string }>(`${this.endpoint}/show/${id}`);
        return response.data;
    }

    async createEligibility(data: VisaFetch): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>(`${this.endpoint}/store`, data);
        return response.data;
    }

    async updateEligibility(id: string, data: VisaFetch): Promise<{ data: VisaResourceType, message: string }> {
        const response = await api.put<{ data: VisaResourceType, message: string }>(`${this.endpoint}/update/${id}`, data);
        return response.data;
    }

    async deleteEligibility(id: string): Promise<void> {
        await api.delete(`${this.endpoint}/delete/${id}`);
    }
}

export const visaEligibilityService = new VisaEligibilityService();
