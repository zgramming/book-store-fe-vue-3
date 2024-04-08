import { IBaseQueryParams } from '../interfaces/base_query_params.interface';
import { MasterStudentDetailEntity } from '../interfaces/master-student-detail.entity';
import { MasterStudentEntity } from '../interfaces/master-student.entity';
import { isNumber } from '../utils/function';
import { http } from '../utils/http';

interface Params extends IBaseQueryParams {
  name?: string;
}
interface MasterStudentCreateDTO {
  name: string;
  nim: string;
  status: string;
}
interface MasterStudentUpdateDTO extends Partial<MasterStudentCreateDTO> {}

class MasterStudentService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/master-students';
  }

  async getAllStudents({ limit, page, name }: Params) {
    let url = `${this.baseUrl}?limit=${limit}&page=${page}`;

    if (name) {
      url += `&name=${name}`;
    }

    const result = (await http.fetcher(url)) as MasterStudentEntity;
    return {
      data: result.data,
      meta: result.total,
    };
  }

  async getStudentById(id?: string) {
    const url = id && isNumber(id) ? `${this.baseUrl}/${id}` : undefined;

    if (!url) return null;

    const result = (await http.fetcher(url)) as MasterStudentDetailEntity;
    return result.data;
  }

  async createStudent(data: MasterStudentCreateDTO) {
    return http.post(this.baseUrl, data, undefined);
  }

  async updateStudent(id: string, data: MasterStudentUpdateDTO) {
    return http.put(`${this.baseUrl}/${id}`, data, undefined);
  }

  async deleteStudent(id: string) {
    return http.del(`${this.baseUrl}/${id}`, undefined);
  }
}

export const masterStudentService = new MasterStudentService();
