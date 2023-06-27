import styles from './Signup.module.css'
import TextInput from '../../components/TextInput/TextInput'
import signupSchema from '../../schema/signupSchema'
import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signup } from '../../api/internal'
import { setUser } from '../../store/userSlice'

function Signup(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error,setError] = useState('')

    const handleSignup = async() =>{
        const data={
            username:values.username,
           name:values.name,
           email:values.email,
           password:values.password,
           confirmPassword:values.confirmPassword,
        }

        const response = await signup(data)

        if(response.status === 201){
            const user={
                _id: response.data.user._id,
                email: response.data.user.email,
                username: response.data.user.username,
                auth: response.data.auth
            }
            dispatch(setUser(user))
            navigate('/')
        }else if(response.code === 'ERR_BAD_REQUEST' ){
            setError(response.response.data.message)
        }
    }

    const {values,touched, handleBlur, handleChange, errors} = useFormik({
        initialValues:{
           username:'',
           name:'',
           email:'',
           password:'',
           confirmPassword:'',
        },
        validationSchema: signupSchema
    })

    return (
      <div className={styles.signupWrapper}>
        <div className={styles.singupHeader}>Create Account</div>
        <TextInput
          type="text"
          value={values.username}
          name="username"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="username"
          error={errors.username && touched.username ? 1 : undefined}
          errormessage={errors.username}
        />
        <TextInput
          type="text"
          value={values.name}
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="name"
          error={errors.name && touched.name ? 1 : undefined}
          errormessage={errors.name}
        />
        <TextInput
          type="email"
          value={values.email}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="email"
          error={errors.email && touched.email ? 1 : undefined}
          errormessage={errors.email}
        />
        <TextInput
          type="password"
          value={values.password}
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="********"
          error={errors.password && touched.password ? 1 : undefined}
          errormessage={errors.password}
        />
        <TextInput
          type="password"
          value={values.confirmPassword}
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="********"
          error={
            errors.confirmPassword && touched.confirmPassword ? 1 : undefined
          }
          errormessage={errors.confirmPassword}
        />
        <button
          className={styles.signupButton}
          onClick={handleSignup}
          disabled={
            !values.username ||
            !values.password ||
            !values.email ||
            !values.name || 
            !values.confirmPassword ||
            errors.username ||
            errors.password || 
            errors.email ||
            errors.name || 
            errors.confirmPassword
          }
        >
          SignUp
        </button>
        <span>
          Already have an account?{" "}
          <button
            className={styles.createAccount}
            onClick={() => navigate("/login")}
          >
            Login
          </button>{" "}
        </span>
        {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
      </div>
    );
}

export default Signup