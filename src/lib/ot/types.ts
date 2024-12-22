export enum OperationType {
  insert = "insert",
  delete = "delete",
}

export type OperationRaw = {
  type: OperationType;
  index: number;
  string: string;
}

