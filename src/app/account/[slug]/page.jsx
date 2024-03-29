"use client";
import React, { useEffect } from "react";
import styles from "../profile.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBookFromLibrary,
  getBooksFromMyLibrary,
} from "@/app/redux/actions/myLibrary";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";
import ToastContainerWrapper from "@/components/ToastContainerWrapper/ToastContainerWrapper";
import {

  TableCell,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,

} from "@nextui-org/react";
import { getMembershipById } from "@/app/redux/actions/membership";
import { getReadHistory } from "@/app/redux/actions/book";

const Profile = () => {
  const params = useParams();
  const id = params.slug;
  const [currentTopic, setCurrentTopic] = useState(id);
  const booksLibrary = useSelector((state) => state.myLibrary.bookList);
  const bookLoading = useSelector((state) => state.books.loading);
  const readHistory = useSelector((state) => state.books.readHistory);
  const isLoading = useSelector((state) => state.myLibrary.loading);
  const currentAccount = JSON.parse(localStorage.getItem("user"));
  const deleteBookResult = useSelector((state) => state.myLibrary.message);
  const membership = useSelector((state) => state.memberships.membership);
  const isLoadingMembership = useSelector((state) => state.memberships.loading);
  const [click, setClick] = useState(0);
  const dispatch = useDispatch();


  const handleDeleteBook = (choosenBook) => {
    var request = {
      user: currentAccount._id,
      book: choosenBook,
    };
    dispatch(deleteBookFromLibrary(request));
    if (deleteBookResult === 0) {
      toast("Xoá sách khỏi thư viện thành công!", {
        autoClose: 2000,
        type: "success",
      });
    }
    if (deleteBookResult === 1) {
      toast("Xóa thất bại!", {
        autoClose: 2000,
        type: "error",
      });
    }
    setClick((p) => p + 1);
  };

  if (!currentAccount) {
    redirect("/login");
  }

  useEffect(() => {
    dispatch(getMembershipById(currentAccount._id));
    dispatch(getReadHistory(currentAccount._id));
  }, []);

  useEffect(() => {
    dispatch(getBooksFromMyLibrary(currentAccount._id));
  }, [click]);
  return (
    <div className={styles.profileContainer}>
      <Header />
      <div className={styles.profileContent}>
        <section className={styles.accountContainer}>
          <div className={styles.accountBody}>
            <div className={styles.accountAvatar}>
              {currentAccount.avatar ? (
                <img src={currentAccount.avatar} alt="avt" />
              ) : (
                <img
                  src="https://docsachhay.net/frontend/images/default-avatar.jpg"
                  alt="avt"
                />
              )}
            </div>
            <div className={styles.accountPanel}>
              <div className={styles.accountInfo}>
                <div className={styles.title}>{currentAccount.displayName}</div>
                <div className={styles.auth}>
                  <div className={styles.type}>
                    <span class="svg-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          opacity="0.3"
                          d="M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2C17.5 2 22 6.5 22 12ZM12 7C10.3 7 9 8.3 9 10C9 11.7 10.3 13 12 13C13.7 13 15 11.7 15 10C15 8.3 13.7 7 12 7Z"
                          fill="black"
                        ></path>
                        <path
                          d="M12 22C14.6 22 17 21 18.7 19.4C17.9 16.9 15.2 15 12 15C8.8 15 6.09999 16.9 5.29999 19.4C6.99999 21 9.4 22 12 22Z"
                          fill="black"
                        ></path>
                      </svg>
                    </span>
                    Người đọc
                  </div>
                  <div class={styles.email}>
                    <span class="svg-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          opacity="0.3"
                          d="M21 19H3C2.4 19 2 18.6 2 18V6C2 5.4 2.4 5 3 5H21C21.6 5 22 5.4 22 6V18C22 18.6 21.6 19 21 19Z"
                          fill="black"
                        ></path>
                        <path
                          d="M21 5H2.99999C2.69999 5 2.49999 5.10005 2.29999 5.30005L11.2 13.3C11.7 13.7 12.4 13.7 12.8 13.3L21.7 5.30005C21.5 5.10005 21.3 5 21 5Z"
                          fill="black"
                        ></path>
                      </svg>
                    </span>
                    {currentAccount.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.accountNav}>
            <div className={styles.navItem}>
              <Link href="/account/profile">Thông tin cá nhân</Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/account/library">Thư viện của tôi</Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/account/history">Lịch sử đọc </Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/account/membership">Thông tin hội viên</Link>
            </div>
          </div>
        </section>
        {/* profile section */}
        {currentTopic == "profile" ? (
          <section className={styles.profileInfo}>
            <div className={styles.uHead}>
              <div className={styles.title}>Thông tin cá nhân</div>
            </div>
            <div className={styles.uTable}>
              <Table hideHeader aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn></TableColumn>
                  <TableColumn></TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>Họ tên</TableCell>
                    <TableCell>{currentAccount.displayName}</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Email</TableCell>
                    <TableCell>{currentAccount.email}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {/* <Toaster/> */}
            {currentAccount.username && (
              <Link href="/change-password">
                <button className={styles.changePasswordButton}>
                  Thay đổi mật khẩu
                </button>
              </Link>
            )}
            {/* <Toaster/> */}
          </section>
        ) : (
          <></>
        )}
        {/* library section */}
        {currentTopic == "library" ? (
          <section className={styles.profileInfo}>
            <div className={styles.libraryHead}>
              <div className={styles.title}>Tiêu đề sách, truyện</div>
              {/* <div className="flex flex-wrap gap-4">
              <Tabs variant="solid" color="primary" aria-label="Tabs variants">
                <Tab key="sachdangdoc" title="Sách đang đọc" />
                <Tab key="sachyeuthich" title="Sách yêu thích" />
              </Tabs>
            </div> */}
            </div>
            <div className={styles.libraryBody}>
              <table class="table-auto w-full">
                <thead class="bg-slate-300">
                  <tr>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Book
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Name
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Author
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <Loading />
                  ) : (
                    booksLibrary.map((book) => (
                      <tr>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <img
                            src={book.book.image}
                            alt="image"
                            className={styles.bookLibImg}
                          />
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-200">
                          <Link href={`/book/${book.book._id}`}>
                            {book.book.name}
                          </Link>

                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {book.book.author}
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            class="cursor-pointer"
                            width={20}
                            onClick={() => handleDeleteBook(book.book)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <></>
        )}
        {/* history section */}
        {currentTopic == "history" ? (
          <section className={styles.profileInfo}>
            <div className={styles.historyHead}>
              <div className={styles.title}>
                Danh sách sách, truyện bạn đã đọc{" "}
              </div>
            </div>

            <div className={styles.libraryBody}>
              <table class="table-auto w-full">
                <thead class="bg-slate-300">
                  <tr>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Book
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Name
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Author
                    </th>
                    <th class="bg-gray-200 border-b border-gray-400 px-4 py-2">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!readHistory ? (
                    <Loading />
                  ) : (
                    readHistory.map((book) => (
                      <tr>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          <img
                            src={book.book.image}
                            alt="image"
                            className={styles.bookLibImg}
                          />
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-200">
                          <Link href={`/book/${book.book._id}`}>
                            {book.book.name}
                          </Link>
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {book.book.author}
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-100">
                          {book.time}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <></>
        )}
        {/* membership section */}
        {currentTopic == "membership" ? (
          <section className={styles.profileInfo}>
            <div className={styles.uHead}>
              <div className={styles.title}>Thông tin hội viên</div>
            </div>
            {!membership ? (
              <>Người dùng chưa đăng kí gói hội viên!</>
            ) : (
              <div className={styles.uTable}>
                {isLoadingMembership ? (
                  <Loading />
                ) : (
                  <Table
                    hideHeader
                    aria-label="Example static collection table"
                  >
                    <TableHeader>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                    </TableHeader>

                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Họ tên</TableCell>
                        <TableCell>{currentAccount.displayName}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Gói hội viên</TableCell>
                        <TableCell>
                          {membership.type === "1month" ? "Gói 1 tháng" : ""}
                          {membership.type === "year" ? "Gói năm" : ""}
                          {membership.type === "3month" ? "Gói 3 tháng" : ""}
                        </TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Ngày đăng kí</TableCell>
                        <TableCell>{membership.start_date}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Ngày hết hạn</TableCell>
                        <TableCell>{membership.outdated_on}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </section>
        ) : (
          <></>
        )}
      </div>
      <Footer />
      <ToastContainerWrapper />
    </div>
  );
};

export default Profile;
