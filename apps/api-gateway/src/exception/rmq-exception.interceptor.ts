import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RmqExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err?.getStatus && err?.getResponse) {
          return throwError(() => err);
        }

        if (err?.response?.statusCode && err?.response?.message) {
          return throwError(() =>
            this.mapException(err.response.statusCode, err.response.message),
          );
        }

        if (err?.statusCode && err?.message) {
          return throwError(() =>
            this.mapException(err.statusCode, err.message),
          );
        }

        if (err instanceof RpcException) {
          const error = err.getError();

          if (
            typeof error === 'object' &&
            error !== null &&
            'statusCode' in error &&
            'message' in error
          ) {
            return throwError(() =>
              this.mapException(
                (error as any).statusCode,
                (error as any).message,
              ),
            );
          }
        }

        return throwError(
          () => new InternalServerErrorException('Unexpected RPC error'),
        );
      }),
    );
  }

  private mapException(statusCode: number, message: string) {
    switch (statusCode) {
      case 400:
        return new BadRequestException(message);
      case 403:
        return new ForbiddenException(message);
      case 404:
        return new NotFoundException(message);
      case 409:
        return new ConflictException(message);
      default:
        return new InternalServerErrorException(message);
    }
  }
}
