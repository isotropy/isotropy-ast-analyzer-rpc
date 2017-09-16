import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      const rpcModules = Object.keys(state.opts.rpcModules).map(key => ({
        key,
        value: path.resolve(state.opts.rpcModules[key])
      }));

      const moduleName = babelPath.get("source").node.value;
      const resolvedName = path.resolve(path.dirname(state.file.opts.filename), moduleName);

      const rpcModule = rpcModules.find(p => p.value === resolvedName);
      if (rpcModule) {
        const specifier = babelPath.get("specifiers.0").node.local.name;
        analysisState.importBindings = analysisState.importBindings.concat({
          module: rpcModule.key,
          binding: babelPath.scope.bindings[specifier]
        });
        return true
      }
    }
  };
}
