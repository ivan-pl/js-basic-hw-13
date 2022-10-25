import EStatus from "./status";
import ETag from "./tag";

interface IEventRecord {
  id?: number;
  date: Date;
  tag: ETag;
  status: EStatus;
  description: string;
}

export default IEventRecord;
