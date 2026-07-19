const crypto = require('crypto');
const Certificate = require('../models/Certificate');
const Purchase = require('../models/Purchase');
const Course = require('../models/Course');

const checkAndGenerateCertificate = async (userId, courseId) => {
  // Find completed purchase
  const purchase = await Purchase.findOne({ userId, courseId, paymentStatus: 'completed' });
  if (!purchase) {
    throw new Error('No active purchase found for this course.');
  }

  // Double check if already generated
  if (purchase.certificateIssued && purchase.certificateId) {
    const existingCert = await Certificate.findById(purchase.certificateId);
    if (existingCert) return existingCert;
  }

  // Ensure completion percentage is 100
  if (purchase.completionPercentage < 100) {
    throw new Error('Course completion must be 100% to generate certificate.');
  }

  // Generate unique certificate verification code
  const certHash = crypto.randomBytes(8).toString('hex').toUpperCase();
  const certificateCode = `DV-${courseId.toString().slice(-4).toUpperCase()}-${certHash}`;

  // Formulate a link to verify the certificate on the frontend
  const downloadUrl = `/api/certificates/verify/${certificateCode}`;

  const certificate = await Certificate.create({
    userId,
    courseId,
    certificateCode,
    downloadUrl,
    completionDate: new Date()
  });

  // Link to purchase
  purchase.certificateIssued = true;
  purchase.certificateId = certificate._id;
  await purchase.save();

  return certificate;
};

module.exports = {
  checkAndGenerateCertificate
};
