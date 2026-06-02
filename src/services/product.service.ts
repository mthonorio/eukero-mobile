import api from '../api';
import {
  Product,
  ProductCreateData,
  ProductDependencies,
  ProductOption,
} from '../types/product.type';

type Props = {
  page?: number;
  limit?: number;
};

type PaginatedProductsResponse = {
  items: Product[];
  count: number;
};

export default class ProductService {
  static async fetchExplorerProductsPaginated(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await api.get(`/feed/explorer`, {
        params: { page, page_size: limit },
      });

      return {
        items: response.data?.items || [],
        count: response.data?.count || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async fetchExplorerProducts(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<Product[]> {
    const response = await this.fetchExplorerProductsPaginated({ page, limit });
    return response.items;
  }

  static async fetchFollowingProductsPaginated(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<PaginatedProductsResponse> {
    try {
      const response = await api.get('/feed/following', {
        params: { page, page_size: limit },
      });

      return {
        items: response.data?.items || [],
        count: response.data?.count || 0,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async fetchFollowingProducts(
    { page, limit }: Props = {
      page: 1,
      limit: 20,
    },
  ): Promise<Product[]> {
    const response = await this.fetchFollowingProductsPaginated({
      page,
      limit,
    });
    return response.items;
  }

  static async fetchProducts(): Promise<Product[]> {
    try {
      const response = await api.get(`/products`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async fetchMyProducts(
    options: Props,
  ): Promise<PaginatedProductsResponse>;
  static async fetchMyProducts(
    options?: Props,
  ): Promise<Product[] | PaginatedProductsResponse> {
    try {
      const response = await api.get(`/my-products`, {
        params: options
          ? { page: options.page, page_size: options.limit }
          : undefined,
      });

      if (!options) {
        return Array.isArray(response.data)
          ? response.data
          : response.data?.items || [];
      }

      const items = Array.isArray(response.data)
        ? response.data.slice(
            ((options.page ?? 1) - 1) * (options.limit ?? 20),
            (options.page ?? 1) * (options.limit ?? 20),
          )
        : response.data?.items || [];

      return {
        items,
        count: Array.isArray(response.data)
          ? response.data.length
          : response.data?.count || items.length,
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  static async fetchProductById(productId: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }

  static async fetchProductStyles(): Promise<ProductOption[]> {
    try {
      const response = await api.get('/product-style');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estilos de produto:', error);
      throw error;
    }
  }

  static async fetchProductClassifications(): Promise<ProductOption[]> {
    try {
      const response = await api.get('/product-classification');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar classificações de produto:', error);
      throw error;
    }
  }

  static async fetchProductDepartments(): Promise<ProductOption[]> {
    try {
      const response = await api.get('/product-department');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar departamentos de produto:', error);
      throw error;
    }
  }

  static async fetchProductCategories(): Promise<ProductOption[]> {
    try {
      const response = await api.get('/product-category');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar categorias de produto:', error);
      throw error;
    }
  }

  static async fetchProductSizes(): Promise<ProductOption[]> {
    try {
      const response = await api.get('/product-size');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tamanhos de produto:', error);
      throw error;
    }
  }

  static async fetchProductColors(): Promise<ProductOption[]> {
    try {
      const response = await api.get('/product-color');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cores de produto:', error);
      throw error;
    }
  }

  static async fetchProductDependencies(): Promise<ProductDependencies> {
    try {
      const response = await api.get('/product-dependencies');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dependências de produto:', error);
      throw error;
    }
  }

  static async createProduct(productData: ProductCreateData): Promise<Product> {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  static async updateProduct(
    productId: string,
    productData: ProductCreateData,
  ): Promise<Product> {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  static async addImageToProduct(
    productUid: string,
    file: File,
    description?: string,
  ): Promise<{
    imageUid: string;
    productUid: string;
  } | void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productUid', productUid);
      if (description) {
        formData.append('description', description);
      }
      const response = await api.post(`/product-image/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar imagem ao produto:', error);
      throw error;
    }
  }

  static async removeImageToProduct(imageId: string): Promise<void> {
    try {
      await api.delete(`/product-image/images/${imageId}`);
    } catch (error) {
      console.error('Erro ao deletar imagem do produto:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      await api.delete(`/products/${productId}`);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }

  static async getProductLikes(): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>(`/product-like`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos curtidos:', error);
      throw error;
    }
  }

  static async likeProduct(productId: string): Promise<void> {
    try {
      await api.post(`/product-like/${productId}`);
    } catch (error) {
      console.error('Erro ao curtir produto:', error);
      throw error;
    }
  }

  static async unlikeProduct(productId: string): Promise<void> {
    try {
      await api.delete(`/product-like/${productId}`);
    } catch (error) {
      console.error('Erro ao descurtir produto:', error);
      throw error;
    }
  }

  static async deleteVideoFromProduct(productUid: string): Promise<void> {
    try {
      await api.delete(`/product-video/videos/${productUid}`);
    } catch (error) {
      console.error('Erro ao deletar vídeo do produto:', error);
      throw error;
    }
  }

  static async patchStatusProduct(
    productId: string,
    status: string,
  ): Promise<Product> {
    try {
      const response = await api.patch(`/products/${productId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do produto:', error);
      throw error;
    }
  }

  static async searchProducts(search: string): Promise<Product[]> {
    try {
      const response = await api.get(`/search-products`, {
        params: { search },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }
}
