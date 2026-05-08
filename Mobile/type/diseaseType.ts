export interface Disease {
    disease_id: number;
    disease_name: string;
    disease_thumbnail: string;
    diseases: Disease[];
}

export interface DiseaseCategory {
    category_id: number;
    category_name: string;
    category_thumbnail: string;
    diseases: Disease[];
}

export interface DiseaseData {
    disease_common: Disease[];
    disease_seasonal: Disease[];
    disease_by_target_group: {
        disease_targetgroup_elderly: DiseaseCategory;
        disease_targetgroup_male: DiseaseCategory;
        disease_targetgroup_female: DiseaseCategory;
        disease_targetgroup_children: DiseaseCategory;
        disease_targetgroup_teenager: DiseaseCategory;
        disease_targetgroup_pregnant_women: DiseaseCategory;
    };
    disease_body_part: DiseaseCategory[];
    disease_specialty: DiseaseCategory[];
}

export interface DiseaseDetail {
    disease_id: number;
    disease_name: string;
    disease_thumbnail: string;
    general_overview: string;
    symptoms: string;
    cause: string;
    risk_subjects: string;
    diagnosis: string;
    prevention: string;
    treatment_method: string;
    disease_is_delete: number;
    disease_is_show: number;
    disease_created_at: string;
    disease_updated_at: string;
}

export interface CategoryDisease {
    category_disease_id: number;
    category_id: number;
    disease_id: number;
    disease_name: string;
    disease_thumbnail: string;
}
