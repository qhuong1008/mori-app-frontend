"use client";
import React, { useEffect } from "react";
import styles from "../../profile.module.scss";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBookFromLibrary,
  getBooksFromMyLibrary,
} from "@/app/redux/actions/myLibrary"; import { toast } from "react-toastify";
import ToastContainerWrapper from "@/components/ToastContainerWrapper/ToastContainerWrapper";
import {
  TableCell,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { getMembershipById } from "@/app/redux/actions/membership";
import { getReadHistory } from "@/app/redux/actions/book";
import * as types from "@/app/redux/types";
import { getPostByUserIdRequest } from "@/app/redux/saga/requests/post";
import { getUserTransactionsRequest } from "@/app/redux/saga/requests/transaction";
import FollowerModal from "@/components/Modals/FollowerModal/FollowerModal";
import FollowingModal from "@/components/Modals/FollowingModal/FollowingModal";
import { followUserRequest, isFollowingRequest, unfollowUserRequest } from "@/app/redux/saga/requests/follow";
import { getAccountByIdRequest } from "@/app/redux/saga/requests/account";
import UnfollowConfirmModal from "@/components/Modals/UnfollowConfirmModal/UnfollowConfirmModal";
import Loading from "@/components/Loading/Loading";

const Profile = () => {
  const params = useParams();
  const id = params.slug;
  const userId = params.id;
  const [currentTopic, setCurrentTopic] = useState(id);
  const [currentAccount, setCurrentAccount] = useState(null)
  const [user, setUser] = useState(null)
  const [postList, setPostList] = useState([]);
  const [isLoadingPostList, setIsLoadingPostList] = useState(false);
  const booksLibrary = useSelector((state) => state.myLibrary.bookList);
  const isLoading = useSelector((state) => state.myLibrary.loading);
  const dispatch = useDispatch();
  const { isOpen: isOpenFollower, onOpen: onOpenFollower, onOpenChange: onOpenChangeFollower } = useDisclosure();
  const { isOpen: isOpenFollowing, onOpen: onOpenFollowing, onOpenChange: onOpenChangeFollowing } = useDisclosure();
  const [isLoadingFollowRequest, setIsLoadingFollowRequest] = useState(false)
  const [isLoadingUnfollowRequest, setIsLoadingUnfollowRequest] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { isOpen: isOpenUnfollowConfirm, onOpen: onOpenUnfollowConfirm, onOpenChange: onOpenChangeUnfollowConfirm, onClose: onCloseChangeUnfollowConfirm } = useDisclosure();
  const handleFollowUser = () => {
    const request = {
      follower: currentAccount._id,
      following: userId
    }
    setIsLoadingFollowRequest(true)
    followUserRequest(request)
      .then((resp => {
        setIsLoadingFollowRequest(false)
        setIsFollowing(true)
      }))
  }
  const handleUnfollowUser = () => {
    const request = {
      follower: currentAccount._id,
      following: userId
    }
    setIsLoadingUnfollowRequest(true)
    unfollowUserRequest(request)
      .then(resp => {
        setIsLoadingUnfollowRequest(false)
        setIsFollowing(false)
      })

    onCloseChangeUnfollowConfirm()
  }


  const getPostData = () => {
    setIsLoadingPostList(true);
    getPostByUserIdRequest(user._id).then((resp) => {
      setPostList(resp.data);
    });
    setIsLoadingPostList(false);
  };

  const getUserData = () => {
    getAccountByIdRequest(userId)
      .then((resp) => {
        setUser(resp.account)
      })
  }
  const getIsFollowingData = () => {
    const request = {
      follower: currentAccount._id,
      following: userId
    }
    isFollowingRequest(request)
      .then(resp => {
        setIsFollowing(resp.message)
      })
  }

  useEffect(() => {
    if (user) {
      getPostData();
    }
  }, [user]);
  useEffect(() => {
    if (currentAccount) {
      getUserData()
      getIsFollowingData();

    }
  }, [currentAccount])
  useEffect(() => {
    setCurrentAccount(JSON.parse(localStorage.getItem("user")))
    dispatch(getBooksFromMyLibrary(userId));
  }, []);

  return (
    <div className={styles.profileContainer}>
      <Header />
      <div className={styles.profileContent}>
        <section className={styles.accountContainer}>
          <div className={styles.accountBody}>
            <div className={styles.accountAvatar}>
              {user?.avatar ? (
                <img
                  src={
                    user.avatar.includes("googleusercontent") ?
                      user.avatar
                      : `${types.BACKEND_URL}/api/accountimg/${user.avatar}`}
                  alt="avt"
                />
              ) : (
                <img
                  src="https://docsachhay.net/frontend/images/default-avatar.jpg"
                  alt="avt"
                />
              )}
            </div>
            <div className={styles.accountPanel}>
              <div className={styles.accountInfo}>
                <div className={styles.top}>
                  <div className={styles.title}>{user?.displayName}</div>
                  {
                    isFollowing ?
                      <Button color="primary" variant="flat" onPress={onOpenChangeUnfollowConfirm} >
                        {
                          isLoadingUnfollowRequest ?
                            <Spinner /> :
                            "Hủy theo dõi"
                        }
                      </Button> :
                      <Button color="primary" variant="flat" onClick={() => handleFollowUser()}>
                        {
                          isLoadingFollowRequest ?
                            <Spinner /> :
                            "Theo dõi"
                        }
                      </Button>
                  }
                </div>

                <div className={styles.followInfo}>
                  <div className={styles.followItem} onClick={() => onOpenFollower()}>
                    <span>245 </span>
                    Người theo dõi
                  </div>
                  <div className={styles.followItem} onClick={() => onOpenFollowing()}>
                    <span>245 </span>
                    Đang theo dõi
                  </div>
                  <div className={styles.followItem}>
                    <span>245 </span>
                    Bài viết
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.accountNav}>
            <div
              className={`${styles.navItem} ${currentTopic === "profile" ? styles.active : ""
                }`}
            >
              <Link href={`/user/${userId}/profile`}>Thông tin cá nhân</Link>
            </div>
            <div
              className={`${styles.navItem} ${currentTopic === "library" ? styles.active : ""
                }`}
            >
              <Link href={`/user/${userId}/library`}>Thư viện</Link>
            </div>
            <div
              className={`${styles.navItem} ${currentTopic === "my-post" ? styles.active : ""
                }`}
            >
              <Link href={`/user/${userId}/my-post`}>Bài viết</Link>
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
                    <TableCell>{user?.displayName}</TableCell>
                  </TableRow>
                  <TableRow key="2">
                    <TableCell>Email</TableCell>
                    <TableCell>{user?.email}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

          </section>
        ) : (
          <></>
        )}
        {currentTopic == "my-post" ? (
          <section className={styles.myPostInfo}>
            <div className={styles.uHead}>
              <div className={styles.title}>Bài viết</div>
            </div>
            <div className={styles.uTable}>
              <div className={styles.myPostList}>
                {isLoadingPostList ? (
                  <isLoading />
                ) : (
                  <>
                    {postList.length === 0 ? (
                      <div>Chưa có bài viết.</div>
                    ) : (
                      postList.map((post) => (
                        <Link href={`/post/${post._id}`} prefetch={false} >
                          <div className={styles.postItem}>
                            <img
                              className={styles.imgPost}
                              src={
                                post?.image
                                  ? `${types.BACKEND_URL}/api/postimg/${post?.image}`
                                  : tempImg
                              }
                              alt="main post img"
                            />
                            <div className={styles.postTitle}>{post.title}</div>
                          </div>
                        </Link>
                      ))
                    )}
                  </>
                )}
                {/* <div className={styles.postItem}>
                  <Image src={bookImg} alt="post img" />
                  <div className={styles.postTitle}>title</div>
                </div>
                <div className={styles.postItem}>
                  <Image src={bookImg} alt="post img" />
                  <div className={styles.postTitle}>title</div>
                </div> */}
              </div>
            </div>
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
                            src={`${types.BACKEND_URL}/api/bookimg/${book.book.image}`}
                            alt="image"
                            className={styles.bookLibImg}
                          />
                        </td>
                        <td class="border-b text-center border-gray-400 px-4 py-2 max-w-200">
                          <Link
                            href={`/${getBookType(book.book)}/${book.book._id}`}
                            prefetch={false}
                            shallow
                          >
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

      </div>
      <Footer />
      <ToastContainerWrapper />
      <FollowerModal isOpen={isOpenFollower} onOpenChange={onOpenChangeFollower} />
      <FollowingModal isOpen={isOpenFollowing} onOpenChange={onOpenChangeFollowing} />
      <UnfollowConfirmModal isOpen={isOpenUnfollowConfirm}
        onOpenChange={onOpenChangeUnfollowConfirm}
        handleUnfollowUser={handleUnfollowUser}
        user={user} />

    </div>
  );
};

export default Profile;