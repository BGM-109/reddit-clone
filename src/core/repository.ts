export interface Repository<T> {
  create(item: T): Promise<T>;
  read(id: string): Promise<T | undefined>;
  update(id: string, item: T): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<T[]>;
}
