import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";
import { schemas as errorSchemas } from "isotropy-analyzer-errors";

export default function(analysisState) {
  return {
    analyzeCallExpression(path, state) {
      return makeAnalyzer(
        [
          schemas.callExpression,
          errorSchemas.readErrorSchema(
            schemas.root,
            "Unable to parse Web Services expression. Refer to documentation."
          )
        ],
        path,
        state,
        analysisState
      );
    },
    analyzeMemberExpression(path, state) {
      return makeAnalyzer(
        [
          schemas.memberExpression,
          errorSchemas.readErrorSchema(
            schemas.root,
            "Unable to parse Web Services expression. Refer to documentation."
          )
        ],
        path,
        state,
        analysisState
      );
    }
  };
}
