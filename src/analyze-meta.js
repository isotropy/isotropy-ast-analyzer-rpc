import path from "path";

export default function(analysisState) {
  return {
    analyzeImportDeclaration(babelPath, state) {
      // Incorrect config
      return !state.opts.projects
        ? false
        : (() => {
            // Checks if file being translated is a project
            const wsProject = state.opts.projects.find(project => {
              const projectDir = project.dir.startsWith("./")
                ? project.dir
                : "./" + project.dir;
              const absolutePath = path.resolve(projectDir) + "/";
              return state.file.opts.filename.startsWith(absolutePath);
            });

            return !wsProject
              ? false
              : (() => {
                  const moduleName = babelPath.get("source").node.value;
                  const resolvedName =
                    path.resolve(
                      path.dirname(state.file.opts.filename),
                      moduleName
                    ) + "/";

                  const module = wsProject.modules.find(m => {
                    const sourceDir = m.source.startsWith("./")
                      ? m.source
                      : "./" + m.source;
                    const absolutePath = path.resolve(sourceDir) + "/";
                    return absolutePath === resolvedName;
                  });

                  // Current path not listed in modules
                  return !module
                    ? false
                    : (() => {
                        const specifier = babelPath.get("specifiers.0").node
                          .local.name;
                        const binding = babelPath.scope.bindings[specifier];
                        analysisState.importBindings = analysisState.importBindings.concat(
                          {
                            module,
                            binding
                          }
                        );
                        return true;
                      })();
                })();
          })();
    }
  };
}
