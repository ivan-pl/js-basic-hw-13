import IEventRecord from "./types/eventrecord";
import ETag from "./types/tag";
import EStatus from "./types/status";
import Storage from "./storage";

export interface ICalendarController {
  addEvent(event: IEventRecord): Promise<number>;
  getEvent(id: number): Promise<IEventRecord | null>;
  getEventList(dateFrom: Date, dateTo: Date): Promise<IEventRecord[] | null>;
  getEventList(ETag: ETag): Promise<IEventRecord[] | null>;
  getEventList(EStatus: EStatus): Promise<IEventRecord[] | null>;
  getEventList(
    dateFromOrETagOrEStatus: Date | ETag | EStatus,
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
    dateFromOrETagOrEStatus: Date | ETag | EStatus,
    dateTo?: Date
  ): Promise<IEventRecord[] | null> {
    if (dateFromOrETagOrEStatus instanceof Date) {
      const dateFrom = dateFromOrETagOrEStatus;
      if (dateTo instanceof Date) {
        return this.storage.getItemsByDate(dateFrom, dateTo);
      }
    } else if (dateFromOrETagOrEStatus in ETag) {
      const ETag = dateFromOrETagOrEStatus as ETag;
      return this.storage.getItemsByTag(ETag);
    }
    const EStatus = dateFromOrETagOrEStatus as EStatus;
    return this.storage.getItemsByStatus(EStatus);
  }

  async updateEvent(
    id: number,
    newEvent: IEventRecord
  ): Promise<IEventRecord | null> {
    return this.storage.updateItem(id, newEvent);
  }
}
