import {
  Match,
  Skip,
  parse,
  any,
  optional,
  wrap,
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
  const callees = [
    {
      type: "MemberExpression",
      object: source([collection, query])(state, analysisState),
      property: {
        type: "Identifier",
        name: capture("procedure")
      }
    },
    source([collection])(state, analysisState)
  ];

  const schemas = callees.map(callee =>
    composite({
      type: "CallExpression",
      callee,
      arguments: optional(capture("args"))
    })
  );

  return any(schemas, {
    build: rpc => context => _result =>
      _result instanceof Match
        ? (() => {
            console.log(_result)
            //const result =
            if (!result.value.procedure) {
              // Recalibration in case of no nesting.
              result.value.object = result.value.callee;
              delete result.value.callee;
              result.value.procedure = result.value.object.collection;
              delete result.value.object.collection;
            }

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
  });
}
