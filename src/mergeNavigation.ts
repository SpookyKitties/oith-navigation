import { map, toArray } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import normalizePath = require('normalize-path');
import { flatMap$ } from './flatMap$';
import { readFile$, writeFile$ } from './fs$';
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
        return flattenPrimaryManifest(navItem.navigationItems).pipe(
          map(o => o.concat([navItem])),
          flatMap$,
        );
      }

      return of(navItem);
    }),
    flatMap$,
    toArray(),
  );
};

export function mergeNavigation() {
  return loadNavFiles().pipe(
    map(navFiles => {
      navFiles;

      const langs = [
        'eng',
        'fra',
        'jpn',
        'pes',
        'por',
        'spa',
        'tha',
        'zhs',
        'zho',
      ];
      return of(langs).pipe(
        flatMap$,
        map(lang => {
          const nav = JSON.parse(
            JSON.stringify(primaryManifest),
          ) as NavigationItem; // Object.assign({}, primaryManifest);

          return flattenPrimaryManifest(
            nav.navigationItems ? nav.navigationItems : [],
          ).pipe(
            map(o => o.concat([nav])),
            map((o: NavigationItem[]) => {
              addNavItem(lang, o, navFiles);
              console.log(nav.navigationItems ? nav.navigationItems.length : 9);
              // nav.imgUrl=
              if (nav.imgUrl) {
                nav.imgUrl = nav.imgUrl.replace('{lang}', lang);
              }
              return writeFile$(
                `./.cache/${lang}-navigation.json`,
                JSON.stringify(nav),
              );
            }),
            flatMap$,
          );
        }),
      );
    }),
    flatMap$,
    flatMap$,
    toArray(),
  );
}

function setValue<T, T2 extends keyof T>(
  item: T,
  key: T2,
  lang: string,
  vals: {},
) {
  try {
    if (((item[key] as unknown) as string).startsWith('{')) {
      // console.log(item[key]);
      // console.log(vals[(item[key] as unknown) as string]);

      item[key] = vals[(item[key] as unknown) as string][lang];
    }
  } catch (error) {}
}

function fixI18n(navItem: NavigationItem, lang: string) {
  setValue(navItem, 'title', lang, primaryManifestl18n);
  setValue(navItem, 'shortTitle', lang, primaryManifestl18n);
}
function addNavItem(
  lang: string,
  navItems: NavigationItem[],
  navFiles: NavigationItem[],
) {
  navItems.map(i => {
    if (i.imgUrl) {
      // console.log(i.imgUrl);

      i.imgUrl = i.imgUrl.replace('{lang}', lang);
    }
    try {
      const id = (i['id'] as string).replace('{lang}', lang);
      const exist = navFiles.find(navFile => navFile.id === id) !== undefined;
      const navItem = navFiles.find(navFile => navFile.id === id);

      if (navItem) {
        // console.log(id);

        i.id = navItem.id;
        i.title = navItem.title;
        i.shortTitle = navItem.shortTitle;
        i.dateEnd = navItem.dateEnd;
        i.dateState = navItem.dateState;
        i.href = navItem.href;
        i.navigationItems = navItem.navigationItems;
      } else {
        i.display = false;
      }
    } catch (error) {
      // console.log(i);
    }
    fixI18n(i, lang);
  });
}
