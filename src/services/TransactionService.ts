import { IBaseQueryParams } from '../interfaces/base_query_params.interface';
import { TransactionDetailEntity } from '../interfaces/transaction-detail.entity';
import { TransactionEntity } from '../interfaces/transaction.entity';
import { isNumber } from '../utils/function';
import { http } from '../utils/http';

interface Params extends IBaseQueryParams {
  student_name?: string;
  date_loan?: Date;
  date_return?: Date;
}

interface TransactionCreateDTO {
  student_id: number;
  date_loan: string;
  date_return: string;
  items: {
    book_id: number;
    quantity: number;
  }[];
}

class TransactionService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/transactions';
  }

  async getAllTransactions({ page = 1, limit = 100, student_name, date_loan, date_return }: Params) {
    let url = `${this.baseUrl}?page=${page}&limit=${limit}`;

    if (student_name) {
      url += `&student_name=${student_name}`;
    }

    if (date_loan) {
      url += `&date_loan=${date_loan}`;
    }

    if (date_return) {
      url += `&date_return=${date_return}`;
    }

    const result = (await http.fetcher(url)) as TransactionEntity;

    return {
      data: result.data,
      total: result.total,
    };
  }

  async getTransactionById(id?: string) {
    const url = id && isNumber(id) ? `${this.baseUrl}/${id}` : undefined;

    if (!url) {
      return;
    }

    const result = (await http.fetcher(`${this.baseUrl}/${id}`)) as TransactionDetailEntity;

    return result.data;
  }

  async createTransaction(data: TransactionCreateDTO) {
    return http.post(this.baseUrl, data, undefined);
  }

  async returnBook(transactionId: number | null) {
    if (!transactionId) {
      return;
    }
    return http.put(`${this.baseUrl}/${transactionId}/return`, {}, undefined);
  }
}

export const transactionService = new TransactionService();
