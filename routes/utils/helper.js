// Generate a 6-digit OTP
function generateOTP() {
    // Declare a variable to store the OTP
    var otp = "";

    // Loop 6 times to generate each digit
    for (var i = 0; i < 6; i++) {
        // Generate a random number between 0 and 9
        var digit = Math.floor(Math.random() * 10);

        // Append the digit to the OTP string
        otp += digit;
    }

    // Return the OTP
    return otp;
}
module.exports = {
    generateOTP
}