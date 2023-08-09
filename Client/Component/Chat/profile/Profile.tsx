import React, { useState } from 'react'
import styles from '@/components/Chat/profile/Profile.module.scss'
import Image from 'next/image'
import { Switch } from '@mui/material'

const Profile = (props:any) => {
  const [active,setActive] = useState<Boolean>(props.online)
  return (
    <div className={styles.profileCard} style={{ padding: props.privilege == 'admin' ? '15px' : '10px',gap: props.privilege == 'user' ? '20px' : '0px'}}>
      <img className={styles.logoImg} src={props.src} width={props.privilege == 'admin'? 60 : 45} height={props.privilege == 'admin'? 60 : 45}/>
      <div className={styles.profileHeaderCard}>
      
      <h1 className={styles.text} style={{
                fontSize: props.privilege == 'admin' ? '17px' : '14px',marginLeft: props.privilege == 'admin' ? '25px' : '0px'}}>{props.name}</h1>
      <div className={styles.switcher} style={{
                display: props.privilege == 'admin' ? 'flex' : 'none'}} >
        <button onClick={()=>{setActive(true)}} style={{
                backgroundColor: active ? '#4B8079' : 'white',width:'100%',color: active ? 'white' : '#303E65',borderRadius:'25px',fontWeight:'500',fontSize:'14px',cursor:'pointer',padding:'5px 15px'}}>On</button>
        <button onClick={()=>{setActive(false)}} 
        style={{
          backgroundColor: active ? 'white' : '#4B8079',color: active ? '#303E65' : 'white',width:'100%',borderRadius:'25px',fontWeight:'500',fontSize:'14px',cursor:'pointer',padding:'5px 15px'}}>Off</button>
        
      </div>
      </div>
      
    </div>
  )
}

export default Profile