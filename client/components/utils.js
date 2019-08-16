import * as yup from 'yup'

export function randomNumGenerator() {
  return Math.floor(Math.random() * 1000000000 + 1)
}

export const validationSignUp = yup.object().shape({
  username: yup.string().required('username required'),
  email: yup
    .string()
    .email('please enter a valid email')
    .required('email required'),
  password: yup
    .string()
    .required('password required')
    .min(8, 'must be atleast 8 chars')
})

export const validationLogin = yup.object().shape({
  email: yup
    .string()
    .email('please enter a valid email')
    .required('email required'),
  password: yup
    .string()
    .required('password required')
    .min(8, 'must be atleast 8 chars')
})
