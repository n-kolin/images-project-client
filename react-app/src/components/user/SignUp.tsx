import { yupResolver } from "@hookform/resolvers/yup"
import { useState } from "react"
import {  SubmitHandler, useForm } from "react-hook-form"
import { object, string } from "yup"
import {  PersonAdd, Person, Email, VisibilityOff, Visibility } from "@mui/icons-material";
import { Box, Button, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { modalStyle } from "../../styles/ModalStyle"

import { LoginType, UserType } from "../../types/UserType";


import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../../store/store";
import usersSlice, { login, registration } from "../../store/usersSlice";
import { setCurrentUser } from "../../store/authSlice";
import Swal from "sweetalert2";
import Loading from "../Loading";
const SignUp = ({onSuccess}:{onSuccess:()=>void}) => {

    const loading = useSelector((state: StoreType) => state.users.loading);



    //pass
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const UserSchema = object({
        name: string().required().min(3),
        email: string().email().required(),
        password: string().required().min(6).max(25),
    })

    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm({
        
        resolver: yupResolver(UserSchema)
    })

    const style = modalStyle;


    //register
    const dispatch = useDispatch<AppDispatch>();


    const onSubmit: SubmitHandler<UserType> = async (data) => {
        
        const newUser:Partial<UserType>={
            name:data.name,
            email:data.email,
            password:data.password,
            role:'User',
        }

        const res = await dispatch(registration(newUser))

        console.log(res);
        
        if (res.meta.requestStatus === 'fulfilled') {
            console.log('jjg');
            console.log(res);
            dispatch(setCurrentUser(res.payload.userDto));
            sessionStorage.setItem("accessToken", res.payload.token)
            console.log('ghj');
            onSuccess();
           



        }
        else {

            //not success
            onSuccess();
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.payload.response.data || 'login failed',
            });

        }

        
        

    }


    return (
        <>
            {loading && 'ssssss'}

            <Box sx={style}>

                <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'secondary.dark' }}>
                    <PersonAdd /> Sign Up
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl sx={{ m: 2, width: '25ch' }} >
                        <InputLabel htmlFor="name" error={errors.name !== undefined}>Name</InputLabel>
                        <OutlinedInput
                            id="name"
                            label="name"
                            {...register('name')}
                            error={errors.name !== undefined}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Person sx={{ color: 'gray' }} />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText error>{errors.name?.message}</FormHelperText>
                    </FormControl>

                    <FormControl sx={{ m: 2, width: '25ch' }} >
                        <InputLabel htmlFor="email" error={errors.email !== undefined}>Email</InputLabel>
                        <OutlinedInput
                            id="email"
                            label="email"
                            {...register('email')}
                            error={errors.email !== undefined}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Email sx={{ color: 'gray' }} />
                                </InputAdornment>
                            }
                        />
                        <FormHelperText error>{errors.email?.message}</FormHelperText>

                    </FormControl>




                    <FormControl sx={{ m: 2, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="password" error={errors.password !== undefined}>Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            label="password"
                            {...register('password')}
                            error={errors.password !== undefined}
                            type={showPassword ? 'text' : 'password'}
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        //   onMouseDown={handleMouseDownPassword}
                                        //   onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText error>{errors.password?.message}</FormHelperText>

                    </FormControl>



                    <div>
                        <Button type="submit" sx={{
                            bgcolor: 'primary.dark', color: '#000', '&:hover': {
                                backgroundColor: 'primary.main'
                            }
                        }}>
                            Submit
                        </Button></div>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                        {loading && <Loading />}
                    </Box>
                 

                    
                </form>
            </Box>






        </>
    )
}
export default SignUp