import React from 'react'
import Swal from "sweetalert2";

const SweetNoti = () => {

    const handleSumbit = () => {
        Swal.fire({
            title: "متاكد انك عاوز تسلم الامتحان ؟",
            text: "! مش هتقدر تعدل الاجابات تاني",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "تسليم الامتحان"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "تم التسليم بنجاح!",
                    text: "انا فخور بيك انك حاولت مهما كانت النتيجة",
                    icon: "success"
                });
                // Add your delete logic here
            }
        });
    }

    return (
        <button
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
        >
            Delete Item
        </button>
    )
}

export default SweetNoti