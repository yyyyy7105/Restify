import { createContext, useState } from "react";

export const ProfileContext = createContext({
  firstName: "",
  setFirstName: () => {},
  lastName: "",
  setLastName: () => {},
  email: "",
  setEmail: () => {},
  phone: "",
  setPhone: () => {},
  selfIntro: "",
  setSelfIntro: () => {},
  rating: "",
  setRating: () => {},
  ratingNum: "",
  setRatingNum: () => {},
  avatar: "",
  setAvatar: () => {},
});

export function useProfileContext() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [rating, setRating] = useState("");
  const [ratingNum, setRatingNum] = useState("");
  const [avatar, setAvatar] = useState();

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    selfIntro,
    setSelfIntro,
    rating,
    setRating,
    ratingNum,
    setRatingNum,
    avatar,
    setAvatar,
  };
}
