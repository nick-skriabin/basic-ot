import { updated } from "$app/state";
import type { OT } from "$lib/ot";
import type { ActionReturn } from "svelte/action";
import type { HTMLAttributes } from "svelte/elements";
import { OTClient } from "$lib/ot/client";

type OTParams = {
  ot: OT
}

export const useOT = <D extends OTParams>(node: HTMLElement, params: D): ActionReturn<D, HTMLAttributes<HTMLElement>> => {

  const ot = new OTClient()

  return {
    update() { },
    destroy() { },
  }
}
