import EventRecord from "./types/eventrecord";
import Tag from "./types/tag";
import Status from "./types/status";
import Storage from "./storage";

export interface ICalendarController {
  addEvent(event: EventRecord): Promise<number>;
  getEvent(id: number): Promise<EventRecord | null>;
  getEventList(dateFrom: Date, dateTo: Date): Promise<EventRecord[] | null>;
  getEventList(tag: Tag): Promise<EventRecord[] | null>;
  getEventList(status: Status): Promise<EventRecord[] | null>;
  getEventList(
    dateFromOrTagOrStatus: Date | Tag | Status,
    dateTo?: Date
  ): Promise<EventRecord[] | null>;
  updateEvent(id: number, newEvent: EventRecord): Promise<EventRecord | null>;
  deleteEvent(id: number): Promise<number | null>;
}

export class CalendarController implements ICalendarController {
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

  async getEventList(
    dateFromOrTagOrStatus: Date | Tag | Status,
    dateTo?: Date
  ): Promise<EventRecord[] | null> {
    if (dateFromOrTagOrStatus instanceof Date) {
      const dateFrom = dateFromOrTagOrStatus;
      if (dateTo instanceof Date) {
        return this.storage.getItemsByDate(dateFrom, dateTo);
      }
    } else if (dateFromOrTagOrStatus in Tag) {
      const tag = dateFromOrTagOrStatus as Tag;
      return this.storage.getItemsByTag(tag);
    }
    const status = dateFromOrTagOrStatus as Status;
    return this.storage.getItemsByStatus(status);
  }

  async updateEvent(
    id: number,
    newEvent: EventRecord
  ): Promise<EventRecord | null> {
    return this.storage.updateItem(id, newEvent);
  }
}
