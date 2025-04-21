import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import usePasswordVisibility from 'hooks/UsePasswordVisibility';
import EMPLogo from '@assets/images/emp-logo-name.webp';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { DisplayFormErrorMessages } from 'components/DisplayFormErrors';
import { passwordSchema, confirmPasswordSchema } from 'schema/Update';
import { useState, useEffect } from 'react';
import validate from 'validate.js';
import { userResetpassword } from './Api/post';
import { toast } from 'sonner';

const ResetPassword = () => {
  const initialState = {
    isValid: false,
    values: { newPassword: '', confirmPassword: '' },
    touched: {},
    errors: { newPassword: '', confirmPassword: '' },
  };

  const schema = {
    newPassword: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  };

  const [formState, setFormState] = useState({ ...initialState });
  let navigate = useNavigate();

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(prevFormState => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, formState.isValid]);

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

  useEffect(() => {}, [formState]);
  const hasError = field =>
    !!(formState.touched[field] && formState.errors[field]);

  const handleSubmit = e => {
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
    let { newPassword, confirmPassword } = formState.values;

    if (newPassword !== '' && confirmPassword !== '') {
      let errors = formState?.errors;
      if (
        Object.keys(errors).length === 0 ||
        (errors.newPassword === '' && errors.confirmPassword === '')
      ) {
        let url = window.location.href;
        url = new URL(url.toString());
        const urlParams = new URLSearchParams(url.search);
        let email = urlParams.get('userMail');
        let token = urlParams.get('activationLink');

        const loadingToast = toast.loading('Processing...');

        userResetpassword({ email, token, newPassword })
          .then(function (response) {
            if (response?.data.statusCode === 200) {
              navigate('/admin/reset-password-success');
              toast.success(response ? response?.data?.body?.message : '', {
                id: loadingToast,
              });
            } else {
              toast.error(
                response ? response?.data.body?.message : 'Try Again!',
                { id: loadingToast }
              );
            }
            setTimeout(() => {
              navigate('/admin/login');
            }, 2000);
          })
          .catch(error => {
            toast.error(
              error
                ? error?.data?.body.message
                : 'SomeThing went wrong Try again!'
            );
          });
      } else {
        toast.error('Inputs are not Valid!');
      }
    }
  };

  const [showPas, setShowPas] = useState(false);
  const [showPas1, setShowPas1] = useState(false);

  const { isVisible1, toggleVisibility1 } = usePasswordVisibility();
  const { isVisible12, toggleVisibility2 } = usePasswordVisibility();
  const resetInpRef = useRef();
  const confirmPasswordRef = useRef();
  const handleResetKeyPress = e => {
    if (e.target.name === 'reset-password' && e.key === 'Enter') {
      confirmPasswordRef.current.focus();
    } else if (e.target.name === 'confirm-password' && e.key === 'Enter') {
      resetInpRef.current.click();
    }
  };

  return (
    <>
      <img className="emp-logo-auth" src={EMPLogo} alt="emp" />
      <div className="form-input-container">
        <h1 className="text-center text-2xl text-[#1F3A78] font-bold">
          Reset Password?
        </h1>
        <div className="relative w-full pb-8">
          <Input
            ref={confirmPasswordRef}
            name="newPassword"
            onKeyDown={handleResetKeyPress}
            type={showPas ? 'text' : 'password'}
            placeholder="Enter New Password"
            onChange={handleChange}
            error={hasError('newPassword')}
            error_msg={DisplayFormErrorMessages(formState.errors.newPassword)}
            // required
          />
          <span className="eye-icon-input" onClick={toggleVisibility1}>
            {!showPas ? (
              <FaEyeSlash onClick={() => setShowPas(!showPas)} />
            ) : (
              <FaEye onClick={() => setShowPas(!showPas)} />
            )}
          </span>

          <span className="gradient-line"></span>

          {hasError('newPassword') && (
            <span className="error-message">
              {DisplayFormErrorMessages(formState.errors.newPassword)}
            </span>
          )}
        </div>
        <div className="relative w-full pb-6">
          <Input
            onKeyDown={handleResetKeyPress}
            type={showPas1 ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            error={hasError('confirmPassword')}
            error_msg={DisplayFormErrorMessages(
              formState.errors.confirmPassword
            )}
            value={formState.values.confirmPassword}
            onChange={handleChange}
            // requireds
          />
          <span className="eye-icon-input" onClick={toggleVisibility2}>
            {!showPas1 ? (
              <FaEyeSlash onClick={() => setShowPas1(!showPas1)} />
            ) : (
              <FaEye onClick={() => setShowPas1(!showPas1)} />
            )}
          </span>

          <span className="gradient-line"></span>

          {hasError('confirmPassword') && (
            <span className="error-message">
              {DisplayFormErrorMessages(formState.errors.confirmPassword)}
            </span>
          )}
        </div>
      </div>
      <Button asChild className="bg-gradient w-full">
        <Link onClick={handleSubmit} ref={resetInpRef}>
          Submit
        </Link>
      </Button>
    </>
  );
};

export default ResetPassword;
