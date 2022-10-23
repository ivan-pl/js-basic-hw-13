import EventRecord from "./types/eventrecord";
import Tag from "./types/tag";
import Status from "./types/status";

export interface ICalendarController {
  addEvent(event: EventRecord): Promise<number>;
  getEvent(id: number): Promise<EventRecord | null>;
  getEventList(dateFrom: Date, dateTo?: Date): Promise<EventRecord[] | null>;
  getEventList(tag: Tag): Promise<EventRecord[] | null>;
  getEventList(status: Status): Promise<EventRecord[] | null>;
  updateEvent(id: number, newEvent: EventRecord): Promise<EventRecord | null>;
  deleteEvent(id: number): Promise<number | null>;
}

export class CalendarController implements ICalendarStorage {
  private storage = new Storage();

  async addEvent(event: EventRecord): Promise<number> {
    return this.storage.add(event);
  }

  async getEvent(id: number): Promise<EventRecord | null> {
    return this.storage.getItem(id);
  }

  async deleteEvent(id: number): Promise<number | null> {
    return this.storage.deleteItem(id);
  }

  async updateEvent(
    id: number,
    newEvent: EventRecord
  ): Promise<EventRecord | null> {
    return this.storage.updateItem(id, newEvent);
  }
}

class Storage<T extends EventRecord = EventRecord> {
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
      : JSON.parse(item, (key: string, value: any) => {
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
}

function* numberGenerator(): Generator<number> {
  for (let i = 1; ; i++) {
    yield i;
  }
}
