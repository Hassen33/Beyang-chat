import React from 'react'
import Image from 'next/image'
import styles from './contact.module.scss'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { getCookies } from "@/utils/cookieHelper";
import { deleteChatRoom } from "services/chatService";

const ContactInfo = (props:any) => {
  const role = getCookies().role;
  console.log('idddd',props.room);

  const deleteChat = async (id:any) => {
    const deleted = await deleteChatRoom(id)
    if (deleted){
      props.onDataUpdate(true);
    }
  }
  return (
    <div className={styles.contactBox}>
        <h1 className={styles.title}>Informations personnelle</h1>
        <img src={props.img} className={styles.contactImg}/>
        <p className={styles.title} style={{color:'#4D817D'}}>{props.name}</p>
        { role == 'PRO' &&
        <p className={styles.title}  style={{fontWeight:'500',fontSize:'15px'}}>Client chez Beyang </p>
        }
        { role == 'CLIENT' &&
        <p className={styles.title}  style={{fontWeight:'500',fontSize:'15px'}}>Professionnel chez Beyang </p>
        }
        <button className={styles.dispoBtn}>Disponible</button>
        <div style={{display:'flex',marginTop:'35px',gap:'15px',borderTop:'2px solid #303E65',padding:'15px 0'}}>
           <PeopleAltOutlinedIcon style={{color:'#303E65',fontSize:'30px'}}/>
           <p className={styles.title}  style={{fontWeight:'500',fontSize:'16px',display:'flex',alignItems:'end'}}>Créer un groupe avec {props.name.slice(0,props.name.indexOf(" "))}</p>
        </div>
        <Stack direction="row" spacing={2} style={{ width:'100%',display:'flex',justifyContent:'center'}}>
      <Button onClick={()=>{deleteChat(props.room);}} style={{ width:'90%',fontSize:'15px'}} variant="outlined" startIcon={<DeleteOutlineOutlinedIcon style={{fontSize:'30px'}}/>}>
        Supprimer la conversation
      </Button>
    </Stack>
    </div>
  )
}

export default ContactInfo