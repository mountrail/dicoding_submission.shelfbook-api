const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const isNameless = !name || name.trim() === ''
  if (isNameless) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  const invalidReadPage = readPage > pageCount
  if (invalidReadPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  if (
    typeof name !== 'string' ||
    typeof year !== 'number' ||
    typeof author !== 'string' ||
    typeof summary !== 'string' ||
    typeof publisher !== 'string' ||
    typeof pageCount !== 'number' ||
    typeof readPage !== 'number' ||
    typeof reading !== 'boolean'
  ) {
    const response = h.response({
      status: 'fail',
      message: 'Request tidak valid!'
    })
    response.code(400)
    return response
  }
  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  books.push(newBook)
  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const {
    name: queryName,
    reading: isReading,
    finished: isFinished
  } = request.query

  let filteredBooks = books

  if (isReading !== undefined) {
    const isReadingBool = parseInt(isReading) === 1
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === isReadingBool
    )
  }

  if (isFinished !== undefined) {
    const isFinishedBool = parseInt(isFinished) === 1
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinishedBool
    )
  }

  if (queryName) {
    const lowercasedQueryName = queryName.toLowerCase()
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(lowercasedQueryName)
    )
  }

  const simplifiedBooks = filteredBooks.map((book) => {
    const { id, name, publisher } = book
    return { id, name, publisher }
  })

  return {
    status: 'success',
    data: {
      books: simplifiedBooks
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((b) => b.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload
  const isNameless = !name || name.trim() === ''
  if (isNameless) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }
  const invalidReadPage = readPage > pageCount
  if (invalidReadPage) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }
  if (
    typeof name !== 'string' ||
    typeof year !== 'number' ||
    typeof author !== 'string' ||
    typeof summary !== 'string' ||
    typeof publisher !== 'string' ||
    typeof pageCount !== 'number' ||
    typeof readPage !== 'number' ||
    typeof reading !== 'boolean'
  ) {
    const response = h.response({
      status: 'fail',
      message: 'Request tidak valid!'
    })
    response.code(400)
    return response
  }
  const updatedAt = new Date().toISOString()
  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((note) => note.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
