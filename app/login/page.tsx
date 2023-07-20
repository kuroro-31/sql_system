"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

import Logo from '@/components/atoms/Logo';
import { ErrorMessage } from '@/components/atoms/toast';
import { useStore } from '@/store';
import { users } from '@/types/userRoles';

// ログイン
const Login = () => {
  const router = useRouter();
  const { setLoggedIn, setUserId } = useStore();

  const [loading, setLoading] = useState(false);
  const [progressDisplay, setProgressDisplay] = useState("none");
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [buttonClass, setButtonClass] = useState("");

  const userIdRef = useRef<HTMLInputElement>(null);
  const [userIdValue, setUserIdValue] = useState("");
  const [userIdFocused, setUserIdFocused] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading) {
      setProgressDisplay("block");
      setOverlayVisible(false);
      setButtonClass("activeLoading");
    } else {
      setProgressDisplay("none");
      setOverlayVisible(true);
      setButtonClass("");
    }
  }, [loading]);

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ログイン処理
    const user = users.find(
      (user) =>
        user.id === userIdRef.current!.value &&
        user.password === passwordRef.current!.value
    );
    if (user) {
      // ログイン成功
      setLoggedIn(true);
      setUserId(user.id); // <-- Save the user's ID in the store
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id); // <-- Save the user's ID
      localStorage.setItem("userRole", user.role); // <-- Save the user's role
      router.push("/");
    } else {
      // ログイン失敗
      setErrorMessage("ユーザーIDまたはパスワードが間違っています");
    }

    // setLoading(false)の呼び出しを一定時間遅延させる
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 500ミリ秒後にsetLoading(false)を呼び出す
  };

  return (
    <div>
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      <div className="w-full h-screen flex justify-center items-center">
        <div className="relative sendFormBox w-full max-w-[450px] mx-4 md:mx-auto bg-white dark:bg-dark rounded-[17px] dark:lg:border-2 border-b-l-c dark:border-dark dark:lg:border-dark-1 overflow-hidden">
          {/* 送信中の背景 */}
          {loading && (
            <div
              id="overlay"
              className="fixed inset-0 bg-white z-[999] dark:bg-dark opacity-70"
            ></div>
          )}
          {/* プログレスバー */}
          {loading && (
            <div className="progress" style={{ display: progressDisplay }}>
              <div className="color"></div>
            </div>
          )}
          <div>
            <div className="flex justify-center mt-12 px-10">
              <Link
                href="/"
                className="flex-none md:overflow-hidden md:w-auto"
                passHref
              >
                <h1>
                  <Logo />
                </h1>
              </Link>
            </div>

            <p className="flex justify-center mt-2 text-xs text-[#959EA7]">
              Data Extraction Systems
            </p>
            <form
              onSubmit={onSubmit}
              id="sendForm"
              method="POST"
              action="/login"
              className="px-6 lg:px-10 dark:bg-dark pt-6"
            >
              {/* Email input */}
              <div className="relative mb-4">
                <input
                  ref={userIdRef}
                  id="userId"
                  type="text"
                  name="userId"
                  className={`input-field w-full p-4 border-transparent rounded-[12px] bg-white dark:bg-dark-1 focus:border-[2px] focus:border-primary transition-all ${
                    userIdValue && "has-value"
                  }`}
                  required
                  value={userIdValue}
                  onChange={(e) => setUserIdValue(e.target.value)}
                  onFocus={() => setUserIdFocused(true)}
                  onBlur={() => setUserIdFocused(false)}
                />
                <label
                  htmlFor="userId"
                  className={`label absolute top-[5px] left-[10px] text-gray-500 transition-all duration-200 dark:text-f5 ${
                    userIdValue || userIdFocused ? "label-focused" : ""
                  }`}
                >
                  User ID
                </label>
                <div className="border-wrapper absolute top-0 left-0 w-full h-full rounded pointer-events-none"></div>
              </div>
              {/* Password input */}
              <div className="relative mb-6">
                <input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  name="password"
                  className={`input-field w-full p-4 rounded-[12px] bg-white dark:bg-dark-1 focus:border-[2px] focus:border-primary transition-all ${
                    passwordValue && "has-value"
                  }`}
                  required
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <label
                  htmlFor="password"
                  className={`label absolute top-[5px] left-[10px] text-gray-500 transition-all duration-200 dark:text-f5 ${
                    passwordValue || passwordFocused ? "label-focused" : ""
                  }`}
                >
                  Passwords
                </label>
                <div className="border-wrapper absolute top-0 left-0 w-full h-full rounded pointer-events-none"></div>
              </div>
              <input type="hidden" name="remember" value="on" />
              <div className="w-full flex justify-end items-center pb-6 mb-6">
                <span className="relative">
                  <button type="submit" id="loginButton" className="btn">
                    Next
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
