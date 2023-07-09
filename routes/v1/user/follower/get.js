

const checked = async (req,res) => {
  try {
    console.log("hello world");
    res.send("hey")

  } catch (error) {
    console.log(error);
  }
}


module.exports = checked