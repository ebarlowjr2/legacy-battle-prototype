export const authStrings = {
  comingSoon: {
    alertTitle: 'Coming Soon',
    loginMessage: (providerName: string) =>
      `${providerName} login will be available in a future update.`,
    signUpMessage: (providerName: string) =>
      `${providerName} sign up will be available in a future update.`,
  },
  alerts: {
    actionConfirmOk: 'OK',
  },
} as const;

export const loginScreenStrings = {
  backgroundPattern: {
    watermarkText: 'LB',
  },
  authHeader: {
    titleLeadingWord: 'Legacy',
    titleAccentWord: 'Battle',
    subtitleTagline: 'Create Battle And Win Challenges',
  },
  social: {
    continueWithApple: 'Continue With Apple',
    continueWithFacebook: 'Continue With Facebook',
    continueWithGoogle: 'Continue With Google',
    continueWithEmail: 'Continue With Email',
  },
  primaryCta: {
    createAccount: 'Create Account',
  },
  emailLoginScreen: {
    title: 'Login legend',
    subtitle: 'login to your account',
  },
  emailLoginForm: {
    emailPlaceholder: 'Email',
    passwordPlaceholder: 'Password',
    forgotPassword: 'Forgot password?',
    forgotPasswordComingSoon: 'Password reset will be available in a future update.',
    enableBiometrics: 'Enable biometrics',
    biometricsPrompt: 'Confirm to enable biometric login',
    biometricsUnavailable: 'Biometrics are not available on this device.',
    biometricsNotEnrolled: 'Set up Face ID or Touch ID in your device settings first.',
    biometricsEnrollCancelledToast:
      'Biometrics setup was cancelled, you can enable it in Settings',
    submitLogIn: 'Log In',
    /** Shown before the Sign Up link on email login (includes trailing space). */
    footerLeadNoAccount: "Don't have an account? ",
    navigateToSignUp: 'Sign Up',
  },
  alerts: {
    missingCredentialsTitle: 'Missing Info',
    missingCredentialsMessage: 'Please enter email and password',
    loginFailedTitle: 'Login Failed',
  },
  loginWithBiometricsScreen: {
    title: 'Welcome back',
    subtitle: 'Sign in with biometrics or your password',
    displayEmailLabel: 'Account',
    passwordPlaceholder: 'Password',
    loginWithBiometrics: 'Log in with biometrics',
    usePasswordInstead: 'Use password instead',
    submitLogIn: 'Log in with password',
    biometricSignInFailed: 'Could not sign in with biometrics. Try your password.',
  },
} as const;

export const signUpScreenStrings = {
  authHeader: {
    welcomeTitle: 'Welcome, Legend-In-The-Making!',
    createAccountSubtitle: 'Create An Account To Start Battling',
  },
  form: {
    emailLabel: 'Email Address',
    emailPlaceholder: 'Enter Email',
    passwordLabel: 'Enter Password',
    passwordPlaceholder: 'Enter Password',
    confirmPasswordLabel: 'Confirm Password',
  },
  legal: {
    termsLeadIn: 'By Continuing You Agree To Our',
    termsWord: 'Terms',
    termsConnector: 'And',
    conditionsWord: 'Conditions',
  },
  primaryCta: {
    signUp: 'Sign Up',
  },
  divider: {
    or: 'Or',
  },
  social: {
    continueWithGoogle: 'Continue With Google',
  },
  footer: {
    hasAccountPrompt: 'Already have an account?',
    logInCta: 'Log in',
  },
  alerts: {
    missingFieldsTitle: 'Missing Info',
    missingFieldsMessage: 'Please fill in all fields',
    passwordMismatchTitle: 'Password Mismatch',
    passwordMismatchMessage: 'Passwords do not match',
    weakPasswordTitle: 'Weak Password',
    weakPasswordMessage: 'Password must be at least 6 characters',
    signUpFailedTitle: 'Sign Up Failed',
    accountCreatedTitle: 'Account Created',
    accountCreatedMessage:
      'Please check your email to confirm your account, then log in.',
  },
} as const;

export const createUsernameScreenStrings = {
  authHeader: {
    screenTitle: 'Create A Username',
    screenSubtitle: 'Enter A Username To Start Your Legacy',
  },
  form: {
    usernameLabel: 'Enter Username',
    usernamePlaceholder: 'Enter Username',
    availabilitySuccess: 'Username Is Available',
  },
  primaryCta: {
    startBattle: 'Start Battle',
    decorativeSwordEmoji: '⚔',
  },
  successToast: 'Your username was saved successfully.',
} as const;

export const otpVerificationScreenStrings = {
  headings: {
    verifyEmail: 'Verify Email',
  },
  body: {
    codeSentLeadIn: 'We Sent A Verification Code To Your Email',
    mockRecipientEmail: 'Mike.Design@mail.com',
  },
  resend: {
    prompt: "Didn't receive the email?",
    /** Shown while countdown is active; timer (MM:SS) is rendered next to this. */
    availableIn: 'Resend available in',
    cta: 'Resend code',
    successToast: 'A new code has been sent',
  },
  primaryCta: {
    verifyEmail: 'Verify Email',
  },
} as const;

export const forgotPasswordFlowStrings = {
  forgotPassword: {
    title: 'Reset password',
    subtitle: 'Enter your email and we’ll send a verification code.',
    emailPlaceholder: 'Email',
    submitCta: 'Proceed to Reset',
  },
  verifyResetOtp: {
    title: 'Verify code',
    codeSentLeadIn: 'We sent a code to',
    resendPrompt: 'Didn’t receive a code?',
    resendAvailableIn: 'Resend available in',
    resendCta: 'Resend OTP',
    resendSuccessToast: 'A new code has been sent',
    verifyCta: 'Verify',
  },
  resetPassword: {
    title: 'New password',
    subtitle: 'Choose a strong password for your account.',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm password',
    passwordPlaceholder: 'Password',
    submitCta: 'Update password',
  },
} as const;
