export interface SupplierMeResponse {
  id: string;
  uid: string;
  storeId: string;
  storeName: string;
  storeUsername: string;
  storeImageUrl?: string;
  userId: string;
  userUid: string;
  userUsername: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  userPhone?: string;
  userType: 'USER' | 'STORE';
  paymentType: 'FIXED_PERCENTAGE' | 'FIXED_VALUE';
  percentageValue?: number;
  fixedValue?: number;
  dinamic?: boolean;
  status: string;
  invitedAt?: string;
  respondedAt?: string;
  autoAcceptedAt?: string;
  overview?: {
    productsCount?: number;
  };
  products?: number;
}

export interface SupplierRequest {
  userId: string;
  paymentType: 'FIXED_PERCENTAGE' | 'FIXED_VALUE';
  percentageValue?: number;
  fixedValue?: number;
}

export interface PaginatedSuppliersResponse {
  items: SupplierMeResponse[];
  count?: number;
}
