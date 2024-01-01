"use client";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./login.module.scss";
import { UserAuth } from "@/app/context/AuthContext";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import {
  createAccountRequest,
  getCurrentAccountRequest,
  loginAccountRequest,
} from "../redux/saga/requests/account";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { forgetPasswordRequest } from "../redux/saga/requests/auth";
import { useRouter } from "next/navigation";

const Login = () => {
  const { user, googleSignIn } = UserAuth();
  const [authenticated, setAuthenticated] = useState(null);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState("");
  const handleForgetPassword = () => {
    if (email === "") {
      toast.error("Vui lòng nhập email!", {
        duration: 2000,
        position: "top-center",
      });
    } else {
      toast.promise(
        new Promise((resolve, reject) => {
          forgetPasswordRequest(email).then((resp) => {
            if (resp.message) {
              resolve("Password reset email sent!");
            }
            if (resp.error) {
              reject(new Error(resp.error));
            }
          });
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error.message,
        }
      );
    }
  };

  async function handleSignInGoogle() {
    try {
      const googleLogin = await googleSignIn();
    } catch (err) {
      toast(err, {
        autoClose: 2000,
        type: "error",
      });
      console.log("err:", err);
    }
  }

  const handleSignInKeyPressed = (e) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  const handleSignIn = () => {
    console.log("handleSignIn")
    if (username == "" || password == "") {
      toast.error("Vui lòng nhập đủ thông tin!", {
        duration: 2000,
        position: "top-center",
      });
    } else {
      const account = {
        username: username,
        password: password,
      };
      toast.promise(
        new Promise((resolve, reject) => {
          loginAccountRequest(account).then((resp) => {
            if (resp.message) {
              // Kiểm tra account có bị khóa không
              if (resp.user.is_blocked) {
                reject(new Error("Tài khoản này đã bị khóa!"));
              }
              // trường hợp account không bị khóa
              else {
                // trường hợp account là user
                resolve("Đăng nhập thành công!");
                localStorage.setItem("authenticated", true);
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    _id: resp.user._id,
                    username: resp.user.username,
                    email: resp.user.email,
                    displayName: resp.user.displayName,
                    phoneNumber: resp.user.phoneNumber,
                    avatar: resp.user.avatar,
                  })
                );
                router.replace("/")
              }

            } else {
              reject(resp.error);
            }
          });
        }),
        {
          loading: "Processing...",
          success: (message) => message,
          error: (error) => error,
        }
      );
    }
  };
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(localStorage.getItem("authenticated"));
  }, []);
  useEffect(() => {
    if (authenticated) {
      const currentAccount = JSON.parse(localStorage.getItem("user"));
      if (currentAccount.is_blocked) {
        toast.error("Tài khoản này đã bị khóa!")
      }
      else {
        router.replace("/")
      }

    }
  }, [authenticated]);

  useEffect(() => {
    getUserInfo();
  }, [user]);
  const getUserInfo = useCallback(() => {
    if (user) {

      let newAccount = {
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL,
      };
      createAccountRequest(newAccount).then(() => {
        getCurrentAccountRequest(newAccount).then((res) => {
          localStorage.setItem("user", JSON.stringify(res.account));
          localStorage.setItem("authenticated", true);
          setAuthenticated(localStorage.getItem("authenticated"));
        });
      });
    }
  }, [user]);

  return (
    <>
      <Toaster />
      <div className={styles.div}>
        <div className={styles.div2}>
          <div className={styles.column}>
            <div className={styles.div3}>
              <div className={styles.div4}>WELCOME BACK!</div>
              <div className={styles.div5}>
                {/* <span style="font-family: Nunito, sans-serif;font-weight: 400;color: rgba(68,75,89,1);"> */}
                <span style={{ fontWeight: 400 }}>Don’t have a account, </span>
                {/* <span style="font-family: Nunito, sans-serif;font-weight: 700;color: rgba(134,153,218,1);"> */}
                <span style={{ fontWeight: 700 }}>
                  <Link href="/signup" shallow>Sign up</Link>
                </span>
              </div>
              <div className={styles.div6}>Username</div>
              <input
                className={styles.div7}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className={styles.div8}>Password</div>
              <input
                className={styles.div9}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => handleSignInKeyPressed(e)}
              />

              <div className={styles.div10}>
                {/* <div className={styles.div11}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4d20115-4868-4942-8cf0-45ffa39454e5?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-3"
                  />
                  <div className={styles.div12}>Remember me</div>
                </div> */}
                <div className={styles.div13} onClick={onOpen}>
                  Forget password?
                </div>
              </div>
              <div className={styles.div14} onClick={() => handleSignIn()}>
                Sign In
              </div>
              <div className={styles.div15}>or continue with</div>
              <div className={styles.div16}>
                <div
                  className={styles.div17}
                  onClick={() => handleSignInGoogle()}
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/20c6afde-fdd2-4e57-8fa6-84b8e4a20add?apiKey=169beee3f9a4440abbde404efbae6ea9&"
                    className="img-4"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.column2}>
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/9160662d-4c53-43e4-a79e-50fd37d07fd2?apiKey=169beee3f9a4440abbde404efbae6ea9&"
              className="img-7"
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Tìm email của bạn
              </ModalHeader>
              <ModalBody>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  onClick={handleForgetPassword}
                >
                  Reset password
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
