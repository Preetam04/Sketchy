import React, { useRef, useState } from "react";

const ChatBox = () => {
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<string[]>([]);

  return (
    <div className="bg-white ring w-80  rounded h-11/12 relative overflow-clip">
      {/* text-box */}
      <div className="pt-2 pb-14 overflow-y-scroll h-full ">
        {allMessages.map((ele, key) => (
          <div
            key={key}
            className="text-base leading-4 border-b-gray-400/60 border-b pb-2 px-2"
          >
            <span className="text-xs text-gray-500">user {key}</span>
            <br />
            {ele}
          </div>
        ))}
      </div>

      {/* input box */}
      <div className="bg-gray-300 absolute bottom-0 left-0  w-full py-2 flex justify-around ">
        <input
          type="text"
          className="bg-white rounded px-1"
          placeholder="Write message"
          value={message}
          onChange={(e) => {
            e.preventDefault();
            setMessage(e.target.value);
          }}
        />
        <button
          className="text-white bg-blue-600 py-1 px-2 rounded cursor-pointer"
          onClick={() => {
            if (message === "") return;
            setAllMessages((ele) => [...ele, message]);
            setMessage("");
          }}
        >
          send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
