import { z } from "zod"


export const loginFormSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password must be atlest 6 characters")
})

export const loginAdminFormSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password must be atlest 6 characters")
})

export const registerFormSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(6, "Password must be atlest 6 characters"),
  password_confirmation: z.string().min(6, "Password must be atlest 6 characters")
})



export type LoginFormValues = z.infer<typeof loginFormSchema>
export type LoginAdminFormValues = z.infer<typeof loginAdminFormSchema>
export type RegisterFormValues = z.infer<typeof registerFormSchema>