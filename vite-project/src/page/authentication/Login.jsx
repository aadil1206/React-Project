import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import usePasswordVisibility from 'hooks/UsePasswordVisibility';
import EMPLogo from '@assets/images/emp-logo-name.webp';
import { Link, useNavigate } from 'react-router-dom';
import { emailSchema, passwordSchema } from 'schema/Login';
import { useEffect, useRef, useState } from 'react';
import { validate } from 'validate.js';
import { toast } from 'sonner';
import { adminLogin } from './Api/post';
import { DisplayFormErrorMessages } from 'components/DisplayFormErrors';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const accessToken = Cookies.get('token');
  const isAuthenticated =
    accessToken !== undefined && accessToken !== null && accessToken !== '';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    navigate('/admin/dashboard');
  }
  const { isVisible, toggleVisibility } = usePasswordVisibility();

  const btnRef = useRef();
  const passwordRef = useRef();

  const initialState = {
    isValid: false,
    values: {
      email: '',
      password: '',
    },
    touched: {},
    errors: { email: '', password: '' },
  };

  const schema = {
    email: emailSchema,
    password: passwordSchema,
  };

  const [formState, setFormState] = useState({ ...initialState });

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(prevFormState => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, formState.isValid]);

  // Function to handle Changes etc ................
  const handleChange = event => {
    event.persist();

    let key = event.target.name;

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [key]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [key]: true,
      },
    }));
  };

  const hasError = field =>
    !!(formState.touched[field] && formState.errors[field]);

  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedRememberMe = localStorage.getItem('rememberMe');
    if (
      savedRememberMe === 'true' &&
      localStorage.getItem('username') &&
      localStorage.getItem('password')
    ) {
      setRememberMe(true);
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          email: localStorage.getItem('username'),
        },
        touched: {
          ...formState.touched,
          email: true,
        },
      }));
      setFormState(formState => ({
        ...formState,
        values: {
          ...formState.values,
          password: localStorage.getItem('password'),
        },
        touched: {
          ...formState.touched,
          password: true,
        },
      }));
    }
  }, []);

  const handleRememberMeChange = checked => {
    setRememberMe(checked);
  };

  // Function to handle Loogin validation etc ................
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validate(formState.values, schema);
    if (errors) {
      setFormState(prevFormState => ({
        ...prevFormState,
        touched: {
          ...prevFormState.touched,
          ...Object.keys(errors).reduce((obj, key) => {
            obj[key] = true;
            return obj;
          }, {}),
        },
        errors: errors,
      }));
      return;
    }

    const loginData = {
      email: formState.values.email,
      password: formState.values.password,
    };
    const loadingToast = toast.loading('Logging in...');
    adminLogin(loginData)
      .then(response => {
        if (response.data.body.status === 'success') {
          Cookies.set('token', response?.data?.body?.data?.accessToken);
          Cookies.set(
            'createdAt',
            response?.data?.body?.data?.userData?.createdAt
          );
          const redirectPath =
            sessionStorage.getItem('redirectPath') || '/admin/dashboard';
          sessionStorage.removeItem('redirectPath');
          navigate(redirectPath);
          toast.success(response ? response?.data?.body?.message : '', {
            id: loadingToast,
          });
        } else {
          toast.error(response ? response?.data.body?.message : 'Try Again!', {
            id: loadingToast,
          });
        }
      })
      .catch(function (response) {
        toast.error(
          response ? response.data.body.message : 'Something went wrong!'
        );
      });
    if (rememberMe) {
      localStorage.setItem('username', formState.values.email);
      localStorage.setItem('password', formState.values.password);
      localStorage.setItem('rememberMe', true);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('rememberMe');
    }
  };

  // Function to handle keypress ................
  const handleKeyPress = e => {
    if (e.target.type === 'email' && e.key === 'Enter') {
      passwordRef.current.focus();
    } else if (e.target.name === 'password' && e.key === 'Enter') {
      btnRef.current.click();
    } else {
      return;
    }
  };

  return (
    <>
      <img className="emp-logo-auth" src={EMPLogo} alt="emp" />
      <div className="form-input-container">
        <h1 className="text-center text-xl 2xl:text-2xl text-[#1F3A78] font-bold">
          Welcome!
        </h1>
        <p className="text-center text-base 2xl:text-xl">
          Sign Into Your Account
        </p>
        <div className="relative w-full pb-8">
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            error={hasError('email')}
            error_msg={DisplayFormErrorMessages(formState.errors.email)}
            value={formState?.values?.email}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />

          <span className="gradient-line"></span>

          {hasError('email') && (
            <span className="error-message">
              {DisplayFormErrorMessages(formState.errors.email)}
            </span>
          )}
        </div>
        <div className="relative w-full pb-8">
          <Input
            type={isVisible ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            error={hasError('password')}
            error_msg={DisplayFormErrorMessages(formState.errors.password)}
            value={formState?.values?.password}
            onChange={handleChange}
            ref={passwordRef}
            onKeyDown={handleKeyPress}
          />
          <span
            className="eye-icon-input cursor-pointer"
            onClick={toggleVisibility}>
            {isVisible ? <FaEye /> : <FaEyeSlash />}
          </span>

          <span className="gradient-line"></span>
          {hasError('password') && (
            <span className="error-message">
              {DisplayFormErrorMessages(formState.errors.password)}
            </span>
          )}
        </div>

        <div className="flex flex-wrap sm:items-start lg:items-center justify-between items-center w-full">
          <div className="flex justify-center items-center gap-1">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={handleRememberMeChange}
            />
            <span className="text-xs font-semibold text-primary">
              Remember Me
            </span>
          </div>
          <Button variant="link" className="p-0">
            <Link
              to="/admin/forgot-password"
              className="font-semibold text-xs 2xl:text-sm">
              Forgot Password?
            </Link>
          </Button>
        </div>
      </div>
      <Button
        className="bg-gradient w-full"
        onClick={handleSubmit}
        ref={btnRef}>
        Login
      </Button>
    </>
  );
};

export default Login;
