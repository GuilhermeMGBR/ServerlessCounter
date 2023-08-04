const args = process.argv.slice(2);

console.log('{');

Object.keys(process.env)
  .sort()
  .reduce((_, key) => {
    if (key.startsWith('npm_') && args[0] !== 'include_npm') {
      return;
    }

    console.log(`  ${key}: ${process.env[key]}`);
  }, {});

console.log('}');
