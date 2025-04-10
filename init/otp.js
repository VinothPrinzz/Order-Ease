const otpGenerator = require('otp-generator');

const generateOtp = () => {
    const OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    return OTP;
}

module.exports = generateOtp;
