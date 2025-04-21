import EMPLogo from '@assets/images/emp-logo-name.webp';

const ResetPasswordSuccess = () => {
  return (
    <>
      <img className="emp-logo-auth" src={EMPLogo} alt="emp" />
      <div className="form-input-container">
        <div className="bg-[#5759E6] p-10 flex flex-col justify-center items-center gap-5 rounded-xl">
          <h1 className="text-center text-2xl text-white font-bold">
            Congratulations!!
          </h1>
          <p className="text-center text-white">
            Account password has been changed successfully!
          </p>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordSuccess;
