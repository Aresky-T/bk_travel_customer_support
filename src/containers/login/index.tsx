import { useEffect, useState } from "react";
import { useAppContext } from "../../store/context"
import ValidateUtils from "../../utils/validate";
import { useNavigate } from "react-router-dom";
import { loginEmployeeApi } from "../../api/auth.api";
import { localStorageConfig } from "../../config/localStorageConfig";
import { AxiosError } from "axios";
import Login from "../../components/login";
import { PATHS } from "../../constants/paths";

export type FormLogin = {
    username: string,
    password: string
}

export type ErrorsType = Map<string, { message: string }>

const storage = localStorageConfig("acc_info");

const LoginContainer = () => {
    const { state, dispatch } = useAppContext();

    const [formLogin, setFormLogin] = useState<FormLogin>({
        username: '',
        password: ''
    })
    const [errors, setErrors] = useState<ErrorsType>(new Map());
    const navigate = useNavigate();

    const validate = (form: FormLogin) => {
        return ValidateUtils({
            form: form,
            rules: {
                username: {
                    required: true,
                    minLength: 5
                },
                password: {
                    required: true,
                    minLength: 8,
                    maxLength: 20
                }
            },
            messages: {
                username_required: "Tên tài khoản không được để trống",
                username_minLength: "Tên tài khoản phải chứa ít nhất 5 ký tự",
                password_required: "Mật khẩu không được để trống",
                password_minLength: "Mật khẩu phải chứa tối thiểu 8 ký tự",
                password_maxLength: "Mật khẩu không được vượt quá 20 ký tự",
            }
        })
    }
    const handleChangeForm = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target) {
            const { name, value } = event.target;
            setFormLogin({
                ...formLogin,
                [name]: value
            })
        }
    }
    const handleSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        resetErrors();
        const { isValid, errors } = validate(formLogin);
        if (isValid) {
            try {
                dispatch && dispatch({ type: "AUTH|HANDLE_START_LOGIN" });
                const res = await loginEmployeeApi(formLogin);
                const { role, token }: any = res.data;
                if (role === "EMPLOYEE") {
                    storage.setData = { role, token };
                    dispatch && dispatch({ type: "AUTH|HANDLE_SUCCESS_LOGIN", payload: { role, token } })
                } else {
                    errors.set("loginError", { message: "Bạn không phải nhân viên" });
                    setErrors(new Map(errors));
                    dispatch && dispatch({ type: "AUTH|HANDLE_FAILED_LOGIN", payload: "Bạn không phải nhân viên" })
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    const message = error.response?.data?.message;
                    errors.set("loginError", { message: message || "Tài khoản hoặc mật khẩu không đúng" })
                    setErrors(new Map(errors));
                    dispatch && dispatch({ type: "AUTH|HANDLE_FAILED_LOGIN", payload: message || "Bạn không phải nhân viên" })
                }
            }
        } else {
            setErrors(errors);
        }
    }
    const renderError = (inputName: string, errors: ErrorsType) => {
        const error = errors.get(inputName);
        return error?.message || ""
    }
    const resetErrors = () => {
        setErrors(new Map());
    }

    useEffect(() => {
        const { data } = state.auth;
        if (data && data?.role === "EMPLOYEE") {
            navigate(PATHS.CHAT)
        }
        //eslint-disable-next-line
    }, [state.auth.data])

    return (
        <div className="login-container main-session">
            <Login
                formLogin={formLogin}
                errors={errors}
                handleChangeForm={handleChangeForm}
                handleSubmitLogin={handleSubmitLogin}
                renderError={renderError}
            />
        </div>
    )
}

export default LoginContainer