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
        return result instanceof Match
          ? createMemberExpression({
              object: result.value.object,
              collection: result.value.collection
            })
          : result;
      }
    }
  );
}
