import { useMemo } from "react";
import { PiUserCircle } from "react-icons/pi";

type AvatarProps = {
    userId?: string;
    name?: string;
    imageUrl?: string;
    width: number;
    height: number;
  }

const Avatar = ({ userId, name, imageUrl, width, height }: AvatarProps) => {
  let avatarName = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0]
    } else {
      avatarName = splitName[0][0]
    }
  }
  const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-gray-200',
    "bg-cyan-100",
    "bg-sky-200",
    "bg-blue-200"
  ]
  const randomNumber = useMemo(() => (Math.floor(Math.random() * 9)), []);

  return (
    <div className={`text-slate-800 shadow border overflow-hidden rounded-full font-bold relative`} style={{ width: width + "px", height: height + "px" }} >
      {
        imageUrl ? (
          <img
            src={imageUrl}
            width={width}
            height={height}
            alt={name}
            className=''
          />
        ) : (
          name ? (
            <div style={{ width: width + "px", height: height + "px" }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
              {avatarName}
            </div>
          ) : (
            <PiUserCircle
              size={width}
            />
          )
        )
      }
    </div>
  )
}

export default Avatar;
