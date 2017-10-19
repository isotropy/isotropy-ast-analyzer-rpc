import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";
import clean from "../chimpanzee-utils/node-cleaner";

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

      const callWrapper = () => {
        babel.transformFileSync(fixturePath, {
          plugins: [
            [
              pluginInfo.plugin,
              {
                projects: [
                  {
                    dir: "dist/test/fixtures",
                    modules: [
                      {
                        source: "dist/test/server/my-server",
                        url: "http://www.poe3.com"
                      }
                    ]
                  }
                ]
              }
            ],
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
      const actual = clean(result.analysis);
      console.log(result.analysis);
      actual.should.deepEqual(expected);
    });
  }

  const tests = [
    // ["ws-import-all", "ws-import-all"],
    ["ws-import-default", "ws-import-default"]
    // ["ws-deep", "ws-deep"],
    // ["ws-args", "ws-args"]
  ].forEach(test => run(test));
});
