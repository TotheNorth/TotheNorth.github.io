import React  from "react";

const Video: React.FC<{
  url: string;
}> = ({ url, ...props }) => {
  return <video autoPlay controls src={url} {...props}></video>;
};

export default Video;
