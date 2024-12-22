import { OperationType, type OperationRaw } from "./types";

export class Operation {
  type: OperationType;
  index: number;
  string: string;

  static fromJson(operation: OperationRaw) {
    return new Operation(operation.type, operation.index, operation.string)
  }

  constructor(type: OperationType, index: number, string: string) {
    this.type = type;
    this.index = index;
    this.string = string;
  }

  toJson() {
    return {
      ...this,
    }
  }

}

// hello
// c1: deleting o index: 4
// hell
// c2: adding b index: 4
//
// delete o 4 length: 1
// insert b 4 length: 1
//
// delete o 4 length: 1
// hell
// insect b 3 length: 1 
