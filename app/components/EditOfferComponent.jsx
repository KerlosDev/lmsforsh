import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import GlobalApi from '../api/GlobalApi';

const EditOfferComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [offerState, setOfferState] = useState(false);
    const [offerForm, setOfferForm] = useState({
        docname: '',
        first: '',
        fourth: '',
        fetures: '',
        name: '',
        priceafter: 0,
        pricebefore: 0,
        second: '',
        third: ''
    });

    useEffect(() => {
        loadOffer();
    }, []);

    const loadOffer = async () => {
        try {
            const response = await GlobalApi.getOffer();
            if (response?.offer) {
                setOfferForm(response.offer);
                setOfferState(response.offer.stage === 'PUBLISHED');
            }
        } catch (error) {
            console.error('Error loading offer:', error);
            toast.error('حدث خطأ أثناء تحميل العرض');
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const updatedOffer = {
                ...offerForm,
                stage: offerState ? 'PUBLISHED' : 'DRAFT'
            };

            await GlobalApi.updateOffer(updatedOffer);
            toast.success('تم حفظ العرض بنجاح');
            await loadOffer(); // Refresh data
        } catch (error) {
            console.error('Error saving offer:', error);
            toast.error('حدث خطأ أثناء حفظ العرض');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-xl sm:text-2xl font-arabicUI3 text-white mb-4 sm:mb-6">إدارة العروض</h3>
            <div className="space-y-4">
                {/* Offer State Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="text-white font-arabicUI3 text-sm sm:text-base">حالة العرض:</label>
                    <button
                        onClick={() => setOfferState(!offerState)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-arabicUI3 ${offerState ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}
                    >
                        {offerState ? 'مفعل' : 'غير مفعل'}
                    </button>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Input fields with responsive styles */}
                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">اسم الدكتور</label>
                        <input
                            value={offerForm.docname}
                            onChange={(e) => setOfferForm({ ...offerForm, docname: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">اسم العرض</label>
                        <input
                            value={offerForm.name}
                            onChange={(e) => setOfferForm({ ...offerForm, name: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">السعر قبل</label>
                        <input
                            type="number"
                            value={offerForm.pricebefore}
                            onChange={(e) => setOfferForm({ ...offerForm, pricebefore: Number(e.target.value) })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">السعر بعد</label>
                        <input
                            type="number"
                            value={offerForm.priceafter}
                            onChange={(e) => setOfferForm({ ...offerForm, priceafter: Number(e.target.value) })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">ميزة ١</label>
                        <input
                            value={offerForm.first}
                            onChange={(e) => setOfferForm({ ...offerForm, first: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">ميزة ٢</label>
                        <input
                            value={offerForm.second}
                            onChange={(e) => setOfferForm({ ...offerForm, second: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">ميزة ٣</label>
                        <input
                            value={offerForm.third}
                            onChange={(e) => setOfferForm({ ...offerForm, third: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">ميزة ٤</label>
                        <input
                            value={offerForm.fourth}
                            onChange={(e) => setOfferForm({ ...offerForm, fourth: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                        />
                    </div>

                    <div className="space-y-1 sm:space-y-2 col-span-1 sm:col-span-2">
                        <label className="text-white text-sm sm:text-base font-arabicUI3">المميزات</label>
                        <textarea
                            value={offerForm.fetures}
                            onChange={(e) => setOfferForm({ ...offerForm, fetures: e.target.value })}
                            className="w-full p-2 sm:p-3 text-sm sm:text-base rounded-lg font-arabicUI3"
                            rows="3"
                            placeholder="كل ميزة في سطر جديد"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-4 sm:mt-6">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className={`w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base ${isLoading
                                ? 'bg-gray-500'
                                : 'bg-green-500 hover:bg-green-600'
                            } text-white rounded-lg font-arabicUI3 transition-colors`}
                    >
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditOfferComponent;
