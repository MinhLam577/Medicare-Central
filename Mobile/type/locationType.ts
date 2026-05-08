export interface Province {
    id: number;
    name: string;
    gso_id: string;
    created_at: string;
    updated_at: string;
}

export interface District {
    id: number;
    name: string;
    gso_id: string;
    province_id: number;
    created_at: string;
    updated_at: string;
}

export interface Ward {
    id: number;
    name: string;
    gso_id: string;
    district_id: number;
    created_at: string;
    updated_at: string;
}