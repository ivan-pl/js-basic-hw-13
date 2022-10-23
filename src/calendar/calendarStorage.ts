import EventRecord from "./types/eventrecord";
import Tag from "./types/tag";
import Status from "./types/status";

export interface ICalendarStorage {
  addEvent(event: EventRecord): Promise<EventRecord>;
  getEventList(id: number): Promise<EventRecord[]>;
  getEventList(dateFrom: Date, dateTo?: Date): Promise<EventRecord[]>;
  getEventList(tag: Tag): Promise<EventRecord[]>;
  getEventList(status: Status): Promise<EventRecord[]>;
  updateEvent(id: number, newEvent: EventRecord): Promise<EventRecord>;
  deleteEvent(id: number): Promise<EventRecord | null>;
}

export class CalendarStorage implements ICalendarStorage {
  private idGenerator = numberGenerator();
  private storage: EventRecord[] = [];

  async addEvent(event: EventRecord): Promise<EventRecord> {
    const nextId = this.idGenerator.next().value;
    const newEvent = { ...event, id: nextId };
    this.storage.push(newEvent);
    return newEvent;
  }
}

function* numberGenerator(): Generator<number> {
  for (let i = 0; ; i++) {
    yield i;
  }
}
