import { capture, wrap, Match } from "chimpanzee";
import { createCollection } from "../ws-statements";
import { root } from "./";
import composite from "../chimpanzee-utils/composite";

export default function(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: wrap(root(state, analysisState), {
        key: "root",
        selector: "path"
      }),
      property: {
        type: "Identifier",
        name: capture("handler")
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? createCollection({
              identifier: result.value.root.identifier,
              module: result.value.root.module,
              collection: result.value.collection
            })
          : result
    }
  );
}
