// components/pdfviewer.tsx
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import * as type from "../../app/redux/types";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer({ pdfUrl }) {

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);
  const [pdfDocument, setPdfDocument] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadedPdf = await pdfjs.getDocument({ url: pdfUrl }).promise;
        if (!loadedPdf) {
          console.error("Failed to load PDF document");
          return;
        }
        setPdfDocument(loadedPdf);
        const pages = await loadedPdf.numPages;
        setNumPages(pages);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth);
    setLoading(false);
  }

  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "standard_fonts/",
  };

  // Go to next page
  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  // Go to previous page
  const goToPreviousPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  };

  return (
    <>
      <Nav pageNumber={pageNumber} numPages={numPages} />
      <div
        hidden={loading}
        style={{ height: "calc(100vh - 64px)" }}
        className="flex items-center"
      >
        <div
          className={`flex items-center justify-between w-full absolute z-10 px-2`}
        >
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="relative h-[calc(100vh - 64px)] px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-10 w-10" aria-hidden="true" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="relative h-[calc(100vh - 64px)] px-2 py-24 text-gray-400 hover:text-gray-50 focus:z-20"
          >
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-10 w-10" aria-hidden="true" />
          </button>
        </div>

        <div style={{ width: "100%", maxWidth: "auto", margin: "0 auto", background: "black" }}>
          <Document
            file={pdfUrl.toString()}
            onLoadSuccess={(success) => {
              setNumPages(success.numPages);
              setLoading(false);
            }}
            options={options}
            renderMode="canvas"
            className=""
            style={{ background: "black" }}
          >
            <Page
              className=""
              key={pageNumber}
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onLoadSuccess={(success) => {
                setPageWidth(window.innerWidth);
              }}
              onRenderError={() => setLoading(false)}
              width={window.innerWidth > 480 ? 480 : window.innerWidth - 10}
            />
          </Document>
        </div>
      </div>
    </>
  );
}

function Nav({ pageNumber, numPages }) {
  return (
    <nav className="bg-black">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <p className="text-2xl font-bold tracking-tighter text-white">
                Papermark
              </p>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">
              <span>{pageNumber}</span>
              <span className="text-gray-400"> / {numPages}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
