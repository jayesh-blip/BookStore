import request from "./request";
const STRING = "api/book";

const searchBook = (searchtext) => {
    const url = `${STRING}/search?keyword=${searchtext}`;
    return request.get(url).then((res) => {
        return res;
    });
};

const getById = async (id) => {
    const url = `${STRING}/byId?id=${id}`;
    return request.get(url).then((res) => {
        return res;
    });
};

const getAllBooks = () => {
    const url = `${STRING}/all`;
    return request.get(url).then((res) => {
        return res;
    })
};

const getAll = async (params) => {
    const url = `${STRING}`;
    return request.get(url, { params }).then((res) => {
        return res;
    })
};

const AddBook = (bookData) => {
    const url = `${STRING}`;
    return request.post(url, bookData).then((res) => {
        return res;
    });
};

const UpdateBook = (bookData) => {
    const url = `${STRING}`;
    return request.put(url, bookData).then((res) => {
        return res;
    });
};

const DeleteBook = (bookId) => {
    const url = `${STRING}?id=${bookId}`;
    return request.delete(url).then((res) => {
        return res;
    });
};
const save = async (data) => {
    if (data.id) {
      const url = `${STRING}`;
      return request.put(url, data).then((res) => {
        return res;
      });
    } else {
      const url = `${STRING}`;
      return request.post(url, data).then((res) => {
        return res;
      });
    }
  };
  
const bookService = {
    searchBook,
    getAllBooks,
    getById,
    getAll,
    AddBook,
    UpdateBook,
    DeleteBook,
    save
}

export default bookService;