import React from "react";
import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
    return (
        // <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        //     <ClipLoader color="blue" size={50}/>
        // </div>

        <div id="loaderDiv" style={styles.mask}>
            <ClipLoader color="#007BFF" size={80}/>
        </div>
    );
};

const styles = {
    mask: {
        caretColor : "transparent",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 마스크
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // 다른 요소 위에 표시
    },
};

export default LoadingSpinner;
