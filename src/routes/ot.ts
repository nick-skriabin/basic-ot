import { Operation, type OT } from "$lib/ot";
import type { ActionReturn } from "svelte/action";
import type { HTMLAttributes } from "svelte/elements";
import { OTClient } from "$lib/ot/client";
import { OperationType } from "$lib/ot/types";

type OTParams = {
  ot: OT
}

export const useOT = <D extends OTParams>(node: HTMLTextAreaElement, params: D): ActionReturn<D, HTMLAttributes<HTMLTextAreaElement>> => {
  let previousValue = node.value
  const otc = new OTClient()

  otc.ot.onHistoryChange(() => {
    let selectionStart = node.selectionStart;
    const lastOperation = otc.ot.history.at(-1)!
    node.value = otc.ot.collapse();
    previousValue = node.value

    if (selectionStart > lastOperation.index) {
      selectionStart += lastOperation.string.length;
    }

    node.selectionStart = selectionStart
    node.selectionEnd = selectionStart
  })

  node.value = otc.ot.collapse()

  node.addEventListener('input', () => {
    const currentValue = node.value;
    let index = node.selectionStart - 1

    if (currentValue.length > previousValue.length) {
      const string = node.value.substring(index, index + 1)
      otc.add({ type: OperationType.insert, index, string })
    } else if (currentValue.length < previousValue.length) {
      const diff = previousValue.length - currentValue.length;
      index += 1
      const string = previousValue.substring(index, index + diff + 1)

      otc.add({ type: OperationType.delete, index: index, string })
    }
    previousValue = currentValue
  })

  return {
    update() { },
    destroy() { },
  }
}
