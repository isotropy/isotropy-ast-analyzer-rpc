import should from "should";
import * as babel from "babel-core";
import fs from "fs";
import path from "path";
import makePlugin from "./plugin";
import sourceMapSupport from "source-map-support";
import * as utils from "isotropy-plugin-dev-utils";
import { Match, Skip, Fault, Empty } from "chimpanzee";

sourceMapSupport.install();

describe("isotropy-ast-analyzer-webservices", () => {
  function run([description, dir, resultType, opts]) {
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
      const actual = result.analysis;
      console.log("ACT", actual);
      if (resultType === "match") {
        actual.should.be.an.instanceOf(Match);
        const cleaned = utils.astCleaner.clean(actual.value);
        cleaned.should.deepEqual(expected);
      } else if (resultType === "empty") {
        actual.should.be.an.instanceOf(Empty);
      } else if (resultType === "skip") {
        actual.should.be.an.instanceOf(Skip);
        actual.message.should.equal(expected.message);
      } else if (resultType === "fault") {
        actual.should.be.an.instanceOf(Fault);
        actual.message.should.equal(expected.message);
      }
    });
  }

  const tests = [
    // ["ws-call-simple-args", "ws-call-simple-args", "match"],
    // ["ws-call-no-args", "ws-call-no-args", "match"],
    // ["ws-call", "ws-call", "match"],
    // ["ws-get", "ws-get", "match"],
    // ["ws-default-method", "ws-default-method", "match"],
    // ["ws-call-nested", "ws-call-nested", "match"],
    // [
    //   "ws-call-missing-methods",
    //   "ws-call-missing-methods",
    //   "match",
    //   { missingHttpMethods: true }
    // ],
    ["non-specific-read-error", "non-specific-read-error", "fault"]
  ].forEach(test => run(test));
});
