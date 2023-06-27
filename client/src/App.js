import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import styles from './App.module.css';
import Protected from './components/protected/Protected'
import Error from './pages/error/Error'
import Login from './pages/Login/Login';
import { useSelector } from 'react-redux';
import Signup from './pages/signup/Signup'
import Crypto from './pages/Crypto/Crypto';
import Blog from './pages/Blog/Blog'
import SubmitBlog from './pages/submitBlog/SubmitBlog';
import BlogDetails from './pages/BlogDetails/BlogDetails';
import UpdateBlog from './pages/UpdateBlog/UpdateBlog';
function App() {
  const isAuth = useSelector((state)=> state.user.auth)
  return (
   <div className={styles.container}>
      <BrowserRouter>
      <div className={styles.layout}>
            <Navbar />
            <Routes>
                <Route 
                  path='/'
                  exact
                  element={
                  <div className={styles.main}>
                    <Home />
                  </div>
                }
                />
                <Route 
                
                  path='crypto'
                  exact
                  element={
                  <div className={styles.main}>
                    <Crypto />
                  </div>
                  }
                />
                <Route 
                  path='blogs'
                  exact
                  element={
                  <Protected isAuth={isAuth}>
                      <div className={styles.main}>
                        <Blog />
                      </div>
                  </Protected>
                  }
                />
                <Route 
                  path='submit'
                  exact
                  element={
                  <Protected isAuth={isAuth}>
                    <div className={styles.main}>
                      <SubmitBlog />
                    </div>
                  </Protected>
                  }
                />
                <Route 
                  path='login'
                  exact
                  element={
                  <div className={styles.main}>
                    <Login />
                  </div>
                }
                />
                <Route 
                  path='signup'
                  exact
                  element={
                  <div className={styles.main}>
                    <Signup />
                  </div>
                }
                />
                <Route 
                  path='blog/:id'
                  element={
                    <Protected isAuth={isAuth}>
                    <div className={styles.main}>
                      <BlogDetails />
                    </div>
                  </Protected>
                }
                />
                <Route 
                  path='blogUpdate/:id'
                  element={
                    <Protected isAuth={isAuth}>
                    <div className={styles.main}>
                      <UpdateBlog />
                    </div>
                  </Protected>
                }
                />
                <Route 
                  path='*'
                  element={
                  <div className={styles.main}>
                    <Error />
                  </div>
                }
                />

            </Routes>
            <Footer />
        </div>
    </BrowserRouter>
   </div>
  );
}

export default App;
