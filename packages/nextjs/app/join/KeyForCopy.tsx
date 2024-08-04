import React, { useState } from "react";
import { notification } from "~~/utils/scaffold-eth/notification";

const KeyForCopy = ({ text }: { text: string }) => {
  const shortenedText = `${text.slice(0, 20)}..${text.slice(-5)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    notification.success("Copy key to ClipBoard");
  };

  return (
    <div className="flex gap-3 cursor-pointer" onClick={copyToClipboard}>
      <p>{shortenedText}</p>
    </div>
  );
};

export default KeyForCopy;
