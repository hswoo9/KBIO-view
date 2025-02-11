import React from "react";
import { useNavigate } from "react-router-dom";
import URL from "@/constants/url";

const TotalSearch = () => {
    const navigate = useNavigate();

    const handleNext = () => {
        navigate(URL.MAIN);
    };

    return (
        <div className="container withdraw join_step">
            <div className="inner">
                통합검색
            </div>
        </div>
    );
};

export default TotalSearch;
