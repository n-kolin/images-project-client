import { yupResolver } from "@hookform/resolvers/yup"
import { FormEvent, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { object, string } from "yup"
import { AccountCircle, PersonAdd, Person, Group, Email, Lock, Assignment, HowToReg, Login, VisibilityOff, Visibility, Title, Password, Close, Edit } from "@mui/icons-material";
import { AlertTitle, Box, Button, CircularProgress, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, Modal, OutlinedInput, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import { modalStyle } from "../../styles/ModalStyle"

import { LoginType, UserType } from "../../types/UserType";


import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreType } from "../../store/store";
import usersSlice, { login, registration, updateUser } from "../../store/usersSlice";
import { setCurrentUser } from "../../store/authSlice";
import Swal from "sweetalert2";
import Loading from "../Loading";
import DotLoader from "../DotLoader";

const Update = () => {

    const loading = useSelector((state: StoreType) => state.users.loading);




    //pass
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    //register
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: StoreType) => state.auth.currentUser);

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

    const [open, setOpen] = useState(true);
    const style = modalStyle;





    const onSubmit: SubmitHandler<UserType> = async (data) => {



        const res = await dispatch(updateUser({ id: currentUser?.id || -1, user: {...currentUser,...data} }))
        if (res.meta.requestStatus === 'fulfilled') {


            dispatch(setCurrentUser(res.payload.userDto));
            console.log(res);
            sessionStorage.setItem("accessToken", res.payload.token)

            console.log(res);
            console.log('ghj');



        }
        else {

            //not success
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: res.payload.response.data || 'login failed',
            });

        }
        setOpen(false)



    }


    return (
        <>
            {loading && 'ssssss'}
            <Modal open={open} onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            onClick={() => { reset(); setOpen(false); }}
                            sx={{
                                borderRadius: '50%',
                                minWidth: '0',
                                height: '40px',
                                padding: '6px',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                }
                            }}
                        >
                            <Close />
                        </Button>
                    </Box>
                    <Typography variant="h6" component="h2" sx={{ mb: 2, color: 'secondary.dark' }}>
                        <Edit /> Update
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl sx={{ m: 2, width: '25ch' }} >
                            <InputLabel htmlFor="name" error={errors.name !== undefined}>Name</InputLabel>
                            <OutlinedInput
                                id="name"
                                label="name"
                                defaultValue={currentUser?.name}
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
                                defaultValue={currentUser?.email}
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
                                defaultValue={currentUser?.password}
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
                            {loading && <DotLoader />}
                        </Box>




                    </form>
                </Box>
            </Modal>






        </>
    )
}
export default Update