import { ICalendarController, CalendarController } from "./calendarController";
import EventRecord from "./types/eventrecord";
import Status from "./types/status";
import Tag from "./types/tag";

describe("CalendarStorage", () => {
  let calendarController: ICalendarController;
  const event: EventRecord = {
    date: new Date(),
    tag: Tag.Work,
    status: Status.Pending,
    description: "Some event",
  };

  beforeEach(() => {
    globalThis.localStorage.clear();
    calendarController = new CalendarController();
  });

  describe(".addEvent", () => {
    it(".addEvents exists", () => {
      expect(calendarController.addEvent).toBeInstanceOf(Function);
    });

    it("returns Promise", () => {
      expect(calendarController.addEvent(event)).toBeInstanceOf(Promise);
    });

    it("add id to retuning Event", async () => {
      const id = await calendarController.addEvent(event);
      expect(typeof id).toBe("number");
    });

    it("adds different id's", async () => {
      const numberOfEvents = 5;
      const addedEvents = Array.from({ length: numberOfEvents }, () =>
        calendarController.addEvent(event)
      );

      const idArray = await Promise.all(addedEvents);
      const setOfId: Set<number> = new Set();
      idArray.forEach((_) => {
        if (_ !== undefined) {
          setOfId.add(_);
        }
      });

      expect(setOfId.size).toBe(numberOfEvents);
    });
  });

  describe(".getEvent", () => {
    it("returns Promise with null", async () => {
      const event = calendarController.getEvent(1);
      expect(event).toBeInstanceOf(Promise);
      expect(await event).toBe(null);
    });

    it("returns event", async () => {
      const id = await calendarController.addEvent(event);
      const returnedEvent = await calendarController.getEvent(id);
      expect(returnedEvent).toEqual({...event, id: id});
    });
  });
});
