import React from "react";
import { useParams } from "react-router-dom";

const MessagePage: React.FC = () => {
  const params = useParams<{ userId: string }>();
  
  return (
    <div>
      MessagePage
      <p>{params.userId}</p>
    </div>
  )
}

export default MessagePage
