"use server"
import axiosServer from "@/shared/lib/axiosServer";
import { Event, GetEventsParams } from "@/shared/types/event";

const prefix = "/event"

export async function getEvents(params: GetEventsParams = {}): Promise<Event[]> {
  const { limit = 10, offset = 0 } = params;

  const res = await axiosServer.get(`${prefix}/findAll`, {
    params: {
      limit: limit.toString(),
      offset: offset.toString(),
    },
  });
  console.log(res);
  return res.data;
}

