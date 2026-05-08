export interface CategoryType {
    category_id: number;
    category_name: string;
    category_type: string;
    category_thumbnail: string;
    category_description: string | null;
    category_parent_id: number | null;
    category_is_delete: number;
    children: CategoryType[];
}
