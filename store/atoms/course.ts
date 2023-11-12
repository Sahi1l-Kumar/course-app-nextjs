import { atom } from "recoil";

export interface Course {
  title: string;
  description: string;
  price: number;
  imageLink: string;
  published: boolean;
  _id: string;
}

export const courseState = atom<{ isLoading: boolean; course: null | Course }>({
  key: "courseState",
  default: {
    isLoading: true,
    course: null,
  },
});
