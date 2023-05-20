export interface EventInterface {
  contractAddress: string;
  winterProjectId: string;
  ABI: Array<Record<string, any>>;
  name: string;
  description: string;
  startDate: Date;
  id: number;
  chainId: string;
}
