export interface IAuth {
    role: string | null,
    token: string | null
}

export interface IAuthState {
    data: IAuth,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    errorMessage: string
}