import { capture, wrap, Match } from "chimpanzee";
import { createMemberExpression } from "../rpc-statements";
import composite from "../chimpanzee-utils/composite";
import { source } from "../chimpanzee-utils";
import { collection } from "./";

export default function query(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: source([collection, query])(state, analysisState),
      property: {
        type: "Identifier",
        name: capture("collection")
      }
    },
    {
      build: obj => context => result => {
        if (result instanceof Match) {
          let collectionArray, object;
          // Checks if the last match was the root(collection)
          if (!result.value.object.collectionArray)
            collectionArray = [
              result.value.object.collection,
              result.value.collection
            ];
          else
            collectionArray = result.value.object.collectionArray.concat(
              result.value.collection
            );
          object = {
            identifier: result.value.object.identifier,
            module: result.value.object.module
          };
          return { collectionArray, ...object };
        }
        return result;
      }
    }
  );
}
