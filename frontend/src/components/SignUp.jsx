import React, { useContext, useState } from 'react'
import { authStyles as styles } from '../assets/dummystyle'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import {validateEmail} from '../utils/helper'

import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import { Input } from './Inputs'

const SignUp = ({setCurrentPage}) => {

  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();


  const handleSignUp = async (e) => {
      e.preventDefault();
      if(!fullName){
        setError('Please enter fullname')
        return;
      }
      if(!validateEmail){
        setError('Plaese enter a valid email address')
        return;
      }
      if(!password){
        setError('Please enter password')
        return;
      }
      setError('');

      try {
          const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
            name: fullName,
            email,
            password,
          });
          const {token} = response.data;
          if (token){
            localStorage.setItem('token', token);
            updateUser(response.data);
            navigate('/dashboard');
          }
      } 
      
      catch (error) {
        setError(error.response?.data?.message || 'Something went wrong. Please try again.')
      }
  }
  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <div className={styles.signupTitle}>Create Account</div>
        <p className={styles.signupSubtitle}>Join our prefessional resume bulder community today</p>
      </div>

      {/*Signup Form  */}
      <form onSubmit={handleSignUp} className={styles.signupForm}>
        <Input value={fullName} onChange={({target}) => setFullName(target.value)}
            label='Full name'
            placeholder='aman k'
            type='text' />

         <Input value={email} onChange={({target}) => setEmail(target.value)}
           label='Email'
           placeholder='email@example.com'
           type='email' />

         <Input value={password} onChange={({target}) => setPassword(target.value)}
             label='Password'
              placeholder='min 8 charecters'
              type='password' />
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button type='submit' className={styles.signupSubmit}>
              Create Account
          </button>

          {/*FOOTER */}
          <p className={styles.switchText}>
            Already have an account?{' '}
            <button onClick={() => setCurrentPage('login')}
              type='button' className={styles.signupSwitchButton}>
              Sign In
            </button>
          </p>
      </form>
    </div>

  )
}

export default SignUp