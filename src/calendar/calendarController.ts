import EventRecord from "./types/eventrecord";
import Tag from "./types/tag";
import Status from "./types/status"

interface ICalendarController {
  addEvent(event: EventRecord): Promise<EventRecord>,
  getEventList(id: number): Promise<EventRecord[]>,
  getEventList(dateFrom: Date, dateTo?: Date): Promise<EventRecord[]>,
  getEventList(tag: Tag): Promise<EventRecord[]>,
  getEventList(status: Status): Promise<EventRecord[]>,
  updateEvent(id:number, newEvent: EventRecord):  Promise<EventRecord>,
  deleteEvent(id: number): Promise<EventRecord|null>,
}