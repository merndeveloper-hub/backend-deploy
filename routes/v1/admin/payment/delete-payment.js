const { findOne, deleteDocument } = require("../../../../helpers");

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const findPayment = await findOne("payment", {
      _id: id,
    });
    if (!findPayment) {
      return res.status(404).send({
        status: 404,
        message: "Payment not found",
      });
    }
    const deleteDoc = await deleteDocument("payment", {
      _id: id,
    });
    return res.status(200).send({
      status: 200,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = deletePayment;
