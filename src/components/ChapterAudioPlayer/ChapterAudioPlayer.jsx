import React, { useState, useRef, useEffect } from "react";
import styles from "./ChapterAudioPlayer.module.scss";
import Hls from "hls.js";

const ChapterAudioPlayer = ({ chapter, book }) => {
  const audioRef = useRef(null);
  const hlsRef = useRef(null);
  console.log("book", book);

  useEffect(() => {
    const audio = audioRef.current;

    // Kiểm tra xem trình duyệt có hỗ trợ HLS không
    if (Hls.isSupported()) {
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(chapter.audio);
      hlsRef.current.attachMedia(audio);
    }

    // Bắt đầu với trạng thái là true khi component được gọi
    audio.addEventListener("loadeddata", () => {
      audio.play();
    });
  }, [chapter.audio]);

  return (
    <div className={styles.chapterAudioPlayer}>
      <div className={styles.audioPlayerHeader}>
        <div className={styles.bookInfo}>
          <img
            className={styles.circleImage}
            src={book.image}
            alt="book image"
          />
          <div className={styles.bookDetails}>
            <span>{chapter.name}</span>
          </div>
        </div>
      </div>
      <div className={styles.audioPayerContainer}>
        <div className={styles.audioPlayer}>
          <audio ref={audioRef} controls preload="auto">
            <source src={chapter.audio} type="application/x-mpegURL" />
          </audio>
        </div>
      </div>
    </div>
  );
};

export default ChapterAudioPlayer;
