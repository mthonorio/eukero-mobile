export interface SuperFilterPayload {
  name: string;
  productName?: string;
  quality?: number;
  minimumPrice?: number;
  maximumPrice?: number;
  classificationId?: number | null;
  departmentId?: number | null;
  styleId?: number | null;
  categoryId?: number | null;
  sizeId?: number | null;
  colorId?: number | null;
  classificationName?: string;
  departmentName?: string;
  styleName?: string;
  categoryName?: string;
  sizeName?: string;
  colorName?: string;
  creationDate?: string;
  updateDate?: string;
}

export interface SuperFilterApiItem extends SuperFilterPayload {
  id: string;
}

export interface SuperFilterData {
  name: string;
  quality: string;
  priceMin: string;
  priceMax: string;
  sku: string;
  classification: string;
  style: string;
  size: string;
  color: string;
  department: string;
  category: string;
}

export interface SuperFilter {
  id: string;
  name: string;
  filters: SuperFilterData;
  activeFiltersCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateSuperFilterPayload = SuperFilterPayload;

export type UpdateSuperFilterPayload = Partial<SuperFilterPayload>;
