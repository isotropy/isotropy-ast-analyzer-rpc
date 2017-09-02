import meta from "./analyze-meta";
import analyze from "./analyze";

function makeAnalysisState() {
  return {
    importBindings: []
  };
}

export default function() {
  const state = makeAnalysisState();
  return {
    meta: meta(state),
    analyze: analyze(state),
  };
}
