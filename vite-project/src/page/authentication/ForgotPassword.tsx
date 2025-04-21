import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRef } from 'react';
import { userForgotPassword } from './Api/post';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminForgotSchema } from 'schema/Forgot';
import { useFormik } from 'formik';
import ButtonLoading from 'components/ButtonLoading';

const ForgotPassword = () => {
  const forgotRef = useRef();
  const handleForgotKeyPress = e => {
    if (e.key === 'Enter') {
      forgotRef.current.click();
    }
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: adminForgotSchema,
    onSubmit: async () => {
      const loadingToast = toast.loading('Sending...');
      try {
        const response = await userForgotPassword(formik.values.email);
        if (response?.data?.body?.status === 'success') {
          toast.dismiss(loadingToast);
          toast.success(response ? response?.data?.body?.message : '');
        } else {
          toast.dismiss(loadingToast);
          toast.error(response ? response?.data?.body?.message : 'Try Again!');
        }
        formik.resetForm();
      } catch (response) {
        toast.dismiss(loadingToast);
        toast.error(
          response ? response.data.body.message : 'Something went wrong!'
        );
      }
    },
  });

  return (
    <>
      <div
        className=" absolute top-[8%] left-0"
        onClick={() => navigate('/admin/login')}>
        <ArrowLeft className="w-7 h-7 hover:bg-black/10 duration-300 ease-linear p-1 rounded-full hover:-translate-x-1 cursor-pointer" />
      </div>
      <div className="form-input-container">
        <h1 className="text-center text-xl 2xl:text-2xl text-[#1F3A78] font-bold">
          Forgot Password ?
        </h1>
        <div className="relative w-full pb-8">
          <Input
            onKeyDown={handleForgotKeyPress}
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={event => {
              formik.handleChange(event);
            }}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />

          <span className="gradient-line"></span>

          {formik.touched.email && formik.errors.email ? (
            <span className="error-message">{formik.errors.email}</span>
          ) : null}
        </div>
      </div>
      <ButtonLoading
        className="bg-gradient w-full mt-10"
        ref={forgotRef}
        isLoading={formik.isSubmitting}
        disableButton={!formik.isValid}
        onClick={formik.handleSubmit}>
        Send
      </ButtonLoading>
    </>
  );
};

export default ForgotPassword;
