import { Outlet } from 'react-router-dom';

import AuthArtBG from '@assets/images/auth-art-bg.webp';
import AuthArt from '@assets/images/auth-art.webp';

const AuthenticationLayout = () => {
  return (
    <>
      <div className="authentication-container">
        <div className="auth-art-container">
          <h1>Track & Manage Field Force</h1>

          <img className="auth-art" src={AuthArt} alt="bf" />

          <img className="auth-art-bg" src={AuthArtBG} alt="bf" />
        </div>
        <div className="login-container relative">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthenticationLayout;
