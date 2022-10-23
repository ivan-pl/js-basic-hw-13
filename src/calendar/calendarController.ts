import EventRecord from "./types/eventrecord";
import Tag from "./types/tag";
import Status from "./types/status";

export interface ICalendarController {
  addEvent(event: EventRecord): Promise<EventRecord>;
  getEventList(id: number): Promise<EventRecord[]>;
  getEventList(dateFrom: Date, dateTo?: Date): Promise<EventRecord[]>;
  getEventList(tag: Tag): Promise<EventRecord[]>;
  getEventList(status: Status): Promise<EventRecord[]>;
  updateEvent(id: number, newEvent: EventRecord): Promise<EventRecord>;
  deleteEvent(id: number): Promise<EventRecord | null>;
}

export class CalendarController implements ICalendarStorage {
  private storage = new Storage();

  async addEvent(event: EventRecord): Promise<EventRecord> {
    return this.storage.add(event);
  }
}

class Storage<T extends EventRecord = EventRecord> {
  private idGenerator = numberGenerator();

  add(item: T): T {
    const nextId = this.idGenerator.next().value;
    const newItem = { ...item, id: nextId };
    localStorage.setItem(nextId, JSON.stringify(newItem));
    return newItem;
  }
}

function* numberGenerator(): Generator<number> {
  for (let i = 0; ; i++) {
    yield i;
  }
}
