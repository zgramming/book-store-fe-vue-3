import { IBaseQueryParams } from '../interfaces/base_query_params.interface';
import { HistoryTransactionEntity } from '../interfaces/history-transaction.entity';
import { http } from '../utils/http';

interface UseListParams extends IBaseQueryParams {
  nim?: string;
  name_student?: string;
  book_id?: string;
  book_title?: string;
  date_loan?: string;
  date_return?: string;
  long_loan_in_days?: number;
}

class HistoryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/history-transactions';
  }

  async getList({
    limit,
    page,
    nim,
    name_student,
    book_id,
    book_title,
    date_loan,
    date_return,
    long_loan_in_days,
  }: UseListParams) {
    let url = `${this.baseUrl}?limit=${limit}&page=${page}`;

    if (nim) {
      url += `&nim=${nim}`;
    }

    if (name_student) {
      url += `&name_student=${name_student}`;
    }

    if (book_id) {
      url += `&book_id=${book_id}`;
    }

    if (book_title) {
      url += `&book_title=${book_title}`;
    }

    if (date_loan) {
      url += `&date_loan=${date_loan}`;
    }

    if (date_return) {
      url += `&date_return=${date_return}`;
    }

    if (long_loan_in_days) {
      url += `&long_loan_in_days=${long_loan_in_days}`;
    }

    const result = (await http.fetcher(url)) as HistoryTransactionEntity;

    return {
      data: result.data,
      total: result.total,
    };
  }
}

export const historyService = new HistoryService();
