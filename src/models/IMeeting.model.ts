import { Request } from 'express';
import OtherUtil from '../utils/Other.util';

type QueryOption = '$gte' | '$lte';
type RegexOption = 'i';
export interface IMeetingBody extends Request{
  body: {
    id: string
    _id: string
    meeting_name: string
    meeting_from: string
    guest_email: string
    guest_phone: string
    guest_name: string
    before_start: string
    during: string
    place: string
    staff_message: string
    guest_company: string
    user_name: string
    send_mail: string
    guest_id: string
    timezone: string
    other: {
      info1: string
      info2: string
      info3: string
    }
  }
}
class MeetingData {
  meeting_code? = '';

  meeting_name? = '';

  meeting_from? = '';

  meeting_to? = '';

  guest_email? = '';

  other? = {
    info2: ''
  };
}
export interface IMeetingData extends MeetingData{}
const meetingData = new MeetingData();

export const copyMeetingData = (object: any) => OtherUtil.copyFieldInterface<MeetingData, IMeetingData>(meetingData, object);
export interface IMeetingQueyMongo {
  meeting_from?: string | {
    [key in QueryOption]?: string
  }
  meeting_to?: string | {
    [key in QueryOption]?: string
  }
  guest_name?: {
    $regex: string,
    $options: RegexOption
  }
  meeting_code?: string
  private_key?: string
  user_name?: {
    $regex: string,
    $options: RegexOption
  },
  meeting_name?: {
    $regex: string,
    $options: RegexOption
  },
  guest_id?: string
}
