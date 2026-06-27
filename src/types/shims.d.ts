declare module 'express' {
  type NextFunction = (err?: any) => void;
  interface Request { [key: string]: any; body?: any; params?: any; headers?: any; method?: string; originalUrl?: string; }
  interface Response { [key: string]: any; status(code: number): Response; json(body: any): Response; send(body: any): Response; sendStatus(code: number): Response; }
  interface Router {
    [key: string]: any;
    get(...args: any[]): any;
    post(...args: any[]): any;
    put(...args: any[]): any;
    delete(...args: any[]): any;
    patch(...args: any[]): any;
    use(...args: any[]): any;
  }
  const express: any;
  function Router(): Router;
  export { Request, Response, NextFunction, Router, express };
  export default express;
}

declare module 'cors' {
  const cors: any;
  export default cors;
}

declare module 'morgan' {
  const morgan: any;
  export default morgan;
}

declare module 'sqlite-async' {
  export class Database {
    static open(filename: string, mode?: number): Promise<any>;
  }
}
