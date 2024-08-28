export interface Repository<T> {
  create(item: T): Promise<T>;
  read(id: string): Promise<T | undefined>;
  update(id: string, item: T): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
  findAll(params: BasePaginationParams): Promise<DataWithCount<T>>;
}
export interface BasePaginationParams {
  page: number;
  size: number;
}
export interface DataWithCount<T> {
  count: number;
  data: T[];
}
