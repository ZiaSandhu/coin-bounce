import * as yup from 'yup'

// const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-={}|;:'\",.<>?/]).{8,32}$/
// [eslint-disable-next-line]
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-={}|;:'\",.<>?/]).{8,32}$/

const errorMessage = 'use lowercase, uppercase and digits'

const signUpSchema = yup.object().shape({
    name: yup.string().max(30).required('Name is required'),
    username: yup.string().min(5).max(30).required('Username is required'),
    email: yup.string().email('Enter valid email address').required('Email is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern,{message: errorMessage}).required('Enter Password'),
    confirmPassword:yup.string().oneOf([yup.ref('password')],'password must matches').required('Enter Confirm password')
});

export default signUpSchema
