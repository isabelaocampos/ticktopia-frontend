import axios from 'axios'
import { CreatePresentationDto } from '@/shared/types/presentation'
import axiosClient from '@/shared/lib/axiosClient';

const prefix = '/presentation'

export async function createPresentation(dto: CreatePresentationDto) {
  const res = await axiosClient.post(`${prefix}`, dto);
  return res.data;
}