import React, { useState, useEffect } from "react";
import styles from "@/styles/chat.module.scss";
import { TextField, InputAdornment, ListItem } from "@mui/material";
import Image from "next/image";
import Profile from "@/components/Chat/profile/Profile";
import FirstTime from "@/components/Chat/firstTime";
import Message from "@/components/Chat/mesages/Message";
import ContactInfo from "@/components/Chat/contact/ContactInfo";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import fetchInstance from "@/utils/fetchInstance";
import loader from '@/public/img/loader.gif'
import { INTERNAL_SERVER_ERROR, OK } from "constants/httpCode";
const { NEXT_PUBLIC_S3_LINK } = process.env;
import { getCookies } from "@/utils/cookieHelper";
import App from "../chat"
import NavbarChat from "@/components/Chat/navbarChat/NavbarChat";
import { getUserChats, getProByClient } from "services/chatService";

interface userChat {
    id:string;
    name: string;
    img: string;
    messages: [];
  }

const chatClient = ({
    user
  }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [hasMsg, setMsg] = useState<Boolean>(true);
  const [userData, setUserData] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [chatList, setChatList] = useState<any>([]);
  const [userId, setUserId] = useState<String>(getCookies().id);
  const [active,setActive] = useState<Boolean>(true);
  const [data,setData] = useState<Boolean>(false);
  const [triged, setTrigger] = useState(true);
  const [chatRoomId, setChatRoomId] = useState<String>('');
  const [current, setCurrent] = useState({
    id: '',
    name: '',
    img:''
  });
    
    useEffect(() => {
        setUserData(user.user_data);
      }, [user]);
   

   const fetchPros = async (id: any) => {
    const pros = await getProByClient(id);
    if (pros) {
      setUserList(pros.data);
      return pros.data;
    }
  };
  const UserChats = async (userId, userList) => {
    const chats = await getUserChats(userId);
    if (chats) {
      if(chats.data.length > 0){
      setMsg(true);
      setChatList([]);
      let sortedData = [...chats.data].sort((a:any, b:any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      sortedData.forEach((item) => {
        let detailUser = userList.filter(person => (person.proId === item.from) || (person.proId === item.to));
        
        if (detailUser.length > 0){
          setCurrent({
            id: detailUser[0].proId,
            name: detailUser[0].companyName,
            img: detailUser[0].companyLogo
          });
       setChatRoomId(item._id)
        let chat:userChat = {
          id: detailUser[0].proId,
          name: detailUser[0].companyName,
          img: detailUser[0].companyLogo,
          messages: item.messages
        };
        setChatList(prev => [chat,...prev]);
      }
      });
    }else{
      setMsg(false)
    }
  }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userList = await fetchPros(userId);
      if (userList) {
        UserChats(userId, userList);
      }
    };
    fetchData();
  }, [data]);
  const handleClick = (itemId:any,itemName:any,itemImg:any) => {
    setCurrent({
      id: itemId,
      name:itemName,
      img: itemImg
    });
  };

  const handleSelected = () =>{
    setMsg(!hasMsg)
  }
  console.log('current',current);
  return (
    <div className={styles.chatCont} style={{justifyContent: hasMsg == false ?'left':'space-between'}}>
        {/* Left side container */}
      {userData && (
        <div className={styles.leftCont}>
          <Profile
            src={
              userData.profileImage
                ? `${NEXT_PUBLIC_S3_LINK}${
                    userData.profileImage
                  }?${new Date().toISOString()}`
                : "/img/user.png"
            }
            name={userData.firstName +' '+ userData.lastName}
            privilege={"admin"}
            online={triged}
          />

          <div className={styles.usersCont}>
          {userList &&
                !hasMsg &&
            <div style={{ margin: "0px 30px 15px 30px" }}>
              <TextField
                // onChange={filterBySearch}
                style={{ height: "50px ", padding: " 10px " }}
                placeholder={"Rechercher"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <div style={{ padding: " 10px " }}>
                        <Image
                          src={"/img/search.svg"}
                          width={30}
                          height={30}
                        ></Image>
                      </div>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
}
            <div style={{ margin: "5px 20px",paddingTop:'10px' }}>
              {userList &&
                !hasMsg &&
                userList.map((item) => (
                  <div 
                  onClick={()=>{
                    handleClick(item.proId,item.companyName,item.companyLogo);setMsg(true)
                  }}
                   style={{cursor:'pointer'}}>
                    <Profile
                    src={
                      item?.companyLogo
                        ? NEXT_PUBLIC_S3_LINK +
                          item.companyLogo
                        : "/img/user.png"
                    }
                    name={
                      item?.companyName
                    }
                    privilege={"user"}
                  />
                  </div>
                ))}
                
                {userList &&
                hasMsg &&
                chatList.map((item) => (
                  <div key={item.id}
                  onClick={() => handleClick(item.id,item.name,item.img)}
                  style={{cursor:'pointer'}}>
                  <Message
                    src={
                      item.img
                        ? NEXT_PUBLIC_S3_LINK +
                          item.img
                        : "/img/user.png"
                    }
                    name={
                      item.name
                    }
                    time={item.messages[item.messages.length-1].time.slice(11, 16)}
                    msg={item.messages[item.messages.length-1].content}
                    active={current.id == item.id ? active : !active}
                  />
                  </div>
                ))}
                
            </div>
            
          </div>
          <div className={styles.chatBar} style={{  alignItems:'end',marginBottom:'0'}}>
              <NavbarChat selected={handleSelected}/>
            </div>
        </div>
      )}

      {/* Chat container */}
      {!hasMsg && (<FirstTime />)}
      {hasMsg && (
          <div className={styles.channelCont}>
            <App onDataUpdate={()=>{setData(!data)}} user={current}/>
          </div>
      
      )}
        
      {/* Contact info container */}
      {hasMsg && (
        <div className={styles.rightCont}>
          <ContactInfo
          room={chatRoomId}
          name={current.name} 
          img={current.img
            ? NEXT_PUBLIC_S3_LINK +
            current.img
            : "/img/user.png"} 
            onDataUpdate={()=>{setData(!data)}}
           />
        </div>
      )}
    </div>
  )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { cookies } = context.req

    let { response: resNew, data: dataNew } = await fetchInstance(`/auth/fetchUserByToken`, {}, cookies, context.res)

    if (resNew.status === OK) {
        return { props: {  user: dataNew.data } }
    }

    return {
        props: {
            err: INTERNAL_SERVER_ERROR,
            subscription: null
        }
    }
  };
export default chatClient