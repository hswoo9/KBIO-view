import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';

function MemberMyPageSimplePopup() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cnsltAplySn = queryParams.get('cnsltDsctnSn');

    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    useEffect(() => {
        const item = JSON.parse(localStorage.getItem('popupData'));
        if (item) {
            setFormData({
                title: item.ttl || '',
                content: item.cn || '',
            });
        }
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        // 저장 로직 구현
        Swal.fire({
            title: '저장하시겠습니까?',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소',
        }).then((result) => {
            if (result.isConfirmed) {
                // 실제 저장 로직을 여기에 추가
                console.log('저장할 데이터:', { ...formData, cnsltAplySn });
                Swal.fire('저장되었습니다!', '', 'success');
            }
        });
    };

    return (
        <div style={{ padding: "20px", borderRadius: "8px", background: "#f9f9f9", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>상담 수정</h2>
            <p style={{ marginBottom: "15px", color: "#555" }}>상담 신청 번호: {cnsltAplySn}</p>
            <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>제목:</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop: "5px" }}
                />
            </div>
            <div style={{ marginBottom: "15px" }}>
                <label style={{ fontWeight: "bold" }}>내용:</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginTop: "5px", minHeight: "100px" }}
                />
            </div>
            <button onClick={handleSave} style={{ padding: "10px 15px", borderRadius: "5px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" }}>
                저장
            </button>
        </div>
    );
}

export default MemberMyPageSimplePopup;