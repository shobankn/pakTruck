
const User = require('../models/usermodel.js');
let sharp = require('sharp');
let fs = require('fs');

// Function to process images with Sharp
let  processImage = async (filePath) => {
  const enhancedPath = filePath.replace(/(\.[a-z]+)$/, '-enhanced$1');

  await sharp(filePath)
    .resize(800, 800, { fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(enhancedPath);

  try {
    await fs.unlinkSync(filePath); 
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err) {
    console.error(`Failed to delete file: ${filePath}`, err);
  }

  return enhancedPath;
}

// Account Verification 
const AccountVerify = async (data, files) => {

  const {accountMode,fullname, email, phone, address } = data;

  if (!accountMode ||!fullname || !email || !phone ) {
    throw new Error('Account Mode Fullname, email, phone, and address are required fields.');
  }

  if (!['individual', 'shop'].includes(accountMode)) {
    throw new Error('Invalid account mode. Allowed values are "individual" or "shop".');
  }

  const { frontID, backID, shopPicture } = files;

  if (!frontID || !backID ) {
  
    throw new Error('Front ID, Back ID or files are required.');
  }

  // Process images using Sharp
    const frontIDPath =
    frontID[0].mimetype.startsWith('image/') ? 
    await processImage(frontID[0].path) : frontID[0].path;

    const backIDPath =
    backID[0].mimetype.startsWith('image/') ? 
    await processImage(backID[0].path) : backID[0].path;

    // For Shop Account
  let shopPicturePath;
   
  if(accountMode === 'shop') {

  if (!address) {
    throw new Error(" Address is required for Shop Account!")
  }

  if(!shopPicture) {
    throw new Error(" Shop Picture is required for Shop Account!")
  }
  }
   shopPicturePath =  shopPicture[0].mimetype.startsWith('image/') ?
    await processImage(shopPicture[0].path) : shopPicture[0].path;


  let user = new User({
    fullname,
    email,
    phone,
    frontID: frontIDPath,
    backID: backIDPath,
    verificationStatus:"approved"
  });

  if(accountMode === 'shop') {
    user.address = address,
    user.shopPicture = shopPicturePath
  }

  await user.save();
  return { message: 'Account verified successfully!', user };
};

module.exports = {AccountVerify};
