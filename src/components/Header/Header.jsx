"use client"
import React, { useEffect } from 'react'
import styles from "./Header.module.scss"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import logo from '../../../public/logo-nobg.png'
import { useState } from 'react'
import { searchBooks, getBooksByCate } from '@/app/redux/actions/book'
import { useDispatch } from 'react-redux'
import { faBars, faBell, faCircle, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons'
import { getBookCategoryRequest } from '@/app/redux/saga/requests/category'
import { googleLogout } from '@react-oauth/google';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react";
import { ListboxWrapper } from '../ListboxWrapper/ListboxWrapper'
import { ListboxProfileWrapper } from '../ListboxWrapper/ListboxProfileWrapper'
import { getNotificationsRequest, markNotificationaAsReadRequest, markAllNotificationaAsReadRequest } from '@/app/redux/saga/requests/notification'
import * as timeUtils from '../../utils/timeUtils'
import * as types from "@/app/redux/types"
import { toast, Toaster } from 'react-hot-toast'

const Header = () => {
  const dispatch = useDispatch()
  const [isOpenListbox, setIsOpenListbox] = useState(false)
  const [isOpenMenuList, setIsOpenMenuList] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [categories, setCategories] = useState(null)
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("")
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  const getNotificationsData = () => {
    getNotificationsRequest(currentAccount._id)
      .then(resp => {
        setNotifications([...resp.data].reverse())
      })
  }
  const handleMarkAllAsRead = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        markAllNotificationaAsReadRequest(currentAccount._id)
          .then((resp) => {
            markAllNotificationaAsReadRequest
            if (resp.message) {
              resolve(resp.message);
            } else {
              reject(resp.error);
            }
          })
          .catch((err) => {

          });
      }),
      {
        loading: "Processing...",
        success: (message) => message,
        error: (error) => error,
      }
    );
    getNotificationsData()
  }
  useEffect(() => {
    if (currentAccount) {
      getNotificationsData()
    }
  }, [currentAccount])
  useEffect(() => {
    setCurrentAccount(JSON.parse(localStorage.getItem("user")))
  }, [])
  const handleOpenMenu = async () => {
    setIsOpenListbox(p => !p)

    return new Promise((resolve, reject) => {
      getBookCategoryRequest()
        .then(res => {
          setCategories(res.bookCategories);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  const handleSignOut = async () => {
    googleLogout();
    setAuthenticated(null)
    localStorage.removeItem("user")
    window.location.replace("/login", undefined, { shallow: true })
  }
  const handleMarkAsRead = (id) => {
    markNotificationaAsReadRequest(id).then(resp => {
    })
  }

  useEffect(() => {
    setAuthenticated(localStorage.getItem("user"))
  }, [])
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  useEffect(() => {
    const unreadCount = notifications.filter(noti => !noti.isRead).length;
    setUnreadNotificationCount(unreadCount);
  }, [notifications]);
  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div className={styles.menuLaptop}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <Image src={logo} width={120} height={120} onClick={() => router.push("/")} />
            </div>
            <div className={styles.searchBarContainer}>
              <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...'
                onChange={(e) => setSearchValue(e.target.value)} />
              <Link href={`/search/${searchValue}`} prefetch={false}>
                <button onClick={() => { dispatch(searchBooks(searchValue)) }}>
                  Tìm kiếm
                </button>
              </Link>
            </div>

          </div>

          {authenticated ? (<>
            <Link className={styles.right} href={"/member-package"} prefetch={false}>
              <div className={styles.memberRegisterBtn}>
                Tham gia hội viên
              </div>
            </Link>
            <div className={styles.right} >
              <div className={styles.right}>
                {unreadNotificationCount > 0 && (
                  <div className={styles.notificationCount}>
                    {unreadNotificationCount}
                  </div>
                )}
                <div
                  className={styles.notificationBtn}
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    setIsNotificationMenuOpen(p => !p);
                  }}
                >
                  <FontAwesomeIcon icon={faBell} />
                </div>
              </div>
              <div className={styles.accountAvt}
                onClick={() => {
                  setIsNotificationMenuOpen(false);
                  setIsAccountMenuOpen(p => !p)
                }}
              >
                <img src={currentAccount.avatar.includes("googleusercontent") ?
                  currentAccount.avatar
                  : `${types.BACKEND_URL}/api/accountimg/${currentAccount.avatar}`}
                  alt="avt" />
              </div>
              {isAccountMenuOpen && <div className={styles.menuAccount}>
                <ListboxProfileWrapper>
                  <Listbox variant="flat" aria-label="Listbox menu with sections">
                    <ListboxItem
                      key="new"
                      startContent={<FontAwesomeIcon icon={faUser} />}
                      onClick={() => router.replace("/account/profile", undefined, { shallow: true })}
                    >
                      Tài khoản của tôi
                    </ListboxItem>
                    <ListboxItem
                      key="new"
                      startContent={<FontAwesomeIcon icon={faSignOut} />}
                      onClick={() => handleSignOut()}
                    >
                      Đăng xuất
                    </ListboxItem>

                  </Listbox>
                </ListboxProfileWrapper>
              </div>}

              {currentAccount && isNotificationMenuOpen && <div className={styles.menuNotification}>
                <ListboxWrapper >
                  <Listbox variant="flat" aria-label="Listbox menu with sections"
                    className={"max-h-80 overflow-y-scroll"}
                    topContent={<div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>Thông báo</div>
                      <div
                        style={{
                          fontWeight: "normal",
                          fontSize: "0.8rem",
                          paddingTop: "20px",
                          color: "rgb(4, 81, 247)"
                        }}
                        onClick={() => handleMarkAllAsRead()}
                      >Đánh dấu tất cả đã đọc</div>
                    </div>}>
                    <ListboxSection>
                      {notifications.length == 0 ? (
                        <ListboxItem key="new">Bạn chưa có thông báo nào.</ListboxItem>
                      ) : (
                        notifications.map((noti) => {
                          const isPerformedByDeleted = !noti.performedBy; // Kiểm tra xem performedBy có tồn tại hay không
                          const isPostDeleted = !noti.post; // Kiểm tra xem post có tồn tại hay không
                          const isReadingGoalDeleted = !noti.readingGoal; // Kiểm tra xem readingGoal có tồn tại hay không

                          return (
                            <ListboxItem
                              key={noti._id}
                              onClick={() => {
                                if (!noti.isRead) handleMarkAsRead(noti._id);
                                if (!isPostDeleted && (noti.action === "comment" || noti.action === "like" || noti.action === "share" || noti.action === "comment_approved" || noti.action === "comment_disapproved")) {
                                  router.replace(`/post/${noti.post._id}`, undefined, { shallow: true });
                                }
                                if (!isReadingGoalDeleted && noti.action === "readingGoal") {
                                  router.replace(`/reading-milestone-reached/${noti.readingGoal}`);
                                }
                              }}
                            >
                              <div className="flex gap-2 justify-between items-center">
                                <div className="flex gap-2 items-center">
                                  <Avatar
                                    alt="avt"
                                    className="flex-shrink-0"
                                    size="sm/[20px]"
                                    src={
                                      isPerformedByDeleted ? null : (noti.performedBy.avatar.includes("googleusercontent")
                                        ? noti.performedBy.avatar
                                        : `${types.BACKEND_URL}/api/accountimg/${noti.performedBy.avatar}`)
                                    }
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm/[17px] font-medium ">
                                      {noti.action === "comment" ||
                                        noti.action === "like" ||
                                        noti.action === "share"
                                        ? isPerformedByDeleted
                                          ? "Tài khoản đã bị xóa"
                                          : noti.performedBy.displayName
                                        : noti.action === "readingGoal"
                                          ? "Mục tiêu đọc sách"
                                          : noti.action === "voucher"
                                            ? "Voucher giảm giá"
                                            : noti.action === "membership"
                                              ? "Hội viên sắp hết hạn"
                                              : "Kiểm duyệt bình luận"}
                                    </span>
                                    <span className={`text-sm/[15px] ${noti.isRead ? "font-light" : "font-normal"} max-w-[230px] overflow-hidden whitespace-normal`} style={{ maxHeight: "46px" }}>
                                      {noti.action === "like" ? "Đã thích bài viết của bạn." :
                                        noti.action === "share" ? "Đã chia sẻ bài viết của bạn." :
                                          noti.action === "comment" ? `Đã bình luận bài viết của bạn: ${noti.message}` :
                                            noti.message}
                                    </span>
                                    <span className='text-sm/[12px] text-sky-600 font-medium my-1'>
                                      {timeUtils.getTimeElapsed(noti.createdAt)}
                                    </span>
                                  </div>
                                </div>
                                {!noti.isRead && <FontAwesomeIcon className={styles.newNotiIcon} icon={faCircle} />}
                              </div>
                            </ListboxItem>
                          );
                        })
                      )}
                    </ListboxSection>

                  </Listbox>
                </ListboxWrapper>
              </div>}
            </div>
          </>)
            : (
              <>
                <Link className={styles.right} href={"/member-package"} prefetch={false}>
                  <div className={styles.memberRegisterBtn}>
                    Tham gia hội viên
                  </div>
                </Link>
                <Link className={styles.right} href={"/login"} prefetch={false}>
                  Login
                </Link>
              </>
            )
          }
        </div>

        <div className={styles.menuMobile}>
          <div className={styles.menuWrapper}>
            <div className={styles.left}>
              <div className={styles.logo}>
                <Image src={logo} width={120} height={120} onClick={() => router.push("/")} />
              </div>
              <div className={styles.searchBarContainer}>
                <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...'
                  onChange={(e) => setSearchValue(e.target.value)} />
                <Link href="/search" prefetch={false}>
                  <button onClick={() => { dispatch(searchBooks(searchValue)) }}>
                    Tìm kiếm
                  </button>
                </Link>
              </div>
              <div className={styles.searchBarContainer}>
                <input type="search" name="query" placeholder="Search Components" required="required" className="flex-1 h-10 px-4 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none lg:h-12 dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0" />
                <button type="submit" className="flex items-center justify-center w-full p-2 m-1 text-white transition-colors duration-300 transform rounded-lg lg:w-12 lg:h-12 lg:p-0 bg-primary hover:bg-primary/70 focus:outline-none focus:bg-primary/70"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
              </div>
            </div>
            <div className={styles.right}>
              <FontAwesomeIcon className={styles.menu} icon={faBars} onClick={() => setIsOpenMenuList(p => !p)} />
            </div>

          </div>
          {isOpenMenuList ? <div className={styles.menuList}>
            {authenticated ? <>
              <div className={styles.menuItem}>
                Danh mục
              </div>
              <div className={styles.menuItem}>
                <Link href="/book" prefetch={false}>
                  Sách đọc
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/audio-book" prefetch={false}>
                  Sách nói
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/ranking/sachdoc" prefetch={false}>
                  Bảng xếp hạng
                </Link>
              </div>
              <div className={styles.menuItem}>
                <Link href="/community" prefetch={false}>
                  Review sách
                </Link>
              </div>
              <div className={styles.menuItem} >
                <Link href={"/account/profile"} prefetch={false}>
                  Tài khoản của tôi
                </Link>
              </div>
              <div className={styles.menuItem} onClick={handleSignOut}>
                Đăng xuất
              </div>
              <div className={styles.menuItem} >
                <Link className={styles.right} href={"/member-package"} prefetch={false}>
                  <div className={styles.memberRegisterBtn}>
                    Tham gia hội viên
                  </div>
                </Link>
              </div>
            </>
              :
              <>
                <div className={styles.menuItem}>
                  Danh mục
                </div>
                <div className={styles.menuItem}>
                  <Link href="/book" prefetch={false}>
                    Sách đọc
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/audio-book" prefetch={false}>
                    Sách nói
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/ranking/sachdoc" prefetch={false}>
                    Bảng xếp hạng
                  </Link>
                </div>
                <div className={styles.menuItem}>
                  <Link href="/community" prefetch={false}>
                    Review sách
                  </Link>
                </div>
                <div className={styles.menuItem} >
                  <Link href={"/login"} prefetch={false}>
                    Đăng nhập
                  </Link>
                </div>

              </>
            }

          </div> : <></>}
        </div>
      </div>
      <div className={styles.bottomMenu}>
        <ul>
          <li className={styles.danhmuc} onClick={() => handleOpenMenu()}>Danh mục
            {isOpenListbox ?
              <div className={`${styles.listbox} w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100`}>
                {!categories ? <>...</> :
                  <Listbox
                    aria-label="Dynamic Actions"
                    className={styles.listboxContent}
                  >
                    {
                      categories.map(item => (
                        <ListboxItem
                          key={item.name}
                          color={"default"}
                        >
                          <a href={`/book-category/${item.tag}`} prefetch={false} onClick={() => dispatch(getBooksByCate(`${item.tag}`))}>
                            {item.name}
                          </a>
                        </ListboxItem>
                      ))
                    }
                  </Listbox>}

              </div> : <></>}
          </li>
          <Link href="/book" prefetch={false}>
            <li className={styles.bottomMenuItem}>Sách đọc</li>
          </Link>
          <Link href="/audio-book" prefetch={false}>
            <li className={styles.bottomMenuItem}>Sách nói</li>
          </Link>
          <Link href="/ranking/sachdoc" prefetch={false}>
            <li className={styles.bottomMenuItem}>Bảng xếp hạng</li>
          </Link>
          <Link href="/community" prefetch={false}>
            <li className={styles.bottomMenuItem}>Review sách</li>
          </Link>

        </ul>
      </div>
    </div >
  )
}

export default Header