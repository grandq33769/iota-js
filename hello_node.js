const IOTA = require('iota.lib.js');
// Create IOTA instance directly with provider
const iota = new IOTA({
    'provider': 'http://140.116.247.123:14267'
});

iota.api.getNodeInfo((error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log(success)
  }
});

// you can also get the version
console.log(iota.version);

const seed =
  'TLDGGHH9YZXFELBCKAECRMLHMEZXDXVCEXYEKAMIMQ99XDIOVAZTYUPAYALYGHHIOPYZGUIWTE9ZVYITK';
const message = iota.utils.toTrytes('Hello World!');
const message2 = iota.utils.toTrytes('Hello NetDB!');

const options = {
    'index': 0,
    'total': 1,
    'security': 2,
    'returnAll': false
};

let addressPromise = (seed, options) => {
    return new Promise((resolve, reject) => {
        iota.api.getNewAddress(seed, options, (e, s)=>{
            if(e){
                reject(e)
            } else {
                console.log('address: '+s);
                resolve(s);
            }
        });
    });
};

let preparePromise = (seed, address) => {
    const transfersArray = [{
        'address': address,
        'value': 0,
        'message': message2,
        'tag': 'NETDB9IOTA9NODE'.padEnd(27, '9')
    }];
   return new Promise((resolve, reject) => {
       iota.api.prepareTransfers(seed, transfersArray, (e, s) => {
           if(e){
               reject(e);
           } else {
               console.log('Success !!\n'+s);
               resolve(s);
           }
       });
   });
};

let cb = (e, s) => {
    if(e){
        console.log(e);
    } else {
        console.log(s);
    }
}

exec = async() => {
    let addresses = await addressPromise(seed, options);
    let content = await preparePromise(seed, addresses[0]);
    // 15 minDepth; 14 mwm
    iota.api.sendTrytes(content, 15, 14, cb);
}

exec().catch((e) => {
    console.log(e)
});

// iota.api.prepareTransfers(seed, transfersArray, cb) 
