import {
  Match,
  Skip,
  parse,
  optional,
  capture,
  builtins as $
} from "chimpanzee";
import { source } from "../chimpanzee-utils";
import { collection } from "./";
import { createRPC } from "../rpc-statements";
import composite from "../chimpanzee-utils/composite";
import clean from "../chimpanzee-utils/node-cleaner";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection])(state, analysisState),
        property: {
          type: "Identifier",
          name: capture("procedure")
        }
      },
      arguments: optional(capture("args"))
    },
    {
      build: () => () => result =>
        result instanceof Match
          ? (() => {
              return result.value.arguments[0]
                ? createRPC(
                    result.value.object,
                    { procedure: result.value.procedure },
                    { args: clean(result.value.arguments[0]) }
                  )
                : createRPC(result.value.object, {
                    procedure: result.value.procedure
                  });
            })()
          : result
    }
  );
}
