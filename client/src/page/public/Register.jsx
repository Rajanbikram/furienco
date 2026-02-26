import { Link } from "react-router-dom";
import "../../css/auth.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "./schema/register.schema";
import { useApi } from "../../hooks/useAPi";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });
  const { callApi } = useApi();

  console.log(errors);
  const handleRegister = async (userData) => {
    try {
      const res = await callApi("POST", "/users", { data: userData });
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <>
      <div className="container-fluid flex flex-column p-3">
        <div class="register-card">
          <h2>Create Account</h2>
          <p class="subtitle">Please fill in the details below</p>

          <form onSubmit={handleSubmit(handleRegister)}>
            <div class="form-group">
              <label>Full Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Full Name"
              />
              {errors.name && <p>{errors.name.message}</p>}
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            <div class="form-group">
              <label>Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter Password"
              />
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            <div class="form-group">
              <label>Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" class="btn">
              Register
            </button>

            <p class="login-text">
              Already have an account?
              <Link to="/login"> Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
export default Register;
