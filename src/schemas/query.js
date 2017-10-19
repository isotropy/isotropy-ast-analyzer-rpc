import { capture, wrap, Match } from "chimpanzee";
import composite from "../chimpanzee-utils/composite";
import { source } from "../chimpanzee-utils";
import { handler } from "./";

export default function query(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: source([handler, query])(state, analysisState),
      property: {
        type: "Identifier",
        name: capture("handler")
      }
    },
    {
      build: obj => context => result =>
        result instanceof Match
          ? (() => {
              return {
                handler: !result.value.object.namespace
                  ? [result.value.object.handler, result.value.handler]
                  : result.value.object.namespace.concat(
                      result.value.collection
                    ),
                identifier: result.value.object.identifier,
                module: result.value.object.module
              };
            })()
          : result
    }
  );
}
