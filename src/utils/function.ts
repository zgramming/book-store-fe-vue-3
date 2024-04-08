import axios, { AxiosError } from 'axios';

const getErrorMessageAxios = (error: any) => {
  // Check if axios error
  const message = 'Terjadi kesalahan pada server';
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (!axiosError.response) return message;

    const response = axiosError.response;
    const data = response.data as any;

    const { message: errorMessage } = data;

    if (Array.isArray(errorMessage)) {
      return errorMessage.map((item, index) => `${index + 1}. ${item}`).join('\n');
    }

    return errorMessage;
  } else if (error instanceof Error) {
    return error.message;
  }

  return message;
};

const isNumber = (value: any) => {
  return !isNaN(value);
};

export { getErrorMessageAxios, isNumber };
