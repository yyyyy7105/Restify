import { createContext, useState } from "react";

export const FormContext = createContext({
  email: "",
  setEmail: () => {},
  emailError: "",
  setEmailError: () => {},
  phone: "",
  setPhone: () => {},
  phoneError: "",
  setPhoneError: () => {},
  firstName: "",
  setFirtName: () => {},
  lastName: "",
  setLastName: () => {},
  avatar: "",
  setAvatar: () => {},
  password1: "",
  setPassword1: () => {},
  password1Error: "",
  setPassword1Error: () => {},
  password2: "",
  setPassword2: () => {},
  password2Error: "",
  setPassword2Error: () => {},
  selfIntro: "",
  setSelfIntro: () => {},
});

export function useFormContext() {
  // TODO: replace hard code
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password1Error, setPassword1Error] = useState("");
  const [password2Error, setPassword2Error] = useState("");
  const [selfIntro, setSelfIntro] = useState("");

  return {
    email,
    setEmail,
    phone,
    setPhone,
    password1,
    setPassword1,
    password2,
    setPassword2,
    emailError,
    setEmailError,
    phoneError,
    setPhoneError,
    password1Error,
    setPassword1Error,
    password2Error,
    setPassword2Error,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    avatar,
    setAvatar,
    selfIntro,
    setSelfIntro,
  };
}
