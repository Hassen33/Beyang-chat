import React, { useState, useEffect } from "react";
import styles from "@/styles/chat.module.scss";
import { TextField, InputAdornment, ListItem } from "@mui/material";
import Image from "next/image";
import Profile from "@/components/Chat/profile/Profile";
import FirstTime from "@/components/Chat/firstTime";
import Message from "@/components/Chat/mesages/Message";
import ContactInfo from "@/components/Chat/contact/ContactInfo";
import { getClientsLeads } from "services/transferService";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import fetchInstance from "@/utils/fetchInstance";
import { INTERNAL_SERVER_ERROR, OK } from "constants/httpCode";
import useTranslation from "next-translate/useTranslation";
const { NEXT_PUBLIC_S3_LINK } = process.env;
import { getCookies } from "@/utils/cookieHelper";
import App from "../chat"
import NavbarChat from "@/components/Chat/navbarChat/NavbarChat";
import { getUserChats } from "services/chatService";
import ChatTopBar from "@/components/Chat/topBar/topBar";

interface userChat {
  id:string;
  name: string;
  img: string;
  messages: [];
}

const Chat = ({
  avis,
  detailPro,
  err,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [hasMsg, setMsg] = useState<Boolean>(false);
  const [userData, setUserData] = useState<any>();
  const [userList, setUserList] = useState<any>();
  const [chatRoomId, setChatRoomId] = useState<String>('');
  const [chatList, setChatList] = useState<any>([]);
  const [data,setData] = useState<Boolean>(false);
  const [userId, setUserId] = useState<String>(getCookies().id);
  const [active,setActive] = useState<Boolean>(true)
  const [triged, setTrigger] = useState(true);
  const [current, setCurrent] = useState({
    id: '',
    name: '',
    img:''
  });
  
  // style States
  const [hideLeftCont, setHideLeftCont] = useState<any>(false);
  useEffect(() => {
    setUserData(detailPro?.data);
  }, [detailPro]);


  
  const fetchClients = async (page: any) => {
    const clients = await getClientsLeads(page);
    if (clients) {
      setUserList(clients.data.relations);
      return clients.data.relations;
    }
  };
  
  const UserChats = async (userId, userList) => {
    const chats = await getUserChats(userId);
    if (chats) {
      if (chats.data.length > 0) {
        setMsg(true)
      setChatList([]);
      let sortedData = [...chats.data].sort((a:any, b:any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
      sortedData.forEach((item) => {
        let detailUser = userList.filter(person => person._idclientInMyNetwork._id === item.to);
        
        if (detailUser.length > 0){
          setCurrent({
            id: detailUser[0]._idclientInMyNetwork._id,
            name: detailUser[0]._idclientInMyNetwork.firstName +' ' + detailUser[0]._idclientInMyNetwork.lastName,
            img: detailUser[0]._idclientInMyNetwork.profileImage
          });
          setChatRoomId(item._id)
        let chat:userChat = {
          id: detailUser[0]._idclientInMyNetwork._id,
          name: detailUser[0]._idclientInMyNetwork.firstName +' ' + detailUser[0]._idclientInMyNetwork.lastName,
          img: detailUser[0]._idclientInMyNetwork.profileImage,
          messages: item.messages
        };
        setChatList(prev => [chat,...prev]);
        
      }
      
      });
      
    }else{
      setMsg(false)
    }}
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const userList = await fetchClients(1);
      if (userList) {
        UserChats(userId, userList);
        
      }
    };
    fetchData();
  }, [data]);
  console.log('chats', chatList);
  
  const handleClick = (itemId:any,itemName:any,itemImg:any) => {
    setCurrent({
      id: itemId,
      name:itemName,
      img: itemImg
    });
    console.log('aa',current);
    setHideLeftCont(true)
  };

  const filterBySearch = (event) => {
    setTrigger(true);
    const query = event.target.value;
    var updatedList = [...userList];
    updatedList = updatedList.filter((item) => {
      return (
        (
          item?._idclientInMyNetwork.firstName +
          " " +
          item?._idclientInMyNetwork.lastName
        )
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
      );
    });
    setUserList(updatedList);
  };
  const handleSelected = () =>{
    setMsg(!hasMsg)
  }
  // mobile responsive
  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Initial screen width
    setScreenWidth(window.innerWidth);

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
   
    <div className={styles.chatCont} style={{justifyContent: hasMsg == false ?'left':'space-between'}}>
      {/* Left aside container */}
      {userData && (
        <div className={hideLeftCont && screenWidth < 801 ? styles. hideLeftContainer : styles.leftCont}>
          <Profile
            src={
              userData.companyLogo
                ? `${NEXT_PUBLIC_S3_LINK}${
                    userData.companyLogo
                  }?${new Date().toISOString()}`
                : "/img/user.png"
            }
            name={userData.companyName}
            privilege={"admin"}
            online={triged}
          />

          <div className={styles.usersCont}>
          {userList &&
                !hasMsg &&
            <div style={{ margin: "0px 30px 15px 30px" }}>
              <TextField
                onChange={filterBySearch}
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
                  <div onClick={()=>{
                    handleClick(item?._idclientInMyNetwork._id,item?._idclientInMyNetwork.firstName +
                      " " +item?._idclientInMyNetwork.lastName,item?._idclientInMyNetwork.profileImage);setMsg(true)
                  }} style={{cursor:'pointer'}}>
                    <Profile
                    src={
                      item?._idclientInMyNetwork.profileImage
                        ? NEXT_PUBLIC_S3_LINK +
                          item._idclientInMyNetwork.profileImage
                        : "/img/user.png"
                    }
                    name={
                      item?._idclientInMyNetwork.firstName +
                      " " +
                      item?._idclientInMyNetwork.lastName
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
      {!hasMsg && (
           <FirstTime />
          
      
      )}
       {hasMsg && (
        <div className={hideLeftCont && screenWidth < 801 ? styles.showChannelContMobile : styles.channelCont}>
          < ChatTopBar />
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
           />
        </div>
      )}
    </div>
  );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cookies } = context.req;
  const id = cookies.id;
  const role = cookies.role;

  let { response, data } = await fetchInstance(
    `/users/pro-cards-details/${id}`,
    {},
    cookies,
    context.res
  );

  let avis;
  if (role == "EMPLOYEE") {
    avis = await fetchInstance(
      `/users/ratings/${data?.data?.reletedTo}`,
      {},
      cookies,
      context.res
    );
  } else {
    avis = await fetchInstance(
      `/users/ratings/${id}`,
      {},
      cookies,
      context.res
    );
  }

  let { response: res, data: dataAvis } = avis;

  if (response.status === OK && res.status === OK) {
    return { props: { detailPro: data, avis: dataAvis?.data, role } };
  }
  return {
    props: {
      err: INTERNAL_SERVER_ERROR,
      detailPro: null,
    },
  };
};
export default Chat;
