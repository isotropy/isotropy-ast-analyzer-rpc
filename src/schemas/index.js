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
import { source, composite, clean } from "isotropy-analyzer-utils";
import root from "./root";

export { default as root } from "./root";

export function memberExpression(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: source(() => [root, wsSchema])(state, analysisState),
      property: {
        type: "Identifier",
        name: capture("memberName")
      }
    },
    {
      build: () => () => result =>
        result instanceof Match
          ? {
              ...result.value.object,
              expressions: (result.value.object.expressions || []).concat({
                type: "MemberExpression",
                memberName: result.value.memberName
              })
            }
          : result
    }
  );
}

export function callExpression(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: source(() => [root, wsSchema])(state, analysisState),
      arguments: capture("arguments")
    },
    {
      build: obj => () => result =>
        result instanceof Match
          ? {
              ...result.value.callee,
              expressions: (result.value.callee.expressions || []).concat({
                type: "CallExpression",
                arguments: result.value.arguments
              })
            }
          : result
    }
  );
}

const wsSchema = function(state, analysisState) {
  return any([
    memberExpression(state, analysisState),
    callExpression(state, analysisState)
  ]);
};
