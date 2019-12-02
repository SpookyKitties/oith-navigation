import { map, toArray } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import normalizePath = require('normalize-path');
import { flatMap$ } from './flatMap$';
import { readFile$ } from './fs$';
import { NavigationItem } from './navigation-item';
import fastGlob from 'fast-glob';
import { primaryManifestl18n } from './primary-manitest-l18n.json';

const loadNavFiles = () => {
  return of(fastGlob(normalizePath('./.cache/**/**'))).pipe(
    flatMap$,
    flatMap$,
    map(o =>
      readFile$(o).pipe(map(o => JSON.parse(o.toString()) as NavigationItem)),
    ),
    flatMap$,
    toArray(),
  );
};

import { primaryManifest } from './primary-manifest.json';

const flattenPrimaryManifest = (
  navItems: NavigationItem[],
): Observable<NavigationItem[]> => {
  return of(navItems).pipe(
    flatMap$,
    map(navItem => {
      if (navItem.navigationItems && navItem.navigationItems.length > 0) {
        return flattenPrimaryManifest(navItem.navigationItems).pipe(flatMap$);
      }

      return of(navItem);
    }),
    flatMap$,
    toArray(),
  );
};

export function mergeNavigation() {
  const langs = ['eng', 'fra', 'jpn', 'pes', 'por', 'spa', 'tha'];
  console.log(langs);

  return loadNavFiles().pipe(
    map(navFiles => {
      navFiles;

      return flattenPrimaryManifest(primaryManifest.navigationItems).pipe(
        map((o: NavigationItem[]) => {
          langs.map(lang => {
            o.map(i => {
              const id = (i['id'] as string).replace('{lang}', lang);
              const exist =
                navFiles.find(navFile => navFile.id === id) !== undefined;
              if (!exist) {
                console.log(id);
              }
            });
          });
        }),
      );
    }),
    flatMap$,
  );
}
