import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { useTranslation } from 'react-i18next';
import LeftAuth from '../components/LeftAuth';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim() })
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if(!formData.username || !formData.password || !formData.email ) {
      return setErrorMessage("Please fill out all fields.");
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      const data = res.json();
      if(data.success === false) { 
        return setErrorMessage(data.message);
      }
      setLoading(false);
      setErrorMessage(null);
      if(res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <LeftAuth />
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value={t('YOUR_USERNAME')} />
              <TextInput
                type='text'
                placeholder={t('USERNAME')}
                id='username'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value={t('YOUR_EMAIL')} />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value={t('YOUR_PASSWORD')} />
              <TextInput
                type='password'
                placeholder={t('PASSWORD')}
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone='purpleToPink'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>{t('LOADING...')}</span>
                </>
              ) : (
                t('SIGN_UP')
              )}
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>{t('HAVE_ACCOUNT')}</span>
            <Link to='/sign-in' className='text-blue-500'>
              {t('SIGN_IN')}
            </Link>
          </div>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignUp