
export type UserType = {
    id?:number,
    name:string,
    email:string,
    password:string,
    role: 'User' | 'Admin'
    createdAt?:Date,
    updatedAt?:Date,
}

export type LoginType = {
    email:string,
    password:string,
}