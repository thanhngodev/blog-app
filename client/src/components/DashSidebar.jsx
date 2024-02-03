import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

const { t } = useTranslation();

  const [tab, setTab] = useState('');

  const tabs = [
    {
      label: "DASHBOARD",
      tab: "dash",
      icon: HiChartPie,
      isAdmin: true
    },
    {
      label: "PROFILE",
      tab: "profile",
      icon: HiUser,
      isAdmin: false
    },
    {
      label: "POSTS",
      tab: "posts",
      icon: HiDocumentText,
      isAdmin: true
    },
    {
      label: "USERS",
      tab: "users",
      icon: HiOutlineUserGroup,
      isAdmin: true
    },
    {
      label: "COMMENTS",
      tab: "comments",
      icon: HiAnnotation,
      isAdmin: true
    }
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {
            (tabs || []).map((tabItem, index) => {
              const isAdmin = currentUser && currentUser.isAdmin;
              // Check if the user is an admin or the tab is not specifically for admins
              const shouldRenderTab = isAdmin || (!tabItem.isAdmin && !isAdmin);

              if (shouldRenderTab) {
                return (
                  <Link to={`/dashboard?tab=${tabItem.tab}`} key={index}>
                    <Sidebar.Item
                      active={tab === tabItem.tab || !tab}
                      label={tabItem.tab === 'profile' && (currentUser.isAdmin ? 'Admin' : 'User' )}
                      icon={tabItem.icon}
                      as='div'
                    >
                      {t(tabItem.label)}
                    </Sidebar.Item>
                  </Link>
                );
              }

              return null; // Do not render the tab
            })
          }
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            {t('SIGN_OUT')}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar
