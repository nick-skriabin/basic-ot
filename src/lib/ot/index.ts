import { Operation } from "./operation";
import { OperationType } from "./types";

export class OT {
  initialDocument: string
  history: Operation[] = []

  constructor(document: string) {
    this.initialDocument = document;
    this.createOperation(OperationType.insert, 0, document);
  }

  createOperation(type: OperationType, index: number, string: string) {
    this.history.push(new Operation(type, index, string))
  }


  processOperation(operation: Operation) {
    let newOperation = Operation.fromJson({ ...operation });
    for (let op of this.history) {
      newOperation = this.transform(op, newOperation)
    }

    this.history.push(newOperation);

    return operation;
  }

  transform(op1: Operation, op2: Operation) {
    let transformed = { ...op2 }

    console.log(op1.type, op2.type)
    switch (op1.type) {
      case OperationType.insert:
        if (op1.index !== 0 && op2.index >= op1.index) {
          // transformed.index = (op2.index + op1.index + op1.string.length) - op2.index;
          transformed.index += op1.string.length
        }
        break;
      case OperationType.delete:
        if (op2.index >= op1.index) {
          transformed.index -= Math.min(
            op1.string.length,
            op2.index - op1.index,
          )
        }
        break;
    }

    return Operation.fromJson(transformed)
  }

  collapse() {
    let finalDocument = "";

    for (let op of this.history) {
      const { string, index, type } = op

      switch (type) {
        case OperationType.insert:
          finalDocument = finalDocument.slice(0, index) + string + finalDocument.slice(index)
          break;
        case OperationType.delete:

          // hello banana world
          finalDocument = finalDocument.slice(0, index) + finalDocument.slice(index + string.length)
          break;
      }
    }

    return finalDocument
  }

}
