import React from 'react'
import styles from "./Header.module.scss"

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topMenu}>
        <div className={styles.left}>
          <div className={styles.logo}>
            logo
          </div>
          <form className={styles.searchBarContainer} action="/search">
            <input type="text" placeholder='Nhập tên sách, tuyển tập, tác giả,...' />
            <button type='submit'>
              Tìm kiếm
            </button>
          </form>
        </div>
        <div className={styles.right}>
          Tài khoản cá nhân
        </div>
      </div>
      <div className={styles.bottomMenu}>
        <ul>
          <li>Danh mục</li>
          <li>Sách đọc</li>
          <li>Sách nói</li>
          <li>Bảng xếp hạng</li>

        </ul>
      </div>
    </div>
  )
}

export default Header
