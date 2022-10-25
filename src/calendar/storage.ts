import IEventRecord from "./types/eventrecord";
import IDateRange from "./types/daterange";

export default class Storage<T extends IEventRecord = IEventRecord> {
  private keyGen: Generator<{ id: number; key: string }>;
  private storageName: string;

  constructor(controllerId: number) {
    this.storageName = `storage${controllerId}`;
    this.keyGen = keyGenerator(this.storageName + "_");
  }

  add(item: T): number {
    const { id, key } = this.keyGen.next().value;
    const newItem = { ...item, id: id };
    localStorage.setItem(key, JSON.stringify(newItem));
    return id;
  }

  keyById(id: number): string {
    return this.storageName + "_" + id;
  }

  getItem(idOrKey: number | string): T | null {
    const item =
      typeof idOrKey === "number"
        ? localStorage.getItem(this.keyById(idOrKey))
        : localStorage.getItem(idOrKey);

    return item === null
      ? null
      : JSON.parse(item, (key: string, value: string) => {
          if (key === "date") {
            return new Date(value);
          }
          return value;
        });
  }

  updateItem(id: number, item: T): T | null {
    const key = this.keyById(id);
    if (key in localStorage) {
      localStorage.setItem(key, JSON.stringify(item));
      return item;
    }
    return null;
  }

  deleteItem(id: number): number | null {
    const key = this.keyById(id);
    if (key in localStorage) {
      localStorage.removeItem(key);
      return id;
    }
    return null;
  }

  filterItems<F extends Exclude<keyof T, "id">>(
    propName: F,
    val: F extends "date" ? IDateRange : T[F]
  ): T[] | null {
    let isEqual: (propVal: T[F]) => boolean;
    switch (propName) {
      case "date": {
        const dateRange: IDateRange = val as IDateRange;
        isEqual = (propVal) =>
          propVal >= dateRange.dateFrom && propVal <= dateRange.dateTo;
        break;
      }
      case "description": {
        const regexp = new RegExp(val as string, "i");
        isEqual = (propVal) => regexp.test(propVal as string);
        break;
      }
      default:
        isEqual = (propVal) => propVal === val;
        break;
    }

    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(this.storageName)
    );
    const result: T[] | null = [];
    for (const key of keys) {
      const item = this.getItem(key) as T;
      if (isEqual(item[propName])) {
        result.push(item);
      }
    }

    return result.length > 0 ? result : null;
  }
}

function* keyGenerator(prefix: string): Generator<{ id: number; key: string }> {
  for (let i = 1; ; i++) {
    yield { id: i, key: prefix + i };
  }
}
