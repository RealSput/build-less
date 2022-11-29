const cp = require('child_process');
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');
const parser = require('gyp-parser');
if (!process.argv[2] || process.argv[2] == "help") {
  console.log(`build-less v1.0.0
  
Subcommands:

-  build: Builds the bindings and compiles them to .js files
-  cleanup: Cleans up directories and files (deletes "build" folder, deletes "binding.gyp" file, and any other thing that might trigger building on installation)
-  init <dirname>: Initiates a node-gyp project`);
} else if (process.argv[2] == "build") {
  if (!fs.existsSync('binding.gyp')) {
    throw "The 'binding.gyp' file was not found, could not compile addons to JavaScript code.";
  }
  if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
  };
  const gyp_f = parser.parse(fs.readFileSync('binding.gyp').toString());
  cp.exec('node-gyp rebuild', (err, evr) => {
    if (err) throw err;
    console.log(evr);
    gyp_f.targets.forEach((e, i) => {
      let tar = e.target_name;
      let name = 'build/Release/' + tar + '.node';
      let file = fs.readFileSync(name);
      let u8a = Array.from(Uint8Array.from(file));
      u8a = u8a.toString()

      function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
      const hex = makeid(10);

      let code = `const fs = require('fs');
let u8a = Uint8Array.from([${u8a}]);
fs.writeFileSync('./${hex}.node', u8a);
let binding = require(process.cwd() + '/${hex}.node');
fs.unlinkSync('./${hex}.node');
module.exports = binding;`;
      if (!fs.existsSync('buildless-build')) fs.mkdirSync('buildless-build');
      fs.writeFileSync('buildless-build/' + tar + '.js', JavaScriptObfuscator.obfuscate(code).getObfuscatedCode());
      console.log('Success! Files outputted at buildless-build/' + tar + '.js.');
    });
  });
} else if (process.argv[2] == "init") {
  if (!process.argv[3]) throw "No directory specified!";
  let p = process.argv[3];
  fs.mkdirSync(p);
  fs.mkdirSync(p + '/build');
  fs.writeFileSync(p + '/binding.gyp', `{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}`);
  fs.writeFileSync(p + '/addon.cc', `#include <node_api.h>
#include <assert.h>

napi_value Method(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value world;
  status = napi_create_string_utf8(env, "world", 5, &world);
  assert(status == napi_ok);
  return world;
}

#define DECLARE_NAPI_METHOD(name, func)                          \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = DECLARE_NAPI_METHOD("hello", Method);
  status = napi_define_properties(env, exports, 1, &desc);
  assert(status == napi_ok);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)`);
  fs.writeFileSync(p + '/index.js', `const Addon = require('./buildless-build/addon');
console.log('Hello,', Addon.hello() + '!');`);
  fs.writeFileSync(p + '/package.json', JSON.stringify({
    "name": p,
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "UNLICENSED",
    "gypfile": true
  }, null, 2));
  console.log(`Directory "${p}" succesfully set up.`);
} else if (process.argv[2] == "cleanup") {
  const package_j = JSON.parse(fs.readFileSync('package.json').toString());
  delete package_j.gypfile;
  fs.writeFileSync('package.json', JSON.stringify(package_j, null, 2));
  fs.unlinkSync('binding.gyp');
  fs.rmSync('build', {
    recursive: true
  });
} else if (process.argv[2] == "dirty") {
  const package_j = JSON.parse(fs.readFileSync('package.json').toString());
  package_j.gypfile = true;
  fs.writeFileSync('package.json', JSON.stringify(package_j, null, 2));
  fs.mkdirSync('build');
  fs.writeFileSync(p + '/binding.gyp', `{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}`);
} else {
  console.log("Error: command does not exist. Use the 'help' subcommand to start.");
}