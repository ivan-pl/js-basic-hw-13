import IEventRecord from "./types/eventrecord";

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

  filterItems<F extends Exclude<keyof T, "id">, U extends T[F]>(
    propName: F,
    val: U,
    dateTo?: F extends "date" ? U : never
  ): T[] | null {
    let isEqual: (propVal: U) => boolean;
    if (propName === "date") {
      isEqual = (propVal) => propVal >= val && propVal <= (dateTo as Date);
    } else {
      isEqual = (propVal) => propVal === val;
    }

    const keys = Object.keys(localStorage);
    const result: T[] | null = [];
    for (const key of keys) {
      const item = this.getItem(Number(key)) as T;
      if (isEqual(item[propName] as U)) {
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
