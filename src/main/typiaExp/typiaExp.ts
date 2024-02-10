import { is } from "typia";

export function typiaExp() {
  if (is<number>(1)) console.log("expected: is");
  else console.log("not expected:", new Error().stack);

  if (!is<number>("1")) console.log("expected: is not");
  else console.log("not expected:", new Error().stack);

  type Complex = {
    t: { a: { b: { c: number; b: string; z: null; x: object } } };
  };

  if (
    is<Complex>({
      t: { a: { b: { b: "1", c: 2, x: {}, z: null } } },
    } satisfies Complex)
  )
    console.log("expected: is");
  else console.log("not expected:", new Error().stack);

  const complex2 = { t: { a: { b: { b: 1 } } } };
  if (!is<Complex>(complex2)) console.log("expected: is not");
  else console.log("not expected:", new Error().stack);
}
