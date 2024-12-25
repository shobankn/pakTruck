
const User = require('../models/usermodel.js');
let sharp = require('sharp');
let fs = require('fs');
let {AccountVerifySchema} = require('../validator/Uservalidator.js');

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


// Account Verification API for Both Account
// const AccountVerify = async (data, files) => {

//   const { fullname, email, phone, address } = data;

//   if ( !fullname || !email || !phone) {
//     throw new Error('Fullname, Email, and Phone are required fields.');
//   }

//     const existingUser = await User.findOne({ email });
//   if (!existingUser) {
//     throw new Error('User is not registered. Please register first!');

//   }
//    let accountMode = existingUser.accountMode;

//   if (!['individual', 'shop'].includes(accountMode)) {
//     throw new Error('Invalid account mode. Allowed values are "individual" or "shop".');
//   }

//   // Validate file uploads
//   const frontID = files?.frontID?.[0];
//   const backID = files?.backID?.[0];
//   const shopPicture = files?.shopPicture?.[0];

//   const isValidFile = (file) =>
//     file && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf');

//   // Validation for individual accounts
//   if (!frontID || !isValidFile(frontID)) {
//     throw new Error('Front ID is required for Individual Account and must be an image or PDF file.');
//   }
//   if (!backID || !isValidFile(backID)) {
//     throw new Error('Back ID is required for Individual Account and must be an image or PDF file.');
//   }

//   const frontIDPath = frontID.mimetype.startsWith('image/') 
//   ? await processImage(frontID.path) : frontID.path;
  
//   const backIDPath = backID.mimetype.startsWith('image/')
//    ? await processImage(backID.path) : backID.path;

//   // Validation for shop accounts
// let shopPicturePath = null;
//   if (accountMode === 'shop') {
//     if (!address) {
//       throw new Error('Address is required for Shop Account!');
//     }
//     if (!shopPicture || !isValidFile(shopPicture)) {
//       throw new Error('Shop Picture is required for Shop Account and must be an image or PDF file.');
//     }
  

//     shopPicturePath = shopPicture.mimetype.startsWith('image/')
//       ? await processImage(shopPicture.path)
//       : shopPicture.path;
//   }

//   // Create user
 
//     existingUser.fullname = fullname,
//    existingUser.email =  email,
//     existingUser.phone = phone,
//     existingUser.frontID = frontIDPath,
//     existingUser.backID = backIDPath,
//     existingUser.verificationStatus ='approved';
  

//   if (accountMode === 'shop') {
//     existingUser.address = address;
//     existingUser.shopPicture = shopPicturePath;
//   }

//   await existingUser.save();
//   return { message: 'Account verified successfully!', existingUser };
// };


// Account Verification for individual
const IndividualAccountVerify = async (data, files) => {
  const { fullname, email, phone } = data;

  if (!fullname || !email || !phone) {
    throw new Error('Fullname, Email, and Phone are required fields.');
  }

  let {error} = AccountVerifySchema.validate({phone});

  if(error) {
    throw new Error("Phone number must be exactly 11 digits!");
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error('User is not registered. Please register first!');
  }

  
  if (existingUser.accountMode !== 'individual') {
    throw new Error('Invalid account type: This action is only available for Individual accounts. Please switch to an Individual account!');

  }

  if(existingUser.verificationStatus === "approved") {
    throw new Error('your account is already verified');
  }


  const frontID = files?.frontID?.[0];
  const backID = files?.backID?.[0];

  const isValidFile = (file) =>
    file && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf');

  if (!frontID || !isValidFile(frontID)) {
    throw new Error('Front ID is required and must be an image or PDF file.');
  }
  if (!backID || !isValidFile(backID)) {
    throw new Error('Back ID is required and must be an image or PDF file.');
  }

  // Process file 
  const frontIDPath = frontID.mimetype.startsWith('image/')
    ? await processImage(frontID.path)
    : frontID.path;

  const backIDPath = backID.mimetype.startsWith('image/')
    ? await processImage(backID.path)
    : backID.path;


  existingUser.fullname = fullname;
  existingUser.email = email;
  existingUser.phone = phone;
  existingUser.frontID = frontIDPath;
  existingUser.backID = backIDPath;
  existingUser.verificationStatus = 'approved';

  await existingUser.save();

  return { message: 'Individual account verified successfully!', existingUser };
};


// Account Verification for shop
const ShopAccountVerify = async (data, files) => {
  const { shopName, email, phone, address } = data;

  if (!shopName || !email || !phone || !address) {
    throw new Error('shopName, Email, Phone, and Address are required fields for Shop accounts.');
  }
  let {error} = AccountVerifySchema.validate({phone});
  
  if(error) {
    throw new Error("Phone number must be exactly 11 digits!");
  }

  
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error('User is not registered. Please register first!');
  }


  if (existingUser.accountMode !== 'shop') {
    throw new Error('Invalid account type: This action is only available for Shop  accounts. Please switch to an shop account!');
  }

  // Validate file uploads
  const frontID = files?.frontID?.[0];
  const backID = files?.backID?.[0];
  const shopPicture = files?.shopPicture?.[0];
 

  const isValidFile = (file) =>
    file && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf');


  if (!frontID || !isValidFile(frontID)) {
    throw new Error('Front ID is required and must be an image or PDF file.');
  }
  if (!backID || !isValidFile(backID)) {
    throw new Error('Back ID is required and must be an image or PDF file.');
  }

  if (!shopPicture || !isValidFile(shopPicture)) {
    throw new Error('Shop Picture is required and must be an image or PDF file.');
  }
      // Process file 
      const frontIDPath = frontID.mimetype.startsWith('image/')
      ? await processImage(frontID.path)
      : frontID.path;

      const backIDPath = backID.mimetype.startsWith('image/')
          ? await processImage(backID.path)
          : backID.path;

      const shopPicturePath = shopPicture.mimetype.startsWith('image/')
          ? await processImage(shopPicture.path)
          : shopPicture.path;

    // update user
      existingUser.shopName = shopName;
      existingUser.email = email;
      existingUser.phone = phone;
      existingUser.address = address;
      existingUser.frontID = frontIDPath;
      existingUser.backID = backIDPath;
      existingUser.shopPicture = shopPicturePath;
      existingUser.verificationStatus = 'approved';

  await existingUser.save();

  return { message: 'Shop account verified successfully!', existingUser };
};


module.exports = { IndividualAccountVerify,ShopAccountVerify };




