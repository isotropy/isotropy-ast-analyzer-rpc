import { capture, wrap, Match } from "chimpanzee";
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
        return result instanceof Match
          ? (() => {
              return {
                // checks if the last match was root(collection)
                collectionArray: !result.value.object.collectionArray
                  ? [result.value.object.collection, result.value.collection]
                  : result.value.object.collectionArray.concat(
                      result.value.collection
                    ),
                identifier: result.value.object.identifier,
                module: result.value.object.module
              };
            })()
          : result;
      }
    }
  );
}
