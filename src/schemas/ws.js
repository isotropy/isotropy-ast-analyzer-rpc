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
import root from "./root";
import { wsPost } from "../ws-statements";
import composite from "../chimpanzee-utils/composite";
import clean from "../chimpanzee-utils/node-cleaner";
import { print } from "../tools/debug-util";

function memberExp(state, analysisState) {
  return composite(
    {
      type: "MemberExpression",
      object: source(() => [root, wsSchema])(state, analysisState),
      property: {
        type: "Identifier",
        name: capture("name")
      }
    },
    {
      build: () => () => result =>
        result instanceof Match
          ? result.value.object.path
            ? {
                path: [
                  ...result.value.object.path,
                  { type: "MemberExpression", name: result.value.name }
                ]
              }
            : { path: [{ type: "MemberExpression", name: result.value.name }] }
          : result
    }
  );
}

function callExp(state, analysisState) {
  return composite(
    {
      type: "CallExpression",
      callee: source(() => [root, wsSchema])(state, analysisState),
      arguments: optional(capture("args"))
    },
    {
      build: obj => () => result =>
        result instanceof Match
          ? result.value.callee.path
            ? {
                path: [
                  ...result.value.callee.path,
                  { type: "CallExpression", args: result.value.args }
                ]
              }
            : { path: [{ type: "CallExpression", args: result.value.args }] }
          : result
    }
  );
}

const wsSchema = function(state, analysisState) {
  return any([memberExp(state, analysisState), callExp(state, analysisState)], {
    build: () => () => _result =>
      _result instanceof Match ? { path: _result.value.path } : _result
  });
};

export default wsSchema;
