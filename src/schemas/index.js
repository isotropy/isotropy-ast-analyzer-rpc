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
import { source, clean } from "isotropy-analyzer-utils";
import root from "./root";
import { composite } from "chimpanzee";

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
  const schema = {
    type: "CallExpression",
    callee: source(() => [root, wsSchema])(state, analysisState),
    arguments: capture("arguments")
  };

  return composite(schema, {
    build: buildDefinition(
      obj => () => result =>
        result instanceof Match
          ? {
              ...result.value.callee,
              expressions: (result.value.callee.expressions || []).concat({
                type: "CallExpression",
                arguments: result.value.arguments
              })
            }
          : result,
      {
        schema,
        parent: s => s.callee,
        errors: {
          hasParentButSkipped: () => ``
        }
      }
    )
  });
}

function buildDefinition(build, params) {
  return params
    ? (obj, key, parent, parentKeys) => context => result =>
        result instanceof Skip
          ? params.parent && params.errors && params.errors.hasParentButSkipped
            ? (() => {
                const parentVal = parse(parent(schema))(
                  obj,
                  key,
                  parent,
                  parentKeys
                )(context);

              })()
            : result
          : result
    : build;
}

const wsSchema = function(state, analysisState) {
  return any([
    memberExpression(state, analysisState),
    callExpression(state, analysisState)
  ]);
};
