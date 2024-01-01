"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import React, { useMemo } from "react";
import styles from "../ranking.module.scss";
import * as type from "../../redux/types";
import Link from "next/link";
import {
  Button,
  DropdownTrigger,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faCoffee,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useSWR from "swr";

const Ranking = () => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Ngày"]));

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const [selectedRanking, setSelectedRanking] = useState("daily");

  // for table
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR(
    `${type.BACKEND_URL}/api/bookRanking/getRanking/${selectedRanking}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const rowsPerPage = 10;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

  const loadingState =
    isLoading || data?.rankingData.length === 0 ? "loading" : "idle";

  // end for table
  return (
    <div className={styles.rankingContainer}>
      <Header />
      <div className={styles.rankingContent}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>Bảng xếp hạng</div>
            <div className={styles.navWrapper}>
              <div className={styles.nav}>
                <Link href={"/ranking/book"} shallow>
                  <div className={styles.navItem}>Sách</div>
                </Link>
                <Link href={"/ranking/audio-book"} shallow>
                  <div className={styles.navItem}>Sách nói</div>
                </Link>
              </div>
              <div className={styles.rankingDropdown}>
                <Dropdown>
                  <DropdownTrigger>
                    <Button color="primary" variant="flat">
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Static Actions"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                  >
                    <DropdownItem
                      key="Ngày"
                      onClick={() => setSelectedRanking("daily")}
                    >
                      Ngày
                    </DropdownItem>
                    <DropdownItem
                      key="Tuần"
                      onClick={() => setSelectedRanking("weekly")}
                    >
                      Tuần
                    </DropdownItem>
                    <DropdownItem
                      key="Tháng"
                      onClick={() => setSelectedRanking("monthly")}
                    >
                      Tháng
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
            <div className={styles.rankingTable}>
              <Table
                bottomContent={
                  pages > 0 ? (
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  {/* <TableColumn key="rank">Số thứ tự</TableColumn> */}
                  <TableColumn key="image">Hình ảnh sách</TableColumn>
                  <TableColumn key="name">Tên sách</TableColumn>
                  <TableColumn key="author">Tác giả</TableColumn>
                  <TableColumn key="totalRead">Lượt đọc</TableColumn>
                  <TableColumn key="totalHearted">Lượt thích</TableColumn>
                </TableHeader>
                <TableBody
                  items={data?.rankingData ?? []}
                  loadingContent={<Spinner />}
                  loadingState={loadingState}
                >
                  {(item, index) => (
                    <TableRow key={item?.book_id}>
                      {/* <TableCell>{index ? index : ""}</TableCell> */}
                      <TableCell>
                        <Link href={`/book/${item?.book_id}`} shallow>
                          <img
                            src={item?.bookInfo?.image}
                            alt={item?.bookInfo?.name || "Hình ảnh sách"}
                            className={styles.responsiveImage}
                          />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/book/${item?.book_id}`} shallow>
                          {item?.bookInfo?.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/book/${item?.book_id}`} shallow>
                          {item?.bookInfo?.author}
                        </Link>
                      </TableCell>
                      <TableCell>{item?.totalRead}</TableCell>
                      <TableCell>{item?.bookInfo?.totalHearted}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ranking;
