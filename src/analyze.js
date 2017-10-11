import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    analyzeCallExpression(path, state) {
      return makeAnalyzer(
        [schemas.rpc],
        path,
        state,
        analysisState
      );
    }
    // analyzeMemberExpression(path, state) {
    //   return makeAnalyzer([schemas.collection], path, state, analysisState);
    // }
  };
}
