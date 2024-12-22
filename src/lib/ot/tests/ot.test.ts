import { describe, expect, it } from "vitest"
import { OT } from ".."
import { OperationType } from "../types"
import { Operation } from "../operation"

describe("First test", () => {
  it("can initialize with document", () => {
    const ot = new OT("hello world")

    expect(ot.initialDocument).toEqual("hello world")
    expect(ot.history.at(0)).toEqual({ type: OperationType.insert, index: 0, string: "hello world" })
  })

  it("should accept raw json", () => {
    const operation = Operation.fromJson({
      type: OperationType.insert,
      index: 256,
      string: "hello Operational Transform"
    })

    expect(operation).instanceOf(Operation)
    expect(operation.type).toEqual(OperationType.insert)
    expect(operation.index).toEqual(256)
    expect(operation.string).toEqual("hello Operational Transform")
  })

  it("should correctly transform insert operation", () => {
    const ot = new OT("hello world")

    // ot.processOperation(new Operation(OperationType.insert, 0, "hello world"))
    let lastOp = ot.processOperation(new Operation(OperationType.insert, 5, " banana "))

    expect(ot.history.at(0)?.toJson()).toEqual({
      type: OperationType.insert,
      index: 0,
      string: "hello world"
    })

    // 0 -> (5 + 0 + 11) = 16
    expect(ot.history.at(-1)).toEqual({
      type: OperationType.insert,
      index: 5,
      string: " banana "
    })

    // hello world 0 
    // hello| banana world 5
    // hello| subscribe world 5
    // hello banana world -> hello banana subscribe world
    //       c    p   l
    // 0 -> (5  + 0 + 11) = 16 - index (5)
    // 5 -> (16 + 5 + 8) = 29 - index (13)
    ot.processOperation(new Operation(OperationType.insert, 5, "subscribe"))

    // 9 - (9 - 5) + length 5 + 8
    expect(ot.history.at(-1)).toEqual({
      type: OperationType.insert,
      index: 13,
      string: "subscribe"
    })

    expect(ot.collapse()).toEqual("hello banana subscribe world")
  })
})
