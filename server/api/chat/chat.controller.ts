import {
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
  UsePipes,
  Query,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
@ApiTags("Chat")
@Controller("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}
  @UsePipes(ValidationPipe)
  @Get()
  async getAllChat(@Query("from") from: string) {
    return this.chatService.findAllChat(from);
  }

  @Get("room")
  async getRoom(@Query("from") from: string, @Query("to") to: string) {
    return this.chatService.findRoom(from, to);
  }
  @Post("message")
  @ApiBearerAuth()
  async addNewMsg(
    @Query("from") from: string,
    @Query("to") to: string,
    @Query("content") content: string,
    @Query("time") time: string,
    @Query("sender") sender: string
  ) {
    return this.chatService.addNewMsg(from, to, content, time, sender);
  }

  // fetchProByClient
  @Get("fetchProByClient")
  async getProByClient(@Query("from") from: string) {
    return this.chatService.findProByClient(from);
  }
  //Pusher
  @Post("msgFromPusher")
  async createMessage(
    @Query("username") username: string,
    @Query("message") message: string
  ) {
    console.log("use", username);
    console.log(message);

    // Trigger a Pusher event to notify clients about the new message

    await this.chatService.trigger("chat", "message", {
      username,
      message,
    });

    return [
      {
        username,
        message,
      },
    ];
  }
}
