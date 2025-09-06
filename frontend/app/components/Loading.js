

import React from "react";

const Loading = () => {
    return (
        // this is a loading component
        <div className="h-screen flex w-full items-center justify-center bg-gray-100">
            <div
                className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"
                role="status"
                aria-label="Loading"
            ></div>
        </div>
    );
};

export default Loading;