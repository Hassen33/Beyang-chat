import React from 'react'
import { TextField, InputAdornment } from '@mui/material'
import Image from 'next/image'
import styles from '@/styles/chat.module.scss';
const MsgInput = () => {
  return (
    <>
      <div style={{ margin: "0px ", display: 'flex' }} >
      <div style={{ margin: "0px 5px", display: 'flex' }} >
        
      <Image
                    src={"/img/settings.svg"}
                    width={5}
                    height={5}
                    ></Image>
        </div>
      <div style={{ margin: "0px 5px", display: 'flex' }} >
      <Image
                    src={"/img/attachment.svg"}
                    width={15}
                    height={15}
                    ></Image>
          </div>
        <TextField
          // onChange={filterBySearch}
          className={styles.msgInput}
          placeholder={"Aa"}
          InputProps={{
            endAdornment: [
              
              <InputAdornment position="end">
                <button className={styles.sendButton}>
                  <Image
                    src={"/img/send.svg"}
                    width={50}
                    height={30}
                    ></Image>
                </button>
              </InputAdornment>,
              

                  ]
          }}
                  
     
                  
                
              />
            </div>
    </>
  )
}

export default MsgInput