import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      // Incorrect config
      if (!state.opts.projects) return false;

      // Checks if file being translated is a project
      const rpcProject = state.opts.projects.find(project => {
        const projectDir = project.dir.startsWith("./")
          ? project.dir
          : "./" + project.dir;
        const absolutePath = path.resolve(projectDir) + "/";
        return state.file.opts.filename.startsWith(absolutePath);
      });

      // Not a rpc project
      if (!rpcProject) return false;

      const moduleName = babelPath.get("source").node.value;
      const resolvedName =
        path.resolve(path.dirname(state.file.opts.filename), moduleName) + "/";

      const rpcModule = rpcProject.modules.find(m => {
        const sourceDir = m.source.startsWith("./")
          ? m.source
          : "./" + m.source;
        const absolutePath = path.resolve(sourceDir) + "/";
        return absolutePath === resolvedName;
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
