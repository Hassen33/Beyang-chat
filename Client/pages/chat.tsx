import { SetStateAction, useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import Msg from "@/components/Chat/Msgs";
import styles from "@/styles/chat.module.scss";
import { getCookies } from "@/utils/cookieHelper";
import File from "@/components/Chat/file";
import { TextField, InputAdornment } from '@mui/material'
import Image from 'next/image'
import { addNewMsg, getChannel, createMsg } from "services/chatService";

function App(props:any) {
  const [msg, setMsg] = useState<String>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [media, setMedia] = useState<Boolean>(false);
  const [messages, setMessages] = useState<any>([]);

  
  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher('adc5cfb9b6ca20c0b7a8', {
      cluster: 'mt1',
    });

    const channel = pusher.subscribe('chat');

    channel.bind('message', (data:any) => {
      const msg = String(data.message);
      const sender = String(data.username);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newMessage = {
        msg,
        timestamp,
        sender  
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
    });
    scrollToBottom();
    return () => {
      channel.unbind('message');
      pusher.unsubscribe('chat');
    };
  }, [messages]);
  const handleInputChange = (event) => {
    setMsg(event.target.value);
  };
  
  const sendNewMsg = async (from,to,content,time,sender) => {
    const sendMsg = await addNewMsg(from,to,content,time,sender)
    return sendMsg
  }
  const createMsgPusher = async (username,message) => {
    const sending = await createMsg(username,message)
    return sending
  }
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  const fetchChannel = async (from,to) => {
    const channel = await getChannel(from,to);
    if (channel) {
      if (channel.data.length > 0){
      if(channel.data[0].messages){
        channel.data[0].messages.map((item) =>{
          const msg = item.content;
          const timestamp = item.time.slice(11, 16);
          const sender = item.sender;
          const newMessage = {
            msg,
            timestamp,
            sender
          };
          setMessages((prevMessages) => [...prevMessages,  newMessage]);
        })
      }
    }
    }
  }
  
  useEffect(() => {
    if(props.user.id){
      setMessages([]);
      if (getCookies().role == 'PRO'){
        fetchChannel(getCookies().id,props.user.id);
      }else{
        fetchChannel(props.user.id,getCookies().id);
      }
    }
    scrollToBottom();
  }, [props.user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if(msg.length > 0){
    const sender = getCookies().id;
    // Store the msg in DB
    if (getCookies().role == 'PRO'){
      sendNewMsg(getCookies().id,props.user.id,msg,new Date(),sender)
    }else{
      sendNewMsg(props.user.id,getCookies().id,msg,new Date(),sender)
    }
    // refresh UI
    props.onDataUpdate(true);
    createMsgPusher(String(sender),String(msg));
        setMsg('');
        scrollToBottom();
      };
    };

  return (
    <div >
      <div className={styles.MsgCont} ref={containerRef} >
        {messages.map((msg, index) => (
          <div key={index} >
          <Msg
                sender={msg.sender}
                msgContent={msg.msg}
                date={msg.timestamp}
              />
          </div>
        ))}
      </div>
      {media && <File />}
      <div className={styles.inputCont} >
      <div className={styles.icons} ><Image style={{cursor:'pointer',marginRight:'10px'}} src={"/img/settings.svg"} width={5} height={5}></Image> </div>
      <div className={styles.icons} ><Image style={{cursor:'pointer'}} src={"/img/attachment.svg"} width={15} height={15} onClick={()=> setMedia(!media)}></Image> </div>
        <TextField
          className={styles.msgInput}
          placeholder={"Aa"}
          value={msg} 
          onChange={handleInputChange}
          InputProps={{
            endAdornment: [
              <InputAdornment position="end">
                <button className={styles.sendButton} onClick={handleSubmit}>
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
    </div>
  );
};


export default App;