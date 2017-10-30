import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";
import { schemas as errorSchemas } from "isotropy-analyzer-errors";

export default function(analysisState) {
  return {
    analyzeCallExpression(path, state) {
      return makeAnalyzer([schemas.callExpression], path, state, analysisState);
    },
    analyzeMemberExpression(path, state) {
      return makeAnalyzer(
        [schemas.memberExpression],
        path,
        state,
        analysisState
      );
    }
  };
}
