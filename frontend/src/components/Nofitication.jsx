import React, { useEffect, useState } from "react";

function Notification({ message }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }
    );

    return (
        isVisible && (
            <div className="toast align-items-center" role="alert" aria-live="assertive" aria-atomic="true" id="Notification">
                <div className="d-flex">
                    <div className="toast-body">
                        {message}
                    </div>
                    <button type="button" className="btn-close me-2 m-auto" aria-label="Close" onClick={handleClose}></button>
                </div>
            </div>
        )
    );
}

export default Notification;
