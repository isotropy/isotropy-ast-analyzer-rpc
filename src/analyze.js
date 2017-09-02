import * as schemas from "./schemas";
import makeAnalyzer from "./make-analyzer";

export default function(analysisState) {
  return {
    /*
    Ending with a method call
    */
    analyzeCallExpression(path, state) {
      return makeAnalyzer(
        [schemas.rpc],
        path,
        state,
        analysisState
      );
    },
    /*
      Ending with a member expression
    */
    analyzeMemberExpression(path, state) {
      return makeAnalyzer([schemas.collection], path, state, analysisState);
    }
  };
}
