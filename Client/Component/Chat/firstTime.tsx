import React from 'react'
import Image from 'next/image'
import chat from '@/public/img/chatting.svg'
import BaseButton from '../BaseButton'
import styles from '@/styles/chat.module.scss';


const FirstTime = () => {
    return (
      <>
            <div  className={styles.firstTimeContainer}>
            <Image
            src={chat}
            width={359}
            height={231.93}></Image>

                        <BaseButton
                            
                            type="submit" text={"Commencer une discussion"} width='100%' variant="contained" disabled={false} />
        </div >
      </>
  )
}

export default FirstTime