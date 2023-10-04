const HOLDERS = [
  '0xc401e38b04e9c176df52eb070bf4999c6cf28937',
  '0x9833ba5bfa12c10b3528f92157b2e66b91e271bd',
  '0x4c5f4020d40983bb2820ed5fc13fb088ddff0270',
  '0x3ca210c4fdbad16bb8624edb3fcfb76ebef56376',
  '0xd3c0ab0d0ba1056a99b9680476d5a4de7a49f46b',
  '0xf90053c15884ba78b0a9526c536f97fa4c06637b',
  '0x51975ed2fac38eab25a72d02f4e109e649ae4b12',
  '0xf1c180d2e181c038f19cfcdc6ad57e538e123e19',
  '0xb51ef29dcb790f5367d9a0388bc4a33b80476c9d',
  '0xa9e4b8033ced856e26abf64ccbe3c3be7612065c'
];

const TOKEN_ID_START = 21;

const init = async () => {
  const result = [];
  for (let i = 0; i < HOLDERS.length; i++) {
    result.push(`${HOLDERS[i]},${TOKEN_ID_START + i}`);
  }
  console.log(result.join('\n'));
};

init();
