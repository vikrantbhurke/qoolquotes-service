import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
} from "routing-controllers";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      return response.status(error.httpCode).json(error);
    } else if (error instanceof Error) {
      return response.status(500).json({ message: error.message });
    } else {
      next(error);
    }
  }
}
