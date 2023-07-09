const { XummSdk } = require("xumm-sdk");
// const { XUM_KEY, XUM_SECRET, dev_net_xrpl } = require("../../../config");
// const Sdk = new XummSdk(XUM_KEY, XUM_SECRET);
const xrpl = require("xrpl");

const createWallet = async (req, res) => {
  try {
    // const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    // // const client = new xrpl.Client("wss://xrplcluster.com/");
    // // const client = new xrpl.Client("ws://localhost:5000");
    // await client.connect();
    // // const fund_result = await client.fundWallet()
    // // const test_wallet = fund_result.wallet()
    // const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    // await client.connect()
    const wlalet = xrpl.Wallet.generate();
    // await client.disconnect();
    return res.status(200).send({ status: 200, message: wlalet });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = createWallet;
