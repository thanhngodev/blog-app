import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useState } from 'react';
import i18n from '../i18n.js';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('vi');
  const { t } = useTranslation();

  const FLAG = {
    vi: "https://firebasestorage.googleapis.com/v0/b/blog-app-859aa.appspot.com/o/vi.png?alt=media&token=4e7f9ae7-ae7a-4ed8-917d-3bb8c4db38a4",
    en: "https://firebasestorage.googleapis.com/v0/b/blog-app-859aa.appspot.com/o/en.png?alt=media&token=2c5a83ca-d1a9-486f-9787-c9ee65ff59fc"
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = () => {

  }

  return (
    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          T-
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder={t('SEARCH') + '...'}
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Dropdown 
          arrowIcon={false}
          inline 
          label={
            <Avatar alt='flag' size="xs" img={FLAG[currentLanguage]} rounded />
          }
        >
          <Dropdown.Item onClick={() => changeLanguage('vi')} >
            <Avatar className='mr-2' alt='flag' size="xs" img={FLAG['vi']} rounded />
            {t('vi')}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => changeLanguage('en')} >
            <Avatar className='mr-2' alt='flag' size="xs" img={FLAG['en']} rounded />
            {t('en')}
          </Dropdown.Item>
        </Dropdown>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {
          currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>{t('PROFILE')}</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>{t('SIGN_OUT')}</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <Button gradientDuoTone='purpleToBlue' outline>
                {t('SIGN_IN')}
              </Button>
            </Link>
          )
        }

        <Navbar.Toggle />
      </div>


      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to='/'>{t('HOME')}</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to='/about'>{t('ABOUT')}</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects'>{t('PROJECTS')}</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
