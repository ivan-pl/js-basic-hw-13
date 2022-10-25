import { ICalendarController, CalendarController } from "./calendarController";
import IEventRecord from "./types/eventrecord";
import EStatus from "./types/status";
import ETag from "./types/tag";

describe("CalendarController", () => {
  let calendarController: ICalendarController;
  const event: IEventRecord = {
    date: new Date(),
    tag: ETag.WORK,
    status: EStatus.PENDING,
    description: "Some event",
  };

  beforeEach(() => {
    globalThis.localStorage.clear();
    calendarController = new CalendarController();
  });

  it("CalendarController could have several instances", async () => {
    const calendarController2 = new CalendarController();
    expect(calendarController).not.toBe(calendarController2);

    const event2: IEventRecord = {
      date: new Date(),
      tag: ETag.LEISURE,
      status: EStatus.DONE,
      description: "Another event",
    };
    const idCal1 = await calendarController.addEvent(event);
    const idCal2 = await calendarController2.addEvent(event2);
    expect(idCal1).toBe(idCal2);

    expect(await calendarController.getEvent(idCal1)).not.toEqual(
      await calendarController2.getEvent(idCal2)
    );
  });

  describe(".addEvent", () => {
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
      expect(returnedEvent).toEqual({ ...event, id: id });
    });
  });

  describe(".updateEvent", () => {
    it("returns null", async () => {
      expect(await calendarController.updateEvent(-1, event)).toBe(null);
    });

    it("updates event", async () => {
      const id = await calendarController.addEvent(event);
      const newEvent: IEventRecord = {
        ...event,
        description: "New description",
      };

      expect(await calendarController.updateEvent(id, newEvent)).toEqual(
        newEvent
      );
      expect(await calendarController.getEvent(id)).toEqual(newEvent);
    });
  });

  describe(".deleteEvent", () => {
    it("returns null", async () => {
      expect(await calendarController.deleteEvent(-1)).toBe(null);
    });

    it("deletes event", async () => {
      const idArray = await Promise.all(
        Array.from({ length: 5 }, () => calendarController.addEvent(event))
      );

      idArray.forEach(async (id) => {
        const event = await calendarController.getEvent(id);
        expect(event?.id).toBe(id);
        const deletedId = await calendarController.deleteEvent(id);
        expect(deletedId).toBe(id);
        expect(await calendarController.getEvent(deletedId as number)).toBe(
          null
        );
      });
    });
  });

  describe(".getEventList", () => {
    const eventList: IEventRecord[] = [
      {
        date: new Date("2022-10-01"),
        tag: ETag.WORK,
        status: EStatus.PENDING,
        description: "Event 1",
      },
      {
        date: new Date("2022-10-02"),
        tag: ETag.WORK,
        status: EStatus.PENDING,
        description: "Event 2",
      },
      {
        date: new Date("2022-10-03"),
        tag: ETag.LEISURE,
        status: EStatus.INPROCESS,
        description: "Event 3",
      },
    ];

    let idList: number[];

    const fillIdList = async () => {
      idList = await Promise.all(
        eventList.map((e) => calendarController.addEvent(e))
      );
      return eventList.map((e, i) => ({ ...e, id: idList[i] }));
    };

    beforeEach(() => (idList = []));

    it("gets list by date", async () => {
      const newEventList = (await fillIdList()) as IEventRecord[];
      const events = (await calendarController.getEventList("date", {
        dateFrom: new Date("2022-10-02"),
        dateTo: new Date("2022-10-06"),
      })) as IEventRecord[];

      expect(events?.length).toBe(2);
      expect(events[0]).toEqual(newEventList[1]);
      expect(events[1]).toEqual(newEventList[2]);

      expect(
        await calendarController.getEventList("date", {
          dateFrom: new Date("2010-10-02"),
          dateTo: new Date("2012-10-06"),
        })
      ).toBe(null);
    });

    it("gets list by tag", async () => {
      const newEventList = (await fillIdList()) as IEventRecord[];
      let events = (await calendarController.getEventList(
        "tag",
        ETag.WORK
      )) as IEventRecord[];

      expect(events?.length).toBe(2);
      expect(events[0]).toEqual(newEventList[0]);
      expect(events[1]).toEqual(newEventList[1]);

      events = (await calendarController.getEventList(
        "tag",
        ETag.LEISURE
      )) as IEventRecord[];
      expect(events?.length).toBe(1);
      expect(events[0]).toEqual(newEventList[2]);

      expect(await calendarController.getEventList("tag", ETag.STUDY)).toBe(
        null
      );
    });

    it("gets list by status", async () => {
      const newEventList = (await fillIdList()) as IEventRecord[];
      let events = (await calendarController.getEventList(
        "status",
        EStatus.PENDING
      )) as IEventRecord[];

      expect(events?.length).toBe(2);
      expect(events[0]).toEqual(newEventList[0]);
      expect(events[1]).toEqual(newEventList[1]);

      events = (await calendarController.getEventList(
        "status",
        EStatus.INPROCESS
      )) as IEventRecord[];
      expect(events?.length).toBe(1);
      expect(events[0]).toEqual(newEventList[2]);

      expect(
        await calendarController.getEventList("status", EStatus.DONE)
      ).toBe(null);
    });

    it("gets list by description", async () => {
      const newEventList = (await fillIdList()) as IEventRecord[];
      let events = (await calendarController.getEventList(
        "description",
        "Event"
      )) as IEventRecord[];

      expect(events).toEqual(newEventList);

      events = (await calendarController.getEventList(
        "description",
        "1"
      )) as IEventRecord[];
      expect(events?.length).toBe(1);
      expect(events[0]).toEqual(newEventList[0]);

      expect(
        await calendarController.getEventList("description", "No such event")
      ).toBe(null);
    });
  });
});
