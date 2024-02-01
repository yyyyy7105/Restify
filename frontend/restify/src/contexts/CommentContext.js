import { createContext, useState } from "react";

export const CommentContext = createContext({
  defaultAvatar:
    "https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67",
  setDefaultAvatar: () => {},
  userid: "",
  targetId: "",
  setTargetId: () => {},
  isUser: false,
  setIsUser: () => {},
});

export function useCommentContext(props) {
  const [defaultAvatar, setDefaultAvatar] = useState(
    "https://camo.githubusercontent.com/eb6a385e0a1f0f787d72c0b0e0275bc4516a261b96a749f1cd1aa4cb8736daba/68747470733a2f2f612e736c61636b2d656467652e636f6d2f64663130642f696d672f617661746172732f6176615f303032322d3531322e706e67"
  );

  const [targetId, setTargetId] = useState(props.targetId);

  const [isUser, setIsUser] = useState(props.isUser);

  return {
    defaultAvatar,
    setDefaultAvatar,
    userid: localStorage.getItem("userid"),
    targetId,
    setTargetId,
    isUser,
    setIsUser,
  };
}
