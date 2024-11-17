import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{ padding: "5px" }}>
          <strong>{msg.user}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
