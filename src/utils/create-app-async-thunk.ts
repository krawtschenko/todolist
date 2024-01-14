import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "state/store";

interface ICreateAsyncThunk {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: null;
}

export const createAppAsyncThunk = createAsyncThunk.withTypes<ICreateAsyncThunk>();
