import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
// import Projects from './pages/Projects';
// import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
// import CreatePost from './pages/CreatePost';
// import UpdatePost from './pages/UpdatePost';
// import PostPage from './pages/PostPage';
// import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      {/* <ScrollToTop /> */}
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/search' element={<Search />} />

        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        {/* 
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/update-post/:postId' element={<UpdatePost />} />
        </Route>

        <Route path='/projects' element={<Projects />} />
        <Route path='/post/:postSlug' element={<PostPage />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
