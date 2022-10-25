import IEventRecord from "./types/eventrecord";
import IDateRange from "./types/daterange";

export default class Storage<T extends IEventRecord = IEventRecord> {
  private idGenerator = numberGenerator();

  add(item: T): number {
    const nextId = this.idGenerator.next().value;
    const newItem = { ...item, id: nextId };
    localStorage.setItem(nextId, JSON.stringify(newItem));
    return nextId;
  }

  getItem(id: number): T | null {
    const item = localStorage.getItem(id.toString());
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
    const idStr = id.toString();
    if (idStr in localStorage) {
      localStorage.setItem(idStr, JSON.stringify(item));
      return item;
    }
    return null;
  }

  deleteItem(id: number): number | null {
    const idStr = id.toString();
    if (idStr in localStorage) {
      localStorage.removeItem(idStr);
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

    const keys = Object.keys(localStorage);
    const result: T[] | null = [];
    for (const key of keys) {
      const item = this.getItem(Number(key)) as T;
      if (isEqual(item[propName])) {
        result.push(item);
      }
    }

    return result.length > 0 ? result : null;
  }
}

function* numberGenerator(): Generator<number> {
  for (let i = 1; ; i++) {
    yield i;
  }
}
