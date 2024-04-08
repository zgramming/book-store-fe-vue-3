import { IBaseQueryParams } from '../interfaces/base_query_params.interface';
import { InventoryDetailEntity } from '../interfaces/inventory-detail.entity';
import { InventoryEntity } from '../interfaces/inventory.entity';
import { isNumber } from '../utils/function';
import { http } from '../utils/http';
interface Params extends IBaseQueryParams {
  title?: string;
  location?: string;
}

interface InventoryCreateDTO {
  book_id: number;
  location: string;
  stock: number;
}

interface InventoryUpdateDTO extends Partial<InventoryCreateDTO> {}

class InventoryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/inventories';
  }

  async getAllInventories({ limit, page, location, title }: Params) {
    let url = `${this.baseUrl}?limit=${limit}&page=${page}`;

    if (location) {
      url += `&location=${location}`;
    }

    if (title) {
      url += `&title=${title}`;
    }

    const result = (await http.fetcher(url)) as InventoryEntity;

    return {
      data: result.data,
      total: result.total,
    };
  }

  async getInventoryById(id?: string) {
    const url = id && isNumber(id) ? `${this.baseUrl}/${id}` : undefined;

    if (!url) return null;

    const result = (await http.fetcher(`${this.baseUrl}/${id}`)) as InventoryDetailEntity;

    return result.data;
  }

  async createInventory(data: InventoryCreateDTO) {
    return http.post(this.baseUrl, data, undefined);
  }

  async updateInventory(id: string, data: InventoryUpdateDTO) {
    return http.put(`${this.baseUrl}/${id}`, data, undefined);
  }

  async decreaseStock(id: string, stock: number) {
    return http.put(`${this.baseUrl}/${id}/decrease-stock`, { stock }, undefined);
  }

  async increaseStock(id: string, stock: number) {
    return http.put(`${this.baseUrl}/${id}/increase-stock`, { stock }, undefined);
  }
}

export const inventoryService = new InventoryService();
