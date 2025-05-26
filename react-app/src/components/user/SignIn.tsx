"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { object, string } from "yup"
import { Email, Login, VisibilityOff, Visibility } from "@mui/icons-material"
import { modalStyle } from "../../styles/ModalStyle"

import type { LoginType } from "../../types/UserType"
import Swal from "sweetalert2"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, StoreType } from "../../store/store"
import { login } from "../../store/usersSlice"
import { setCurrentUser } from "../../store/authSlice"
import DotLoader from "../DotLoader"
import "../../css/AuthForms.css"

const SignIn = ({ onSuccess }: { onSuccess: () => void }) => {
  const loading = useSelector((state: StoreType) => state.users.loading)

  //pass
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const UserSchema = object({
    email: string().email().required(),
    password: string().required().min(6).max(25),
  })

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(UserSchema),
  })

  const style = modalStyle

  //register
  const dispatch = useDispatch<AppDispatch>()

  const onSubmit: SubmitHandler<LoginType> = async (data) => {
    console.log(data)

    console.log("jj")

    const res = await dispatch(login(data))
    console.log("jjg")

    console.log(res)

    //on success
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(setCurrentUser(res.payload.userDto))
      console.log(res)
      sessionStorage.setItem("accessToken", res.payload.token)
      console.log(res)
      console.log("ghj")

      console.log()

      onSuccess()
    } else {
      //not success
      onSuccess()
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: res.payload.response.data || "login failed",
      })
    }
  }

  return (
    <>
      <div className="auth-modal-box">
        <h2 className="auth-modal-title">
          <Login /> Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-form-control">
            <label htmlFor="email" className={`auth-input-label ${errors.email !== undefined ? "error" : ""}`}>
              Email
            </label>
            <div className="auth-input-container">
              <div className="auth-input-adornment">
                <Email className="auth-input-icon" />
              </div>
              <input
                id="email"
                className={`auth-outlined-input ${errors.email !== undefined ? "error" : ""}`}
                {...register("email")}
              />
            </div>
            <span className={`auth-helper-text ${errors.email ? "error" : ""}`}>{errors.email?.message}</span>
          </div>

          <div className="auth-form-control">
            <label htmlFor="password" className={`auth-input-label ${errors.password !== undefined ? "error" : ""}`}>
              Password
            </label>
            <div className="auth-input-container">
              <div className="auth-input-adornment">
                <button
                  type="button"
                  className="auth-icon-button"
                  aria-label={showPassword ? "hide the password" : "display the password"}
                  onClick={handleClickShowPassword}
                  //   onMouseDown={handleMouseDownPassword}
                  //   onMouseUp={handleMouseUpPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              <input
                id="password"
                className={`auth-outlined-input ${errors.password !== undefined ? "error" : ""}`}
                {...register("password")}
                type={showPassword ? "text" : "password"}
              />
            </div>
            <span className={`auth-helper-text ${errors.password ? "error" : ""}`}>{errors.password?.message}</span>
          </div>

          <div>
            <button type="submit" className="auth-submit-button">
              Submit
            </button>
          </div>
          <div className="auth-loading-container">{loading && <DotLoader />}</div>
        </form>
      </div>
    </>
  )
}
export default SignIn
