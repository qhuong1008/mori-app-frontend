import * as type from "../../../redux/types";

export const createReadingGoalRequest = async (request) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal`, {
    method: "POST",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getReadingGoalsByUserId = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/${id}`, {
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

export const resetReadingProgressRequest = async (goalId) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/${goalId}/reset`, {
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

export const updateReadBooksRequest = async (userId, bookId) => {
  return fetch(
    `${type.BACKEND_URL}/api/readingGoal/read-books/${userId}/${bookId}`,
    {
      method: "PUT",
      headers: type.requestHeader,
    }
  )
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const updateReadPagesRequest = async (userId) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/read-pages/${userId}`, {
    method: "PUT",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const getReadingGoalByIdRequest = async (id) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/id/${id}`, {
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

export const editReadingGoalRequest = async (goalId, request) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/${goalId}`, {
    method: "PUT",
    headers: type.requestHeader,
    body: JSON.stringify(request),
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};

export const deleteReadingGoalByIdRequest = async (goalId) => {
  return fetch(`${type.BACKEND_URL}/api/readingGoal/${goalId}`, {
    method: "DELETE",
    headers: type.requestHeader,
  })
    .then((response) => {
      return response.json();
    })

    .catch((error) => {
      throw error;
    });
};
