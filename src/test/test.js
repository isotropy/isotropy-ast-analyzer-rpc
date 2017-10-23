import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";
import { clean } from "isotropy-analyzer-utils";

sourceMapSupport.install();

describe("isotropy-ast-analyzer-webservices", () => {
  function run([description, dir, opts]) {
    it(`${description}`, () => {
      const fixturePath = path.resolve(
        __dirname,
        "fixtures",
        dir,
        `fixture.js`
      );
      const pluginInfo = makePlugin(opts);

      const config1 = {
        projects: [
          {
            dir: "dist/test/fixtures",
            modules: [
              {
                source: "dist/test/server/my-server",
                remoteUrl: "http://www.poe3.com",
                httpMethods: {
                  get: ["$get"],
                  post: ["$post"]
                }
              }
            ]
          }
        ]
      };

      const config2 = {
        projects: [
          {
            dir: "dist/test/fixtures",
            modules: [
              {
                source: "dist/test/server/my-server",
                remoteUrl: "http://www.poe3.com"
              }
            ]
          }
        ]
      };

      const config = opts && opts.missingHttpMethods ? config2 : config1;

      const callWrapper = () => {
        babel.transformFileSync(fixturePath, {
          plugins: [
            [pluginInfo.plugin, config],
            "transform-object-rest-spread"
          ],
          parserOpts: {
            sourceType: "module",
            allowImportExportEverywhere: true
          },
          babelrc: false
        });
        return pluginInfo.getResult();
      };

      const expected = require(`./fixtures/${dir}/expected`);
      const result = callWrapper();
      const actual = clean(result.analysis.value);
      actual.should.deepEqual(expected);
    });
  }

  const tests = [
    ["ws-call-simple-args", "ws-call-simple-args"],
    ["ws-call-no-args", "ws-call-no-args"],
    ["ws-call", "ws-call"],
    ["ws-get", "ws-get"],
    ["ws-default-method", "ws-default-method"],
    ["ws-call-nested", "ws-call-nested"],
    [
      "ws-call-missing-methods",
      "ws-call-missing-methods",
      { missingHttpMethods: true }
    ]
  ].forEach(test => run(test));
});
