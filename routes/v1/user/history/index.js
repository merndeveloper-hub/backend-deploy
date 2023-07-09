const expres = require("express");
const getNftHistory = require("./get-nft-history");

const router = expres.Router();

router.get("/:id", getNftHistory);

module.exports = router;
