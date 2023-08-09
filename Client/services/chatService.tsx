import axiosInstance from "@/utils/axiosInstance"

// Get all chats
export async function getUserChats(userId) {

    if (userId){
        try {
            const res = await axiosInstance(`/chat?from=${userId}`, {
                method: "GET",
            })
            return { data: res.data }
            
            
    
        } catch (err: any) {
            return { error: err.response }
        }
    
    }
}
// Post conversation 
export async function addNewMsg(from:string,to:string,content:string,time:Date,sender:string) {

     try {
         const res = await axiosInstance(`/chat/message?from=${from}&to=${to}&content=${content}&time=${time}&sender=${sender}`, {
             method: "POST",
             
         })
         console.log('ici',res.data);
         
         return { data: res.data }
 
     } catch (err: any) {
         return { error: err.response }
     }
    
 }
 // Get specific conversation
export async function getChannel(from:string,to:string) {

    if (from){
        try {
            const res = await axiosInstance(`/chat/room?from=${from}&to=${to}`, {
                method: "GET",
            })
            return { data: res.data }
            
            
    
        } catch (err: any) {
            return { error: err.response }
        }
    
    }
}
// Get Pro By client
export async function getProByClient(userId:string) {

    if (userId){
        try {
            const res = await axiosInstance(`/chat/fetchProByClient?from=${userId}`, {
                method: "GET",
            })
            return { data: res.data }
            
            
    
        } catch (err: any) {
            return { error: err.response }
        }
    
    }
}
// Post conversation 
export async function createMsg(username:string,message:string) {
 
    try {
        const res = await axiosInstance(`/chat/msgFromPusher?username=${username}&message=${message}`, {
            method: "POST",
            
        })
        return { data: res }

    } catch (err: any) {
        return { error: err.response }
    }
   
}
// Delete chatRoom
export async function deleteChatRoom(id: string) {

    try {
        const res = await axiosInstance(`/chat/DeleteChatRoom?id=${id}`, {
            method: "DELETE",
        })

        return { status: res.status }

    } catch (err: any) {
        return { error: err.response }
    }

}