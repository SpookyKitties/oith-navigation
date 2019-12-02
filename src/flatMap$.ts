import { flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const flatMap$ = flatMap(<T>(o: T[] | Observable<T> | Promise<T>) => o);
