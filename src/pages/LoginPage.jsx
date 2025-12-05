import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Imports
import logo from "../assets/images/logo.svg";
import heroImg from "../assets/images/heroimg.png";
import idIcon from "../assets/icons/id.svg";
import passIcon from "../assets/icons/password.svg";

const LoginPage = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) console.log("✅ Logged in:", data.session.user.email);
    };
    checkSession();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!studentId || !password) return alert("Please fill in all fields.");

    try {
      setLoading(true);
      const emailToAuth = `${studentId}@tup.edu.ph`;
      const { error } = await supabase.auth.signInWithPassword({
        email: emailToAuth,
        password: password,
      });
      if (error) throw error;
    } catch (error) {
      alert("Login Failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex-col font-sans">
      {/* BRANDING: Gradient using #759CE6 (Blue) -> #887AB8 (Purple) -> #22162E (Dark) */}
      <div className="h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-[#759CE6] via-[#887AB8] to-[#22162E]">
        {/* Section 1: Logo & Hero */}
        <section className="w-full h-1/2 lg:h-full lg:w-1/2 flex flex-col justify-center items-center pt-10 lg:pt-0">
          <img
            src={logo}
            alt="Logo"
            className="h-[120px] mb-[-30px] ml-[-30px] "
          />
          <p className="text-center w-[250px] mt-2 text-[#F4F5F4] text-[14px]">
            The TUP-Manila Compass Voting System
          </p>
          <img src={heroImg} alt="Hero" className="h-[270px] mt-4" />
        </section>

        {/* Section 2: Form */}
        <section className="flex flex-col items-center w-full h-full lg:h-full lg:w-1/2 rounded-t-[20px] lg:rounded-t-none lg:rounded-l-[20px] bg-[#F4F5F4] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] lg:shadow-none mt-4 pb-10 lg:mt-0 lg:pb-0 lg:justify-center">
          <h1 className="font-bold text-[28px] mt-8 lg:mt-0 text-[#22162E]">
            Login Account
          </h1>
          <p className="text-[12px] w-[300px] text-center text-[#626672] font-medium">
            Login using your TUPM ID and password to cast your vote
          </p>

          <form
            onSubmit={handleLogin}
            className="flex flex-col w-full items-center mt-10 gap-4"
          >
            <label
              htmlFor="tupId"
              className="flex flex-col text-[14px] font-semibold text-[#433A58]"
            >
              <div className="flex items-center mb-1">
                <img src={idIcon} alt="" className="h-[20px]" />
                <p className="ml-1">TUP-ID:</p>
              </div>
              <input
                type="text"
                className="w-[320px] h-[40px] p-2 bg-white rounded-[8px] border border-[#B3A3DB] focus:outline-none focus:ring-2 focus:ring-[#759CE6] font-normal transition-all"
                name="tupId"
                placeholder="TUPM-XX-XXXX"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.trim())}
              />
            </label>
            <label
              htmlFor="password"
              className="flex flex-col text-[14px] font-semibold text-[#433A58]"
            >
              <div className="flex items-center mb-1">
                <img src={passIcon} alt="passIcon" className="h-[20px]" />
                <p className="ml-1">Password:</p>
              </div>
              <input
                type="password"
                className="w-[320px] h-[40px] p-2 bg-white rounded-[8px] border border-[#B3A3DB] focus:outline-none focus:ring-2 focus:ring-[#759CE6] font-normal transition-all"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {/* BRANDING: Button uses Dark Purple #433A58 with hover to #887AB8 */}
            <button
              type="submit"
              disabled={loading}
              className="w-[320px] h-[40px] mt-[30px] bg-[#2f283d] hover:bg-[#443a59] font-semibold rounded-[8px] text-[#F4F5F4] disabled:opacity-70 transition-all shadow-md cursor-pointer"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
