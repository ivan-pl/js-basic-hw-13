import { ICalendarStorage, CalendarStorage } from "./calendarStorage";

describe("CalendarStorage", () => {
  let calendarStorage: ICalendarStorage;

  beforeEach(() => {
    calendarStorage = new CalendarStorage();
  });

  describe(".addEvent", () => {
    it(".addEvents exists", () => {
      expect(calendarStorage.addEvent).toBeInstanceOf(Function);
    });
  });
});
