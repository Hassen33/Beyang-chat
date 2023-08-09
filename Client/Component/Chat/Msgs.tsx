import React from "react";
import styles from "@/styles/chat.module.scss";
import { getCookies } from "@/utils/cookieHelper";

const Msg = (props) => {
  const senderId = getCookies().id;
  return (
    <div className={props.sender === senderId ? styles.rightContainer : styles.leftContainer}>
      <div className={styles.msgContainer}>
        <div className={props.sender === senderId ? styles.msgContentRightContainer : styles.msgContentLeftContainer}>
          <p className={styles.text}>
            {props.msgContent}
          </p>
          <span className={styles.date}>{props.date}</span>
        </div>
      </div>
    </div>
  );
};

export default Msg;
