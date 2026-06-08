export interface ProductOption {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  uid: string;
  name: string;
  description: string;
  sku?: string;
  salePrice: number;
  promotionalPrice?: number;
  classificationId?: number | null;
  classification?: string | null;
  departmentId?: number | null;
  department?: string | null;
  categoryId?: number | null;
  category?: string | null;
  styleId?: number | null;
  style?: string | null;
  videoUrl?: string | null;
  size?: string | null;
  sizeId?: number | null;
  color?: string | null;
  colorId?: number | null;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  quantity: number;
  storeId: string;
  storeName: string;
  userId: string;
  userImageUrl: string;
  storeImageUrl: string;
  storeUsername: string;
  userName: string;
  likes: number;
  liked?: boolean;
  tags: string[];
  quality?: number;
  weight?: number;
  height?: number;
  status: string;
  width?: number;
  length?: number;
  images: { id: string; url: string }[];
  video?: string;
  supplierId?: string;
  supplierValue?: number;
  supplierHasFixedValue?: boolean;
}

export interface ProductCreateData {
  name: string;
  description?: string;
  salePrice: number;
  promotionalPrice?: number;
  classificationId?: number;
  departmentId?: number;
  categoryId?: number;
  styleId?: number;
  sizeId?: number;
  colorId?: number;
  classification?: string;
  category?: string;
  style?: string;
  size?: string;
  color?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  quantity?: number;
  quality?: number;
  images?: { id: string; url: string }[];
  video?: string;
  sku?: string;
  supplierId?: string;
  supplierValue?: number;
  supplierHasFixedValue?: boolean;
}

export interface ProductListItem {
  id: string;
  name: string;
  quality: number;
  isActive: boolean;
  promotionalPrice: number;
  salePrice: number;
  imageUrl: string;
}

export interface ProductFormData {
  isActive: boolean;
  productName: string;
  price: string;
  promotionalPrice?: string;
  description: string;

  weight?: string;
  height?: string;
  width?: string;
  length?: string;

  quantity: number;
  category?: string;

  sizes?: Array<{ value: string; label: string }>;
  colors?: Array<{ value: string; label: string }>;
  colorsSecondary?: Array<{ value: string; label: string }>;
  style?: string;

  department?: string;
  categorySecondary?: string;

  images?: any[];
  video?: any;
}

export interface ProductCategory {
  id: number;
  departmentId: number;
  name: string;
}

export interface ProductSize {
  id: number;
  departmentId: number;
  name: string;
}

export interface ProductColor {
  id: number;
  evaluated: boolean;
  name: string;
}

export interface ProductDepartment {
  value: string;
  label: string;
}

export interface ProductDependencies {
  departments: ProductOption[];
  classifications: ProductOption[];
  styles: ProductOption[];
  sizes: ProductSize[];
  colors: ProductColor[];
  categories: ProductCategory[];
}
