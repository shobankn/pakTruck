
let { AccountVerify} = require('../services/accountVerifyService.js');

const VerifyIdentity = async (req, res) => {
  
  try {
    const result = await AccountVerify(req.body, req.files);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {VerifyIdentity};