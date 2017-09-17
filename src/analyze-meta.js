import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      // Incorrect config
      if (!state.opts.projects) return false;
      debugger;
      const moduleName = babelPath.get("source").node.value;
      const resolvedName =
        path.resolve(path.dirname(state.file.opts.filename), moduleName) + "/";

      let absolutePath = null;

      const rpcProject = state.opts.projects.find(project => {
        const projectDir = project.dir.startsWith("./")
          ? project.dir
          : "./" + project.dir;
        absolutePath = path.resolve(projectDir) + "/";
        return resolvedName.startsWith(absolutePath);
      });

      // Not a fs project
      if (!rpcProject) return false;
      rpcProject.absolutePath = absolutePath;

      const rpcModule = rpcProject.modules.find(m => {
        absolutePath =
          (rpcProject.absolutePath + m.source).replace(/\/\//g, "/") + "/";
        return resolvedName === absolutePath;
      });

      // Current path not listed in modules
      if (!rpcModule) return false;

      const specifier = babelPath.get("specifiers.0").node.local.name;
      analysisState.importBindings = analysisState.importBindings.concat({
        module: rpcModule.url,
        binding: babelPath.scope.bindings[specifier]
      });
      return true;
    }
  };
}
