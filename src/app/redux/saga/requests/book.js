import { useSelector } from "react-redux";
import * as type from "../../types";

export const getRecommendationsOfBookRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/book/get-recommendations/${id}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getAllBooksRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/book/get-book`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
export const getAllEBookRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/book/get-book/ebook`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const findBookByNameRequest = async (searchValue) => {
  return fetch(`${type.BACKEND_URL}/api/book/search?term=${searchValue}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getAllAudioBookRequest = async () => {
  return fetch(`${type.BACKEND_URL}/api/book/get-book/audio-book`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getBookByIdRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/book/get-book/${id}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const increaseTotalReadRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/book/total-read/${id}`, {
    method: "POST",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const increaseTotalHeartRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/book/total-hearted/${id}`, {
    method: "POST",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
export const increaseTotalReadDaily = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/bookRanking/increase/${id}`, {
    method: "POST",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const increaseTotalSavedRequest = async (payload) => {
  return fetch(`${type.BACKEND_URL}/api/book/total-saved/${payload.bookId}`, {
    method: "POST",
    headers: type.requestHeader,

    body: JSON.stringify({
      user: payload.accountId,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {});
};

export const findBookByCategoryRequest = async (payload) => {
  return fetch(`${type.BACKEND_URL}/api/book/get-book/category`, {
    method: "POST",
    headers: type.requestHeader,

    body: JSON.stringify({
      searchValue: payload,
    }),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {});
};

export const getReadHistoryRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/readHistory/get-readHistory/${id}`, {
    method: "GET",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const addNewOrUpdateReadHistory = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/readHistory/add-readHistory`, {
    method: "POST",
    headers: type.requestHeader,

    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {});
};

export const findOneReadHistoryRequest = async (book_id, user_id) => {
  return fetch(
    `${type.BACKEND_URL}/api/readHistory/get-readHistory/${book_id}/${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
