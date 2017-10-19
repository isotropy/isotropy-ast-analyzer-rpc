import { parse, any, builtins as $ } from "chimpanzee";

/*
  Defers eval of schema until we need it.
  This is necessary to avoid infinite recursion;
  schemas might contain schemas which contain themselves.
*/
export default function(_schemas, params) {
  return (state, analysisState) =>
    $.func(
      (obj, key, parents, parentKeys) => context => {
        const schemas = typeof _schemas === "function" ? _schemas() : _schemas;
        const anySchema = any(
          schemas.map(schema => schema(state, analysisState))
        );
        return parse(anySchema)(obj, key, parents, parentKeys)(context);
      },
      params
    );
}
