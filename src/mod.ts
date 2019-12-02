import { of } from 'rxjs';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { flatMap$ } from './flatMap$';
import { map } from 'rxjs/operators';
of(fastGlob(normalizePath('./manifests/**/**')))
  .pipe(
    flatMap$,
    map(o => console.log(o.length)),
  )
  .subscribe();
