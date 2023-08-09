import React from 'react'
import styles from "@/styles/chat.module.scss";
import Image from 'next/image';
const File = () => {
  return (
      <div className={styles.fileContainer}>
      <div className={styles.addFileContainer}>
          
           <Image
                    src={"/img/addfiles.svg"}
                    width={90}
                    height={90}
                    ></Image>
    </div>
    </div>
  )
}

export default File