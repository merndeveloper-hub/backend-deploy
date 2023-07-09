const xrpl = require("xrpl");
const { dev_net_xrpl } = require("../../../config");
// const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

const getBalance = async (req, res) => {
  try {
    const client = new xrpl.Client(dev_net_xrpl);
    await client.connect();
    // const response = await client.request({
    // 	command: "account_info",
    // 	account: req.params.account,
    // 	ledger_index: "validated"C
    // });
    const response = await client.getXrpBalance(req.params.account);
    console.log(response);
    await client.disconnect();
    return res.status(200).send({ status: 200, response });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ status: 400, message: e.message });
  }
};
module.exports = getBalance;
