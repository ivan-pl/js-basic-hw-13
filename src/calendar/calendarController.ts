import EventRecord from "./types/eventrecord";
import Tag from "./types/tag";
import Status from "./types/status";

export interface ICalendarController {
  addEvent(event: EventRecord): Promise<number>;
  getEvent(id: number): Promise<EventRecord | null>;
  getEventList(dateFrom: Date, dateTo?: Date): Promise<EventRecord[] | null>;
  getEventList(tag: Tag): Promise<EventRecord[] | null>;
  getEventList(status: Status): Promise<EventRecord[] | null>;
  updateEvent(id: number, newEvent: EventRecord): Promise<EventRecord>;
  deleteEvent(id: number): Promise<EventRecord | null>;
}

export class CalendarController implements ICalendarStorage {
  private storage = new Storage();

  async addEvent(event: EventRecord): Promise<number> {
    return this.storage.add(event);
  }

  async getEvent(id: number): Promise<EventRecord | null> {
    return this.storage.getItem(id);
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
}

function* numberGenerator(): Generator<number> {
  for (let i = 1; ; i++) {
    yield i;
  }
}
