import cheerio from 'cheerio';
import { of, forkJoin } from 'rxjs';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';
import { flatMap$ } from './flatMap$';
import { map, flatMap, toArray } from 'rxjs/operators';
import { emptyDir, readFile } from 'fs-extra';
import { emptyDir$, readFile$ } from './fs$';
import { navigationProcessor } from './navigation-processor';
import { primaryManifest } from './primary-manifest.json';
import { NavigationItem } from './navigation-item';
import { mergeNavigation } from './mergeNavigation';

const makeCacheFolder = () => {
  return emptyDir$('./.cache');
};

const readManifests = () => {
  return of(fastGlob(normalizePath('./manifests/**/**'))).pipe(
    flatMap$,
    flatMap(o => o),
    map(o => readFile(o)),
    flatMap$,
    map(file => cheerio.load(file)),
    toArray(),
  );
};

forkJoin(makeCacheFolder(), readManifests())
  .pipe(
    flatMap(o => o[1]),
    map(o => navigationProcessor(o)),
    flatMap$,
    toArray(),
    map(() => {
      return mergeNavigation();
    }),
    flatMap(o => o),
  )
  .subscribe();

// of(fastGlob(normalizePath('./manifests/**/**')))
//   .pipe(
//     flatMap$,
//     map(o => console.log(o.length)),
//   )
//   .subscribe();
