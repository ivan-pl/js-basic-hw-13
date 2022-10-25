import IEventRecord from "./types/eventrecord";
import IDateRange from "./types/daterange";
import Storage from "./storage";

export interface ICalendarController {
  addEvent(event: IEventRecord): Promise<number>;
  getEvent(id: number): Promise<IEventRecord | null>;
  getEventList<T extends Exclude<keyof IEventRecord, "id">>(
    propName: T,
    propVal: T extends "date" ? IDateRange : IEventRecord[T]
  ): Promise<IEventRecord[] | null>;
  updateEvent(id: number, newEvent: IEventRecord): Promise<IEventRecord | null>;
  deleteEvent(id: number): Promise<number | null>;
}

export class CalendarController implements ICalendarController {
  private storage;
  private static instanceIdGenerator = numberGenerator();
  private instanceId: number;

  constructor() {
    this.instanceId = CalendarController.instanceIdGenerator.next().value;
    this.storage = new Storage(this.instanceId);
  }

  async addEvent(event: IEventRecord): Promise<number> {
    return this.storage.add(event);
  }

  async getEvent(id: number): Promise<IEventRecord | null> {
    return this.storage.getItem(id);
  }

  async deleteEvent(id: number): Promise<number | null> {
    return this.storage.deleteItem(id);
  }

  async getEventList<T extends Exclude<keyof IEventRecord, "id">>(
    propName: T,
    propVal: T extends "date" ? IDateRange : IEventRecord[T]
  ): Promise<IEventRecord[] | null> {
    return this.storage.filterItems(propName, propVal);
  }

  async updateEvent(
    id: number,
    newEvent: IEventRecord
  ): Promise<IEventRecord | null> {
    return this.storage.updateItem(id, newEvent);
  }
}

function* numberGenerator(): Generator<number> {
  for (let i = 1; ; i++) {
    yield i;
  }
}