import { ObjectId } from "mongodb";

export interface RegisterDeviceRequest {
   userId: ObjectId;
   device: "ios" | "android";
   token: string;
}
