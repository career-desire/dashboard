
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Setup invisible reCAPTCHA
const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container", // container ID
      {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA solved:", response);
        },
      },
    );

    try {
      if (auth && auth.settings) {
        if (window.location.hostname === "localhost") {
          // Disable reCAPTCHA in localhost for testing
          auth.settings.appVerificationDisabledForTesting = true;
          console.log("Test mode: app verification disabled");
        } else {
          // Enable reCAPTCHA in production for security
          auth.settings.appVerificationDisabledForTesting = false;
          console.log("Production mode: reCAPTCHA enabled");
        }
      }
    } catch (err) {
      console.warn("Could not set appVerificationDisabledForTesting:", err);
    }
  }
};


const startResendTimer = () => {
  setResendTimer(30);
  setCanResend(false);
};

const sendOTP = async () => {
  const { name, email, password, mobile } = form;

  if (!name || !email || !password || !mobile) {
    setMessage("Please fill in all fields.");
    return;
  }

  if (!/^\d{10}$/.test(mobile)) {
    setMessage("Enter a valid 10-digit mobile number.");
    return;
  }

  if (password.length < 6) {
    setMessage("Password must be at least 6 characters.");
    return;
  }

  try {
    setLoading(true);
    setMessage("");
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = "+91" + mobile;

    const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    setConfirmationResult(result);
    setStep(2);
    setMessage("OTP sent successfully!");
    startResendTimer();
  } catch (error) {
    console.error(error);
    setMessage("Error sending OTP: " + error.message);
  } finally {
    setLoading(false);
  }
};

export const verifyOTPAndRegister = async (setLoading, setMessage, setMessage, setMessage, ) => {
  try {
    setLoading(true);
    setMessage("");

    const result = await confirmationResult.confirm(form.otp);
    const idToken = await result.user.getIdToken();
    const verifyMobile = form.mobile.startsWith("+91") ? form.mobile : `+91${form.mobile}`;

    const sanitizedData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      mobile: verifyMobile,
      idToken,
    };

    const response = await axios.post(
      `${SERVER_URL}/auth/register`,
      sanitizedData,
      { withCredentials: true }
    );

    setMessage("Registered successfully!");
    console.log("User:", response.data.user);
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    setMessage("Error verifying OTP or registering: " + errorMsg);
  } finally {
    setLoading(false);
  }
};

export const handleResendOTP = async (setResendTimer, setCanResend) => {
  if (canResend) {
    await sendOTP();
    setResendTimer(30);
    setCanResend(false);
  }
};