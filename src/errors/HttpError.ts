class HttpError extends Error {
  code: number;

  constructor(message: string, code: number = 400) {
    super(message);
    this.code = code;
    // Garante que o nome do erro no console apareça como HttpError em vez de Error
    this.name = 'HttpError'; 
  }
}

export default HttpError;