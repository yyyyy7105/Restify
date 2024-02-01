export const validateSignup = (
  email,
  setEmailError,
  password,
  setPasswordError,
  password2,
  setPassword2Error,
  phone,
  setPhoneError
) => {
  var validated = validateEmail(email, setEmailError);
  validated = validated && validatePhone(phone, setPhoneError);
  validated = validated && validatePassword(password, setPasswordError);
  validated =
    validated && validatePassword2(password, password2, setPassword2Error);
  return validated;
};

export const validateUpdate = (
  email,
  setEmailError,
  password1,
  setPassword1Error,
  password2,
  setPassword2Error,
  phone,
  setPhoneError
) => {
  var validated = validateEmail(email, setEmailError);
  validated = validated && validatePhone(phone, setPhoneError);
  if (password1) {
    validated = validated && validatePassword1(password1, setPassword1Error);
    validated =
      validated && validatePassword2(password1, password2, setPassword2Error);
  }
  return validated;
};

export const validateEmail = (email, setError) => {
  const regex =
    /^(?!.*\.{2})[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!regex.test(email)) {
    setError("Please enter valid email");
    return false;
  } else {
    setError("");
  }
  return true;
};

export const validatePassword = (password, setError) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/;
  if (!password) {
    setError("Password can not be empty");
    return false;
  } else if (!regex.test(password)) {
    setError("Password not valid");
  } else {
    setError("");
  }
  return true;
};

export const validatePassword1 = (password, setError) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*]).{8,}$/;
  if (password) {
    if (!regex.test(password)) {
      setError("Password not valid");
    } else {
      setError("");
    }
  } else {
    setError("");
  }
  return true;
};

export const validatePassword2 = (password1, password2, setError) => {
  if (!(password1 === password2)) {
    setError("Password does not match");
    return false;
  } else {
    setError("");
  }
  return true;
};

export const validatePhone = (phone, setError) => {
  const regex = /^\d{3}-\d{3}-\d{4}$/;
  if (!regex.test(phone)) {
    setError("Phone should be like 000-000-0000");
    return false;
  } else {
    setError("");
  }
  return true;
};
