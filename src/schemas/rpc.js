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
              const analysisBreakDown = identifyCollectionVariables(
                result.value
              );
              debugger;
              return result.value.arguments[0]
                ? rpcPost(
                    {
                      collectionArray: analysisBreakDown.collectionArray,
                      ...analysisBreakDown.deepestKnownObject
                    },
                    { function: result.value.procedure },
                    { args: clean(result.value.arguments[0]) }
                  )
                : rpcPost(
                    {
                      collectionArray: analysisBreakDown.collectionArray,
                      ...analysisBreakDown.deepestKnownObject
                    },
                    { function: result.value.procedure }
                  );
            })()
          : result
    }
  );
}

function identifyCollectionVariables(
  currentLocation = result,
  collectionArray = [],
  deepestKnownObject = {}
) {
  let deeperLevelExists = false;
  for (let key in currentLocation) {
    if (key === "collection") collectionArray.push(currentLocation.collection);
    if (key === "object") {
      deeperLevelExists = true;
      deepestKnownObject = currentLocation.object;
    }
  }
  if (deeperLevelExists)
    return identifyCollectionVariables(
      currentLocation.object,
      collectionArray,
      deepestKnownObject
    );
  delete deepestKnownObject.collection;
  return { collectionArray, deepestKnownObject };
}

// function identifyCollectionVariables(
//   currentLocation,
//   analysisResult,
//   deepestKnownObject = {},
//   nestCount = 0
// ) {
//   let deeperLevelExists = false;
//   for (let key in currentLocation) {
//     if (key === "object") {
//       deeperLevelExists = true;
//       deepestKnownObject = currentLocation.object;
//     }
//   }
//   if (deeperLevelExists)
//     return identifyCollectionVariables(
//       currentLocation.object,
//       analysisResult,
//       deepestKnownObject,
//       ++nestCount
//     );
//   const deepestObjectProp = ".object".repeat(nestCount)
//   eval ("delete(analysisResult)" + deepestObjectProp)
//   return { analysisResult, deepestKnownObject };
// }
