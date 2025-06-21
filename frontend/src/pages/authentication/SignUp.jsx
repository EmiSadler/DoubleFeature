import Footer from "../../components/Footer";
import { DoubleFeatureLogo } from "../../components/DoubleFeatureLogo";
import "./Authentication.css";

export const SignUp = () => {
  return (
    <div className="sign-up-page">
      <h1 className="home-title">Welcome to</h1>
      <DoubleFeatureLogo />
      <h1>Sign Up for an Account to Start Playing!</h1>
      <form>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
        <div className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </form>
      <Footer />
    </div>
  );
};
