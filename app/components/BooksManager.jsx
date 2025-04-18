'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlobalApi from '../api/GlobalApi';
import { toast } from 'react-toastify';
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs';

export default function BooksManager() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const result = await GlobalApi.getBooks();
            const booksList = JSON.parse(result.bookOrder?.books || '[]');
            setBooks(booksList);
        } catch (error) {
            console.error('Error fetching books:', error);
            toast.error('حدث خطأ أثناء تحميل الكتب');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newBook = {
                id: editingBook ? editingBook.id : Date.now().toString(),
                ...formData,
                price: Number(formData.price)
            };

            let updatedBooks;
            if (editingBook) {
                updatedBooks = books.map(book => 
                    book.id === editingBook.id ? newBook : book
                );
            } else {
                updatedBooks = [...books, newBook];
            }

            await GlobalApi.saveBooks(updatedBooks);
            await fetchBooks();
            resetForm();
            toast.success(editingBook ? 'تم تحديث الكتاب بنجاح' : 'تم إضافة الكتاب بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء حفظ الكتاب');
        }
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setFormData({
            name: book.name,
            price: book.price.toString(),
            description: book.description || '',
            isAvailable: book.isAvailable
        });
        setIsEditing(true);
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الكتاب؟')) return;

        try {
            const updatedBooks = books.filter(book => book.id !== bookId);
            await GlobalApi.saveBooks(updatedBooks);
            await fetchBooks();
            toast.success('تم حذف الكتاب بنجاح');
        } catch (error) {
            toast.error('حدث خطأ أثناء حذف الكتاب');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            description: '',
            isAvailable: true
        });
        setEditingBook(null);
        setIsEditing(false);
    };

    return (
        <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-2xl font-arabicUI2 text-white mb-6">
                    {isEditing ? 'تعديل الكتاب' : 'إضافة كتاب جديد'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                        type="text"
                        placeholder="اسم الكتاب"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                        required
                    />
                    <input
                        type="number"
                        placeholder="السعر"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
                        required
                    />
                    <textarea
                        placeholder="وصف الكتاب"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 md:col-span-2"
                    />
                </div>
                <div className="flex gap-4 mt-6">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        {isEditing ? 'تحديث' : 'إضافة'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            إلغاء
                        </button>
                    )}
                </div>
            </form>

            <div className="grid gap-4">
                {books.map((book) => (
                    <div key={book.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-arabicUI2 text-white">{book.name}</h3>
                                <p className="text-white/70">{book.description}</p>
                                <p className="text-green-400 mt-2">{book.price} جنيه</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(book)}
                                    className="p-2 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                                >
                                    <BsPencil />
                                </button>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                >
                                    <BsTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
