import axios, { AxiosError, isAxiosError } from 'axios';
import { type sensitiveDiaryEntry, type newDiaryEntry, type diarientry, type PostEntryErrorType } from './type';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaries = () => {
  return axios
    .get<sensitiveDiaryEntry[]>(baseUrl)
    .then(response => response.data)
}

export const createDiary = async (object: newDiaryEntry) => {
  try {
    
    const response = await axios
      .post<diarientry>(baseUrl, object)
    return response.data
  } catch (error) {
    if(isAxiosError(error)){
      const err: AxiosError<PostEntryErrorType> = error;
      console.log(err);
      if (err.response) {
        return err.response.data;
      }
    }
  }
}