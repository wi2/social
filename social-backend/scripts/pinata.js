const fs = require('fs');
require('dotenv/config');

async function writeCIDsFile(data, pathname) {
  console.log('start write');
  fs.writeFile(pathname, data, (err) => {
    if (err) {
      console.log('ERROR');
      console.log(err);
    } else {
      console.log('File written successfully\n');
      console.log('The written has the following contents:');
      const read = fs.readFileSync(pathname, 'utf8');
      console.log(read);
    }
  });
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const pinFileToIPFS = async (src, name) => {
  const pinataSDK = require('@pinata/sdk');
  const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA });

  try {
    const readableStreamForFile = fs.createReadStream(src);

    const result = await streamToString(readableStreamForFile);

    const options = {
      pinataMetadata: {
        name,
        keyvalues: {
          author:
            JSON.parse(result)?.author?.name || JSON.parse(result)?.from?.name,
          ...(JSON.parse(result)?.title && {
            title: JSON.parse(result)?.title,
          }),
        },
      },
      pinataOptions: { cidVersion: 0 },
    };

    const res = await pinata.pinJSONToIPFS(JSON.parse(result), options);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

async function main() {
  // pins articles
  const articles = [
    { src: './scripts/files/article1.json', name: 'Article 1' },
    { src: './scripts/files/article2.json', name: 'Article 2' },
    { src: './scripts/files/article3.json', name: 'Article 3' },
  ];

  const data1 = await pinFileToIPFS(articles[0].src, articles[0].name);
  const data2 = await pinFileToIPFS(articles[1].src, articles[1].name);
  const data3 = await pinFileToIPFS(articles[2].src, articles[2].name);
  const articleCids = [data1.IpfsHash, data2.IpfsHash, data3.IpfsHash];
  console.log('//', articleCids);
  await writeCIDsFile(articleCids.join(','), './scripts/files/cids.txt');

  console.log('\n\n');

  // pin messages
  const dataMsg1 = await pinFileToIPFS(
    './scripts/files/message1.json',
    'message1'
  );
  const dataMsg2 = await pinFileToIPFS(
    './scripts/files/message2.json',
    'message2'
  );
  const dataMsg3 = await pinFileToIPFS(
    './scripts/files/message3.json',
    'message3'
  );
  const msgCids = [dataMsg1.IpfsHash, dataMsg2.IpfsHash, dataMsg3.IpfsHash];
  console.log('//', msgCids);
  await writeCIDsFile(msgCids.join(','), './scripts/files/messageCids.txt');

  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//https://red-glamorous-bonobo-190.mypinata.cloud
