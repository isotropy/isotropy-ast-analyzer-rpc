import {
  Match,
  Skip,
  parse,
  any,
  optional,
  repeatingItem,
  capture,
  builtins as $
} from "chimpanzee";
import { source } from "../chimpanzee-utils";
import { collection } from "./";
import { query } from "./";
import { rpcPost } from "../rpc-statements";
import composite from "../chimpanzee-utils/composite";
import clean from "../chimpanzee-utils/node-cleaner";

export default function(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: source([collection, query])(state, analysisState),
        property: {
          type: "Identifier",
          name: capture("procedure")
        }
      },
      arguments: optional(capture("args"))
    },
    {
      build: rpc => context => result =>
        result instanceof Match
          ? (() => {
              return result.value.arguments[0]
                ? rpcPost(
                    result.value.object,
                    { function: result.value.procedure },
                    { args: clean(result.value.arguments[0]) }
                  )
                : rpcPost(result.value.object, {
                    function: result.value.procedure
                  });
            })()
          : result
    }
  );
}
