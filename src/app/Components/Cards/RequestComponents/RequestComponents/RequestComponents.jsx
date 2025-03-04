"use client";
import Box from "@mui/material/Box";
import "./request.css";
import { Button, Typography } from "@mui/material";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Avatar from "@mui/material/Avatar";
import SingleRequest from "../SingleRequest/SingleRequest";
import {
  getDatabase,
  ref,
  onValue,
  update,
  set,
  push,
} from "firebase/database";
import firebaseConfig from "@/app/Config/firebaseConfig/firebaseConfig";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const RequestComponents = ({ requName, isBtn }) => {
  const loggedInUserData = useSelector(state => state.user.value);
  const [fdRequest, setfdRequest] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const starCountRef = ref(db, "/fdRequInfo");
    const starCountRefFd = ref(db, "/friends");
    const fdArr = [];
    onValue(starCountRefFd, snapShot => {
      snapShot.forEach(item => {
        console.log(item.val());
        fdArr.push({ ...item.val(), id: item.key });
      });
    });

    let arr = [];
    onValue(starCountRef, snapShot => {
      if (fdArr.length > 0) {
        fdArr.map((friends, index) => {
          snapShot.forEach(item => {
            if (
              item.val().senderUid !== loggedInUserData?.uid &&
              item.val().reciverUid !== friends.reciverUid
            ) {
              arr.push({ ...item.val(), id: item.key });
            }
          });
          setfdRequest(arr);
        });
      } else {
        snapShot.forEach(item => {
          console.log(item.val());
          if (item.val().senderUid !== loggedInUserData?.uid) {
            arr.push({ ...item.val(), id: item.key });
          }
        });
        setfdRequest(arr);
      }
    });
  }, []);

  console.log(fdRequest);

  const handleAccept = request => {
    console.log(request);
    const db = getDatabase();
    set(push(ref(db, "friends")), {
      senderName: request.senderName,
      senderEmail: request.senderEmail,
      senderPhotoUrl: request.senderPhotoUrl,
      senderUid: request.senderUid,
      reciverName: request.reciverName,
      reciverEmail: request.reciverEmail,
      reciverPhotoUrl: request.reciverPhotoUrl,
      reciverUid: request.reciverUid,
    });
    console.log(request);
  };

  return (
    <div
      className={requName === "group request" ? "request-box" : "fd_request"}
    >
      <Box>
        <div className="heading-wrapper">
          <Typography variant="p" component="p">
            {requName}
          </Typography>
          <HiOutlineDotsVertical className="dot" />
        </div>
        <div className="master_wrapper">
          {fdRequest.map((user, index) => (
            <SingleRequest
              key={index}
              src={user.senderPhotoUrl}
              heading={user.senderName}
              subHeading={"dummy"}
              isBtn={isBtn}
              onClick={() => handleAccept(user)}
            />
          ))}
        </div>
      </Box>
    </div>
  );
};

export default RequestComponents;
