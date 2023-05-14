export interface StrapiDataInterface<T> {
  attributes: T;
  id: number;
}

export interface StrapiResponseInterface<T> {
  id: number;
  data: StrapiDataInterface<T>;
}

export interface StrapiArrayResponseInterface<T> {
  id: number;
  data: StrapiDataInterface<T>[];
}
