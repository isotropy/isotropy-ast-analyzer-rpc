import { Match, Skip } from "chimpanzee";

export default function(state, analysisState) {
  const moduleIdentifier = (path, key, parents, parentKeys) => context => {
    const env = { path, key, parents, parentKeys };
    return path.type === "Identifier"
      ? (() => {
          const importBinding = analysisState.importBindings.find(
            b => b.binding.identifier.name === path.node.name
          );

          return importBinding &&
            importBinding.binding.referencePaths.includes(path)
            ? (() => {
                const module = importBinding.module;
                const identifier = path.node.name;

                const httpMethod =
                  (module.httpMethods &&
                    Object.keys(module.httpMethods).find(
                      method =>
                        module.httpMethods[method] &&
                        module.httpMethods[method].includes(identifier)
                    )) ||
                  "get";

                return new Match(
                  {
                    module: {
                      source: module.source,
                      remoteUrl: module.remoteUrl
                    },
                    identifier,
                    httpMethod
                  },
                  env
                );
              })()
            : new Skip(`Did not match any known ws modules.`, env);
        })()
      : new Skip(`Root node is not an Identifier`, env);
  };

  return moduleIdentifier;
}
