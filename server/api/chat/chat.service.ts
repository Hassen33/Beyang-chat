import { Injectable } from "@nestjs/common";
import * as Pusher from "pusher";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatSchema } from "./schemas/chat.schema";
import { Model } from "mongoose";
import { Appointment } from "../appointment/schemas/appointment.entity";
import { User } from "../users/models/user.model";
import { Company } from "../companies/company.models";
@Injectable()
export class ChatService {
  pusher: Pusher;
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(User.name) private UsersModel: Model<User>,
    @InjectModel(Company.name) private CompanyModule: Model<Company>
  ) {
    this.pusher = new Pusher({
      appId: "1597736",
      key: "adc5cfb9b6ca20c0b7a8",
      secret: "34363521ce1a3e6d417c",
      cluster: "mt1",
      useTLS: true,
    });
  }

  // fetchProByClient

  async findProByClient(from: string) {
    // get unique pro ids for client
    const uniqueProids = [];
    let proDetails = [];
    let companyIds = [];
    let companyDetails = [];

    const pros = await this.appointmentModel
      .find({
        from: from,
        status: "Accepted",
      })
      .exec();
    pros.forEach((prs) => {
      if (!uniqueProids.includes(prs.to)) {
        uniqueProids.push(prs.to);
      }
    });
    const stringIds = uniqueProids.map((id) => id.toString());
    const uniqueIds = [...new Set(stringIds)];
    // get array of pro image , company name using pro ids [{pro1},{pro2}...]
    const users = await this.UsersModel.find({ _id: { $in: uniqueIds } });
    proDetails = users.map((user) => ({
      proId: user._id,
      proImage: user.profileImage,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
    // find the company Info
    companyIds = users.map((user) => user.relatedCompany);
    const companyInfo = await this.CompanyModule.find({
      _id: { $in: companyIds },
    });
    companyDetails = companyInfo.map((company) => ({
      companyId: company._id,
      companyLogo: company.companyLogo,
      companyName: company.companyName,
    }));
    // merge info of the pro and company
    let proCompanyInfo = proDetails.map((obj1, index) => {
      const obj2 = companyDetails[index];
      return { ...obj1, ...obj2 };
    });

    return proCompanyInfo;
  }

  async findAllChat(from: string) {
    const chats = await this.chatModel
      .find({ $or: [{ from: from }, { to: from }] })
      .exec();
    return chats;
  }

  async findRoom(from: string, to: string) {
    const chats = await this.chatModel.find({ from: from, to: to }).exec();
    return chats;
  }

  async addNewMsg(from, to, content, time, sender) {
    const newMessage = {
      content: content,
      time: time,
      sender: sender,
    };
    const chats = await this.chatModel.find({ from: from, to: to }).exec();
    if (chats.length > 0) {
      const res = await this.chatModel
        .findOneAndUpdate(
          { from: from, to: to },
          { $push: { messages: newMessage } }
        )
        .exec();
      return res;
    } else {
      const res = await this.chatModel.create({
        from: from,
        to: to,
        messages: newMessage,
      });
      // res.save();
      return res;
    }
  }

  async trigger(channel: string, event: string, data: any) {
    await this.pusher.trigger(channel, event, data);
  }
}
