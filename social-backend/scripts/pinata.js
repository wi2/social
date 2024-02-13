const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv/config');

const JWT = process.env.PINATA;

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

/* const pinFileToIPFS = async (src, name) => {
  const formData = new FormData();
  //  const src = 'path/to/file.png';

  const file = fs.createReadStream(src);
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({ name: name || 'File name' });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 0 });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    //    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
 */
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

  // const res = await pinata.testAuthentication();
  // console.log(res);

  try {
    const readableStreamForFile = fs.createReadStream(src);

    const result = await streamToString(readableStreamForFile);
    console.log(JSON.parse(result)?.author.name);

    const options = {
      pinataMetadata: {
        name,
        keyvalues: {
          author: JSON.parse(result)?.author.name,
          title: JSON.parse(result)?.title,
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
  // add articles
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

  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//https://red-glamorous-bonobo-190.mypinata.cloud
