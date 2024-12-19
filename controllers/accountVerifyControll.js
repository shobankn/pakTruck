
let { IndividualAccountVerify,ShopAccountVerify} = require('../services/accountVerifyService.js');

const VerifyIndividual = async (req, res) => {
  
  try {
    const result = await IndividualAccountVerify(req.body, req.files);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const VerifyShop = async (req, res) => {
  
  try {
    const result = await ShopAccountVerify(req.body, req.files);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = {VerifyIndividual,VerifyShop};