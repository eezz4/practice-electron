import { useRef } from "react";
import { ComplexType } from "../../globals/typiaType";
import { invoke } from "../modules/electron.util";

export function TypiaExp() {
  const ref = useRef<number | string>();
  return (
    <>
      <button
        onClick={() => {
          ref.current = ref.current === 1 ? "" : 1;
          invoke("TypiaExp1", ref.current).then(console.log);
        }}
      >
        TypiaExp
      </button>
      <button
        onClick={() => {
          invoke("TypiaExp2", {
            a: { b: 1, c: "" },
          } satisfies ComplexType).then(console.log);
          invoke("TypiaExp2", "").then(console.log);
        }}
      >
        TypiaExp2
      </button>
    </>
  );
}
