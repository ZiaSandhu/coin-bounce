import { NavLink, useNavigate } from 'react-router-dom'
import styles from './Navbar.module.css'
import { useSelector } from 'react-redux';
import {signout} from '../../api/internal'
import {resetUser} from '../../store/userSlice'
import { useDispatch } from 'react-redux';
function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticate = useSelector((state)=> state.user.auth);

  const handleSignout = async() =>{
    await signout()

    dispatch(resetUser())
    navigate('/')
  }
  return (
    <>
      <nav className={styles.navbar}>
        <NavLink 
          className={`${styles.logo} ${styles.inActive}`} 
          to="/">
          CoinBounce
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Home
        </NavLink>
        <NavLink
          to="crypto"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Crypto
        </NavLink>
        <NavLink
          to="blogs"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Blog
        </NavLink>
        <NavLink
          to="submit"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          Sumbit a Blog
        </NavLink>
        {!isAuthenticate ? 
        <><NavLink
          to="login"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          <button className={styles.logInButton}>LogIn</button>
        </NavLink>
        <NavLink
          to="signup"
          className={({ isActive }) =>
            isActive ? styles.activeStyle : styles.inActiveStyle
          }
        >
          <button className={styles.signUpButton}>Signup</button>
        </NavLink> </>
        :
        <NavLink
          // to="/" 
        >
          <button className={styles.signOutButton} onClick={handleSignout}>SignOut</button>
        </NavLink>
        }
      </nav>
      <div className={styles.separator}></div>
    </>
  );
}

export default Navbar