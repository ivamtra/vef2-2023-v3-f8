/*
CREATE TABLE public.events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  slug VARCHAR(64) NOT NULL UNIQUE,
  location VARCHAR(256),
  url VARCHAR(256),
  description TEXT,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/

import { QueryResult } from "pg";

export type Index = {
  id: number;
  titill: string;
  lysing: string;
  created: Date;
  updated: Date;
};

export function indexMapper(input: unknown): Index | null {
  const potentialIndex = input as Partial<Index> | null;
  console.log(potentialIndex)


  if (
    !potentialIndex ||
    !potentialIndex.id ||
    !potentialIndex.titill ||
    !potentialIndex.lysing ||
    !potentialIndex.created ||
    !potentialIndex.updated
  ) {
    console.log('WTF')
    return null;
  }

  const index: Index = {
    id: potentialIndex.id,
    titill: potentialIndex.titill,
    lysing: potentialIndex.lysing,
    created: new Date(potentialIndex.created),
    updated: new Date(potentialIndex.updated),
  };

  return index;
}

export function mapDbIndexToIndex(
  input: QueryResult<any> | null
): Index | null {
  if (!input) {
    return null;
  }

  return indexMapper(input.rows[0]);
}

export function mapDbIndicesToIndices(
  input: QueryResult<any> | null
): Array<Index> {

  if (!input) {
    return [];
  }

  const mappedIndices = input?.rows.map(indexMapper);

  console.log(mappedIndices)

  return mappedIndices.filter((i): i is Index => Boolean(i));
}
