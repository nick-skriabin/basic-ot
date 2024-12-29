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

    ot.processOperation(new Operation(OperationType.insert, 5, " banana "))

    expect(ot.history.at(0)?.toPOJO()).toEqual({
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

    ot.processOperation(new Operation(OperationType.insert, 5, "subscribe"))

    // 9 - (9 - 5) + length 5 + 8
    expect(ot.history.at(-1)).toEqual({
      type: OperationType.insert,
      index: 13,
      string: "subscribe"
    })

    expect(ot.collapse()).toEqual("hello banana subscribe world")
  })

  it("should correctly delete words", () => {
    const ot = new OT("hello world")

    // index: 5
    ot.processOperation(new Operation(OperationType.delete, 4, "o"))
    // hell world

    expect(ot.history.at(-1)).toEqual({
      type: OperationType.delete,
      index: 4,
      string: "o"
    })


    // hello world 0 
    // hello| banana world 5
    // hello| subscribe world 5
    // hello banana world -> hello banana subscribe world
    //       c    p   l
    // 0 -> (5  + 0 + 11) = 16 - index (5)
    // 5 -> (16 + 5 + 8) = 29 - index (13)
    // 9 -> (16 + 5 + 8) = 29 - index (13)
    ot.processOperation(new Operation(OperationType.delete, 9, "ld"))

    expect(ot.history.at(-1)).toEqual({
      type: OperationType.delete,
      index: 8,
      string: "ld"
    })

    expect(ot.collapse()).toEqual("hell wor")
  })

  it("should handle combination of insert and delete", () => {
    const ot = new OT("hello world")

    ot.processOperation(new Operation(OperationType.insert, 5, " banana"))
    // hello banana world
    expect(ot.collapse()).toEqual("hello banana world")
    // hello banana wor
    // 5 + 7 = 12
    // 9 - 5 = 4
    //
    // 0 -> (5  + 0 + 11) = 16 - index (5)
    // 5 -> (16 + 5 + 8) = 29 - index (13)
    // 9 -> &o
    ot.processOperation(new Operation(OperationType.delete, 9, "ld"))
    expect(ot.history.at(-1)).toEqual({
      type: OperationType.delete,
      index: 16,
      string: "ld"
    })
    // hello banana subscribe wor
    ot.processOperation(new Operation(OperationType.insert, 5, " subscribe"))

    expect(ot.collapse()).toEqual("hello banana subscribe wor")
  })

  it("should support typing", () => {
    const ot = new OT("something something something, we win")

    const string = " world"
    for(let char of string) {
      const index = 9 + string.indexOf(char)
      ot.processOperation(new Operation(OperationType.insert, index, char))
    }

    expect(ot.collapse()).toEqual("something world something something, we win")
  })
})


// operations imagine
//
// hello world
// insert " banana" at 5 
// hello banana world
// delete "ld" at 9 (transformed 16) 
// 
// insert " Thomas" at 4 (offset by 6 ->) 10 (offset by 4 <-) 6
// hello world Thomas
