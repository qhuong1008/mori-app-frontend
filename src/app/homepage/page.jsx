"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import React, { useEffect, useState } from "react";
import styles from "./homepage.module.scss";
import BookItem from "@/components/BookItem/BookItem";
import Tag from "@/components/Tag/Tag";
import { getAllBooksRequest } from "../redux/saga/requests/book";
import { getAllTagsRequest } from "../redux/saga/requests/tag";
import Loading from "@/components/Loading/Loading";
import {
  getReadingGoalsByUserId,
  resetReadingProgressRequest,
} from "../redux/saga/requests/readingGoal";
import { getUserRecommendationsRequest } from "../redux/saga/requests/account";

const HomePage = () => {
  const [books, setBooks] = useState(null);
  const [tags, setTags] = useState(null);
  const [userRecommendations, setUserRecommendations] = useState(null);
  const [readingGoals, setReadingGoals] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  const getReadingGoalData = (userId) => {
    getReadingGoalsByUserId(userId).then((resp) => {
      setReadingGoals(resp);
    });
  };
  const getRecommendation = (userId) => {
    getUserRecommendationsRequest(userId).then((resp) => {
      if (resp.recommendations.length) {
        setUserRecommendations(resp.recommendations.slice(0, 5));
      }
    });
  };
  // Handle reset reading goal to check when new day pass every time user enter homepage
  useEffect(() => {
    if (readingGoals) {
      readingGoals.forEach((goal) => {
        resetReadingProgressRequest(goal._id);
      });
    }
  }, [readingGoals]);

  useEffect(() => {
    setCurrentAccount(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("user"))) {
      if (currentAccount) {
        getReadingGoalData(currentAccount._id);
        getRecommendation(currentAccount._id);
      }
    }
  }, [currentAccount]);

  useEffect(() => {
    getAllBooksRequest().then((res) => {
      const categorizedBooks = {
        free: res.books.filter((book) => book.access_level == 0).slice(0, 10),
        member: res.books.filter((book) => book.access_level == 1).slice(0, 10),
        purchase: res.books
          .filter((book) => book.access_level == 2)
          .slice(0, 10),
      };
      setBooks(categorizedBooks);
    });
    getAllTagsRequest().then((res) => {
      setTags(res.allTags);
    });
  }, []);

  return (
    <div className={styles.homePageContainer}>
      <Header />
      <div className={styles.homePageContent}>
        <div className={styles.headContent}>
          <h1>Sách hay, hot, sách online miễn phí</h1>
          <h2>
            <i>Thư Viện Sách Ebook Miễn Phí</i>
          </h2>
          <div className={styles.description}>
            <p>
              Đọc Sách Mori được xây dựng nhằm chia sẻ sách ebook miễn phí cho
              những ai khó khăn, chưa có điều kiện mua sách. Hãy để sách trải
              đường trên hành trình đưa bạn đi đến sự khôn ngoan và hiểu biết
              hơn.
            </p>
            <p>
              Bản quyền sách thuộc về Tác giả &amp; Nhà xuất bản. Đọc Sách Mori
              khuyến khích các bạn nếu có khả năng hãy mua sách để ủng hộ Tác
              giả và Nhà xuất bản.
            </p>
          </div>
        </div>
        <section className={styles.bookSectionContainer}>
          <div className={styles.sectionHeader}>
            <h3>Thể loại sách</h3>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.sectionBody}>
            <div className={styles.tagList}>
              {tags ? (
                tags.map((tag, index) => (
                  <div className={styles.tagItem}>
                    <Tag
                      key={index}
                      name={tag.description}
                      link={`/book-category/${tag.name}`}
                      prefetch={false}
                      shallow
                    />
                  </div>
                ))
              ) : (
                <>...</>
              )}
            </div>
          </div>
        </section>

        {userRecommendations && (
          <section className={styles.bookSectionContainer}>
            <div className={styles.sectionHeader}>
              <h3>Mori nghĩ bạn sẽ thích</h3>
              <a
                title="Sách miễn phí"
                href="/book-category/recommend"
                className={styles.getmorebtn}
              >
                Xem thêm
              </a>
            </div>
            <div className={styles.ruler}></div>
            <div className={styles.sectionBody}>
              <div className={styles.bookList}>
                {userRecommendations.map((book) => (
                  <div className={styles.bookItem}>
                    <BookItem book={book} key={book._id} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <section className={styles.bookSectionContainer}>
          <div className={styles.sectionHeader}>
            <h3>Sách miễn phí</h3>
            <a
              title="Sách miễn phí"
              href="/book-category/free"
              className={styles.getmorebtn}
            >
              Xem thêm
            </a>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.sectionBody}>
            <div className={styles.bookList}>
              {books ? (
                books.free.map((book) => {
                  return (
                    <div className={styles.bookItem}>
                      <BookItem book={book} key={book._id} />
                    </div>
                  );
                })
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </section>
        <section className={styles.bookSectionContainer}>
          <div className={styles.sectionHeader}>
            <h3>Sách hội viên</h3>
            <a
              title="Sách hội viên"
              href="/book-category/member"
              className={styles.getmorebtn}
            >
              Xem thêm
            </a>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.sectionBody}>
            <div className={styles.bookList}>
              {books ? (
                books.member.map((book) => {
                  return (
                    <div className={styles.bookItem}>
                      <BookItem book={book} key={book._id} />
                    </div>
                  );
                })
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </section>
        <section className={styles.bookSectionContainer}>
          <div className={styles.sectionHeader}>
            <h3>Sách mua lẻ</h3>
            <a
              title="Sách mua lẻ"
              href="/book-category/purchase"
              className={styles.getmorebtn}
            >
              Xem thêm
            </a>
          </div>
          <div className={styles.ruler}></div>
          <div className={styles.sectionBody}>
            <div className={styles.bookList}>
              {books ? (
                books.purchase.map((book) => {
                  return (
                    <div className={styles.bookItem}>
                      <BookItem book={book} key={book._id} />
                    </div>
                  );
                })
              ) : (
                <Loading />
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
