export interface StrapiResponseInterface<T> {
  data: {
    attributes: T;
    id: string;
  }
}
