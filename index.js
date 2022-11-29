const cp = require('child_process');
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

const gyp_f = JSON.parse(fs.readFileSync('binding.gyp').toString());
cp.execSync('npm rebuild');

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
});
