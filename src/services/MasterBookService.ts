import { IBaseQueryParams } from '../interfaces/base_query_params.interface';
import { MasterBookDetailEntity } from '../interfaces/master-book-detail.entity';
import { MasterBookEntity } from '../interfaces/master-book.entity';
import { isNumber } from '../utils/function';
import { http } from '../utils/http';

interface Params extends IBaseQueryParams {
  title?: string;
}
interface MasterBookCreateDTO {
  title: string;
  author: string;
  publisher: string;
  year: number;
}
interface MasterBookUpdateDTO extends Partial<MasterBookCreateDTO> {}

class MasterBookService {
  private baseUrl: string;
  constructor() {
    this.baseUrl = '/master-books';
  }

  async getAllBooks({ limit, page, title }: Params) {
    let url = `${this.baseUrl}?limit=${limit}&page=${page}`;

    if (title) {
      url += `&title=${title}`;
    }

    const { data, total } = (await http.fetcher(url)) as MasterBookEntity;

    return { data, total };
  }

  async getBookById(id?: string) {
    let url = id && isNumber(id) ? `${this.baseUrl}/${id}` : undefined;

    if(!url) return null;

    const result = (await http.fetcher(url)) as MasterBookDetailEntity;
    return result.data;
  }

  async createBook(data: MasterBookCreateDTO) {
    return http.post(this.baseUrl, data, undefined);
  }

  async updateBook(id: string, data: MasterBookUpdateDTO) {
    return http.put(`${this.baseUrl}/${id}`, data, undefined);
  }

  async deleteBook(id: string) {
    return http.del(`${this.baseUrl}/${id}`, undefined);
  }
}

export const masterBookService = new MasterBookService();
