import React, { useState }  from 'react'
import styles from '@/components/Chat/profile/Profile.module.scss'

const Message = (props:any) => {
    
    
  return (
    
  
    <div className={styles.miniChat} style={{
        backgroundColor: props.active ? '#4B8079' : '#F2F7FF',padding:'15px'}}>
      <img className={styles.logoImg} src={props.src} width={45} height={45} style={{ marginLeft: '0px'}}/>
      <div className={styles.MsgCont}>
      
      <h1 className={styles.text} style={{ color: props.active ? 'white' : '#303E65',marginLeft: '0px'}}>{props.name}</h1>
      <p className={styles.text} style={{ marginLeft: '0px', fontSize:'13px',color: props.active ? '#bac8d4' : '#8e98a0',}}>{props.msg}</p>
      </div>
      <div className={styles.msgTime}>{props.time}</div>
    </div>
 
  )
}

export default Message