import cheerio from 'cheerio';
import { of, forkJoin } from 'rxjs';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { flatMap$ } from './flatMap$';
import { map, flatMap, toArray } from 'rxjs/operators';
import { emptyDir, readFile } from 'fs-extra';
import { emptyDir$ } from './fs$';
import { navigationProcessor } from './navigation-processor';


const makeCacheFolder = () => {
  return emptyDir$('./.cache');
};

const readFiles = () => {
  return of(fastGlob(normalizePath('./manifests/**/**'))).pipe(
    flatMap$,
    flatMap(o => o),
    map(o => readFile(o)),
    flatMap$,
    map(file => cheerio.load(file)),
    toArray(),
  );
};

export function mergeNavigation() {
  const langs = ['eng', 'fra', 'jpn', 'pes', 'por', 'spa', 'tha'];
}

forkJoin(makeCacheFolder(), readFiles())
  .pipe(
    flatMap(o => o[1]),
    map(o => navigationProcessor(o)),
    flatMap$,
    toArray(),
    map(o => console.log(o.length)),
  )
  .subscribe();

// of(fastGlob(normalizePath('./manifests/**/**')))
//   .pipe(
//     flatMap$,
//     map(o => console.log(o.length)),
//   )
//   .subscribe();
