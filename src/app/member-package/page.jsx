"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./member-package.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading/Loading";
import * as request from "../redux/saga/requests/membership";
import { Toaster, toast } from "react-hot-toast";

const MemberPackage = () => {
  const router = useRouter();
  const [membertype, setMembertype] = useState(null);
  const [user, setUser] = useState("");
  const [membershipTypes, setMembershipTypes] = useState(0);
  let currentAccount = user;

  const redirectLogin = () => {
    currentAccount = user;
    if (!currentAccount) {
      router.push("/login");
    }
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();
    return `${year}-${month + 1}-${day}`;
  };
  const getExpiredDate = () => {
    const currentDate = new Date();
    const expiredDate = new Date(currentDate);
    // define when expire date is on and calculate
    if (membertype === "year") expiredDate.setDate(currentDate.getDate() + 365);
    else if (membertype === "3month")
      expiredDate.setDate(currentDate.getDate() + 90);
    else if (membertype === "1month")
      expiredDate.setDate(currentDate.getDate() + 30);

    // transfer date to yy-mm-dd type
    const year = expiredDate.getFullYear();
    const month = expiredDate.getMonth();
    const day = expiredDate.getDate();
    return `${year}-${month + 1}-${day}`;
  };
  const currentDate = new Date(getCurrentDate());
  const expiredDate = new Date(getExpiredDate()); // Set the expire date

  const handleMemberRegisterBtnOnclick = () => {
    redirectLogin();

    // if (currentDate < expiredDate) {
    //   toast.error(
    //     "Đăng kí gói cước thất bại, vui lòng sử dụng hết gói cước đã đăng kí!"
    //   );
    //   console.log("The expiration date is still valid."); // Perform actions for a valid date
    // }
    // else
    if (membertype) {
      const membership = {
        user: currentAccount._id,
        type: membertype,
        start_date: getCurrentDate(),
        outdated_on: getExpiredDate(),
      };

      let price = 0;
      var type = null;
      let productId = null;
      let description = ""
      membershipTypes.map((membershipType) => {
        if (membershipType.name == membertype) {
          price = membershipType.price;
          description = membershipType.description;
          productId = membershipType._id;
        }
      });
      var type = "Membership";
      var payment = {
        price: price,
        description: description,
        type: type,
        productId: productId,
      };
      localStorage.setItem("payment", JSON.stringify(payment));

      localStorage.setItem("membership", JSON.stringify(membership));

      router.replace("/payment", undefined, { shallow: true });
      // handleRegisterMembership(membership)
    }
  };
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    request.getAllMembershipTypeRequest().then((res) => {
      setMembershipTypes(res.membershipTypes);
    });
  }, []);

  return (
    <div className={styles.memberPackContainer}>
      <Header />
      <div className={styles.memberPackContent}>
        <div className={styles.banner}>
          <div className={styles.container}>
            <div className={styles.bannerContent}>
              <div className={styles.left}>
                <div className={styles.title}>Website đọc sách online</div>
                <div className={styles.subTitle}>
                  #1 Việt Nam về sách đọc, sách nói
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.banner1}>
                  <img
                    src="https://moristorage123.blob.core.windows.net/bookimg/banner1.webp"
                    alt="banner1"
                  />
                </div>
                <div className={styles.banner2}>
                  <img
                    src="https://moristorage123.blob.core.windows.net/bookimg/banner2.webp"
                    alt="banner2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.packageList}>
          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>Gói năm</div>
              <div className={styles.bestPrice}>Giá tốt nhất</div>
            </div>
            <div className={styles.mainPrice}>899.000 ₫/Năm</div>
            <div className={styles.eachMonth}>(Chỉ còn 75.000 ₫ mỗi tháng)</div>
            <div
              className={styles.registerBtn}
              onClick={() => {
                setMembertype("year");
                handleMemberRegisterBtnOnclick();
              }}
            >
              Mua gói năm
            </div>
          </div>

          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>Gói 3 tháng</div>
            </div>
            <div className={styles.mainPrice}>249.000 ₫/3 tháng</div>
            <div className={styles.eachMonth}>(Chỉ còn 83.000 ₫ mỗi tháng)</div>
            <div
              className={styles.registerBtn}
              onClick={() => {
                setMembertype("3month");
                handleMemberRegisterBtnOnclick();
              }}
            >
              Mua gói 3 tháng
            </div>
          </div>
          <div className={styles.packageItem}>
            <div className={styles.titleWrapper}>
              <div className={styles.title}>Gói tháng</div>
            </div>
            <div className={styles.mainPrice}>99.000 ₫/Tháng</div>
            <div className={styles.eachMonth}></div>
            <div
              className={styles.registerBtn}
              onClick={() => {
                setMembertype("1month");
                handleMemberRegisterBtnOnclick();
              }}
            >
              Mua gói tháng
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};
export default MemberPackage;
