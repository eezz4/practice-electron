import { is } from "typia";

export function TypiaExp() {
  type TypeDummy = {
    aaa: {
      bb: {
        cccc: string;
        dddd: number;
      };
    };
  };

  const a = is<TypeDummy>({
    aaa: { bb: { cccc: "aa", dddd: 1 } },
  } satisfies TypeDummy)
    ? "expected: equal type"
    : "not expected";

  const b = is<number>("dummy") ? "not expected" : "expected: not equal type";

  const c = is<number>(1) ? "expected: equal type" : "not expected";

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span>{a}</span>
      <span>{b}</span>
      <span>{c}</span>
    </div>
  );
}
