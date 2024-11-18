import { HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Injectable } from "@angular/core"
import { delay, Observable, of, throwError } from "rxjs"

import type { Book } from '../interface/responses'

const createMockedData = (): Map<string, Book> => {
  return new Map<string, Book>(['A', 'B', 'C', 'D', 'E'].map((letter, index) => [
    `mockBook${letter}`,
    {
      id: `mockBook${letter}`,
      title: `Mock Book ${letter}`,
      author: `Mock Author ${letter}`,
      year: Number(`200${index}`),
    }
  ]));
}

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  private data = createMockedData();

  private responses: Record<string, (req: HttpRequest<unknown>) => Observable<HttpResponse<unknown>>> = {
    'create': this.create,
    'get-list': this.getList,
    'delete': this.delete,
    'edit': this.edit,
  }

  intercept(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const url = req.url.split('/').at(-1)!;

    return this.responses[url]?.apply(this, [req]) ?? throwError(() => new Error('Unknown request URL'));
  }

  private getList(): Observable<HttpResponse<unknown>> {
    return this.response([...this.data.values()].reverse(), 1500);
  }

  private edit(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    this.data.set((req.body as Book).id, req.body as Book);

    return this.response(null, 500);
  }

  private delete(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    this.data.delete(this.getId(req));

    return this.response(null, 100);
  }

  private create(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
    const id = new Date().getTime().toString();

    this.data.set(id, { ...req.body as Omit<Book, 'id'>, id })

    return this.response(null, 1000);
  }

  private response(data: unknown, delayValue = 300): Observable<HttpResponse<unknown>> {
    return of(new HttpResponse({ body: data })).pipe(
      delay(delayValue),
    );
  }

  private getId(req: HttpRequest<unknown>): string {
    return req.params.get('id')!;
  }
}
