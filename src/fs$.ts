import { Observable, of } from "rxjs";
import {
  readFile,
  copy,
  CopyOptions,
  ReadOptions,
  WriteOptions,
  MoveOptions,
  EnsureOptions,
  emptyDir,
  writeFile
} from "fs-extra";
import normalizePath = require("normalize-path");
import { map } from "rxjs/operators";
import { flatMap$ } from "./flatMap$";
export function readFile$(fileName: string): Observable<Buffer> {
  return of(readFile(fileName)).pipe(flatMap$);
}

export function writeFile$(fileName: string, data: string | Buffer) {
  return of(writeFile(fileName, data)).pipe(flatMap$);
}

export const readFileMap = map((i: string) => readFile$(i));

export function emptyDir$(pathName: string) {
  return of(emptyDir(normalizePath(pathName))).pipe(flatMap$);
}
