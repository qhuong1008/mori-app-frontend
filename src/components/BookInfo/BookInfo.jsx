"use client";

import Header from "@/components/Header/Header";
import styles from "./book.module.scss";
import Footer from "@/components/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faHeart,
  faSave,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Tag from "@/components/Tag/Tag";
import {
  getBookById,
  increaseTotalRead,
  increaseTotalSaved,
} from "@/app/redux/actions/book";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import * as types from "@/app/redux/types";

function BookInfo() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const isLoading = useSelector((state) => state.books.loading);
  const book = useSelector((state) => state.books.book);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    dispatch(getBookById(id));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);

  return (
    <>
      <div className={styles.bookContainer}>
        <Header />
        {isLoading ? (
          <Loading />
        ) : (
          <div className={styles.bookContent}>
            <section className={styles.novelHeader}>
              <div className={styles.left}>
                <img
                  class=""
                  src={`${types.BACKEND_URL}/api/bookimg/${book.image}`}
                  alt="book img"
                />
              </div>
              <div className={styles.right}>
                <div className={styles.mainHead}>
                  <h1 className={styles.novelTitle}>{book.name}</h1>
                  <div className={styles.author}>
                    <span>Tác giả: </span>
                    <a
                      href="https://docsachhay.net/author/koga-fumitake-kishimi-ichiro"
                      title={book.author}
                      class="property-item"
                    >
                      <span>{book.author}</span>
                    </a>
                  </div>
                  <div className={styles.rating}>
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#f8d80d" }}
                    />
                    <FontAwesomeIcon
                      icon={faStar}
                      width={25}
                      height={25}
                      style={{ color: "#cfcfcf" }}
                    />
                  </div>
                  <div className={styles.yourRating}>
                    Đánh giá: 4.2/5 từ 28 lượt. Đánh giá của bạn?
                  </div>
                  <div className={styles.headerStats}>
                    <div className={styles.statItem}>
                      <small>Lượt đọc</small>
                      <strong>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={faEye}
                          width={20}
                          height={20}
                        />
                        {book.totalRead}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <small>Lượt thích</small>
                      <strong>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={faHeart}
                          width={20}
                          height={20}
                        />
                        {book.totalHearted}
                      </strong>
                    </div>
                    <div className={styles.statItem}>
                      <small>Đánh dấu</small>
                      <strong>
                        <FontAwesomeIcon
                          className={styles.icon}
                          icon={faSave}
                          width={20}
                          height={20}
                        />
                        {book.totalSaved}
                      </strong>
                    </div>
                  </div>
                  <div className={styles.category}>
                    <div className={styles.title}>Thể loại</div>
                    <Link href={"/book-category/tamlykynang"} shallow>
                      <button className={styles.tag}>
                        Tâm lý - Kỹ năng sống
                      </button>
                    </Link>
                  </div>
                  <div className={styles.nextAction}>
                    <Link href={book.pdf} shallow>
                      <button className={styles.read}>Đọc ngay</button>
                    </Link>
                    <Link href={"/book-category/tamlykynang"} shallow>
                      <button className={styles.save}>Đánh dấu</button>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            <section className={styles.novelContent}>
              <div className={styles.title}>
                <h1>Giới thiệu</h1>
                <div className={styles.line}></div>
              </div>
              <div className={styles.content}>{book.intro}</div>
              <div className={styles.tagWrapper}>
                <div className={styles.titleWrapper}>
                  <h1>Tags</h1>
                  <div className={styles.line}></div>
                </div>
                <div className={styles.tagList}>
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                  <Tag name="Tâm lý" link="tamly" />
                </div>
              </div>
            </section>
            <section className={styles.relatedBooks}>
              <div className={styles.title}>
                <h1>Sách Tâm Lý - Kỹ Năng Sống hay</h1>
              </div>
              <div className={styles.bookList}>
                {isLoading ? (
                  <Loading />
                ) : (
                  <>
                    {books.map((book) => {
                      return (
                        <div className={styles.bookItem}>
                          <BookItem book={book} />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </section>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
}

export default BookInfo;
