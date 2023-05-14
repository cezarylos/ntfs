export interface EventInterface {
  contractAddress: string;
  winterProjectId: string;
  ABI: Array<Record<string, any>>;
  eventName: string;
  eventDescription: string;
  id: number;
}
