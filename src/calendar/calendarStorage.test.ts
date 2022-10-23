import { ICalendarStorage, CalendarStorage } from "./calendarStorage";
import EventRecord from "./types/eventrecord";
import Status from "./types/status";
import Tag from "./types/tag";

describe("CalendarStorage", () => {
  let calendarStorage: ICalendarStorage;
  const event: EventRecord = {
    date: new Date(),
    tag: Tag.Work,
    status: Status.Pending,
    description: "Some event",
  };

  beforeEach(() => {
    calendarStorage = new CalendarStorage();
  });

  describe(".addEvent", () => {
    it(".addEvents exists", () => {
      expect(calendarStorage.addEvent).toBeInstanceOf(Function);
    });

    it("returns Promise", () => {
      expect(calendarStorage.addEvent(event)).toBeInstanceOf(Promise);
    });

    it("add id to retuning Event", async () => {
      const addedEvent = await calendarStorage.addEvent(event);
      expect(typeof addedEvent.id).toBe("number");
    });

    it("adds different id's", async () => {
      const numberOfEvents = 5;
      const addedEvents = Array.from({ length: numberOfEvents }, () =>
        calendarStorage.addEvent(event)
      );

      const idArray = await Promise.all(addedEvents).then((values) =>
        values.map((_) => _.id)
      );
      const setOfId: Set<number> = new Set();
      idArray.forEach((_) => {
        if (_ !== undefined) {
          setOfId.add(_);
        }
      });

      expect(setOfId.size).toBe(numberOfEvents);
    });
  });
});
