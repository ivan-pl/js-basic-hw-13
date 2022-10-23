import Status from "./status";
import Tag from "./tag";

type EventRecord = {
  id?: number;
  date: Date;
  tag: Tag;
  status: Status;
  description: string;
};

export default EventRecord;
