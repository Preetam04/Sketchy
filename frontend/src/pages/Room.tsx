import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WordContainer from "../components/WordContainer/WordContainer";
import UserContainer from "../components/UserContainer/UserContainer";
import ChatBox from "../components/Chatbox/ChatBox";
import Canvas from "../components/Canvas/Canvas";
const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  //   if room Id not present navigate to home
  useEffect(() => {
    if (!roomId) {
      navigate("/");
    }
  }, [navigate, roomId]);

  return (
    <div className="space-y-2 w-full h-full">
      {/* word container */}
      <WordContainer />
      <div className="w-full h-full flex justify-around space-x-2">
        {/* user continers */}
        <UserContainer />

        {/* canvas */}
        <Canvas />

        {/* chatbox */}
        <ChatBox />
      </div>
    </div>
  );
};

export default Room;
