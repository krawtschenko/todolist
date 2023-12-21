export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
};

type InitialStateType = typeof initialState;

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    default:
      return state;
  }
};

type ActionsType = ReturnType<typeof setAppStatusAC>;

export const setAppStatusAC = (status: RequestStatusType) => ({ type: "APP/SET-STATUS" as const, status });
