import IEventRecord from "./types/eventrecord";
import ETag from "./types/tag";
import EStatus from "./types/status";
import Storage from "./storage";

export interface ICalendarController {
  addEvent(event: IEventRecord): Promise<number>;
  getEvent(id: number): Promise<IEventRecord | null>;
  getEventList(dateFrom: Date, dateTo: Date): Promise<IEventRecord[] | null>;
  getEventList(tag: ETag): Promise<IEventRecord[] | null>;
  getEventList(status: EStatus): Promise<IEventRecord[] | null>;
  getEventList(desc: string): Promise<IEventRecord[] | null>;
  getEventList(
    propVal: IEventRecord["tag" | "status" | "description" | "date"],
    dateTo?: Date
  ): Promise<IEventRecord[] | null>;
  updateEvent(id: number, newEvent: IEventRecord): Promise<IEventRecord | null>;
  deleteEvent(id: number): Promise<number | null>;
}

export class CalendarController implements ICalendarController {
  private storage = new Storage();
  private static instance: CalendarController | null = null;

  constructor() {
    if (CalendarController.instance === null) {
      CalendarController.instance = this;
    }
    return CalendarController.instance;
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

  async getEventList(
    propVal: IEventRecord["tag" | "status" | "description" | "date"],
    dateTo?: Date
  ): Promise<IEventRecord[] | null> {
    if (propVal instanceof Date) {
      const dateFrom = propVal;
      if (dateTo instanceof Date) {
        return this.storage.filterItems("date", dateFrom, dateTo);
      }
    } else if (propVal in ETag) {
      return this.storage.filterItems("tag", propVal as ETag);
    } else if (propVal in EStatus) {
      return this.storage.filterItems("status", propVal as EStatus);
    }
      return this.storage.filterItems("description", propVal as string);
  }

  async updateEvent(
    id: number,
    newEvent: IEventRecord
  ): Promise<IEventRecord | null> {
    return this.storage.updateItem(id, newEvent);
  }
}
