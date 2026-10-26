import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** false en el SSR y durante la hidratación; true después. Para lo que vive en localStorage. */
export function useHidratado(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
