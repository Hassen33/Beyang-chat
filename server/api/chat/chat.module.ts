import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from './chat.service';
import { mongooseModuleConfig } from 'src/shared/mongooseConfig';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from "./schemas/chat.schema";
import { AppointmentStatSchema, AppointmentStat } from "../appointment/schemas/appointment.stat";
import { Appointment, AppointmentSchema } from "../appointment/schemas/appointment.entity";
import { User, UserSchema } from "../users/models/user.model";
import { Company, CompanySchema } from "../companies/company.models";


@Module({
  
  imports: [MongooseModule.forFeature([
    { name: Chat.name, schema: ChatSchema }
  MongooseModule.forFeature([
    { name: Appointment.name, schema: AppointmentSchema }
  ]),
  MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
  ]),
  MongooseModule.forFeature([
    { name: Company.name, schema: CompanySchema }
  ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
