import React, { useState, useEffect, useRef } from 'react';

export default function Captcha({ onValidate }) {
    const [captcha, setCaptcha] = useState(() => generateCaptcha());
    const [userInput, setUserInput] = useState('');
    const [captchaUrl, setCaptchaUrl] = useState('');
    const canvasRef = useRef(null);

    useEffect(() => {
        generateCaptchaImage();
    }, [captcha]);

    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&()';
        return Array(6).fill().map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    }

    function generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    const regenerateCaptcha = () => {
        setCaptcha(generateCaptcha());
        setUserInput('');
        onValidate(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setUserInput(value);
        onValidate(value === captcha);
    };

    const generateCaptchaImage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set background
        ctx.fillStyle = generateRandomColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the text style
        ctx.font = 'bold 24px sans-serif';
        ctx.fillStyle = generateRandomColor();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add noise (random dots)
        for (let i = 0; i < 100; i++) {
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }

        // Draw the captcha text
        ctx.fillText(captcha, canvas.width / 2, canvas.height / 2);

        // Convert canvas to image URL
        setCaptchaUrl(canvas.toDataURL());
    };

    return (
        <div className='captcha'>
            <div className='code-captcha-form'>
                <canvas ref={canvasRef} width={200} height={60} style={{ display: 'none' }} />
                {captchaUrl && <img src={captchaUrl} alt="captcha" style={{ border: '1px solid #ddd', borderRadius: '4px' }} />}
                <button onClick={regenerateCaptcha} className="btn btn-primary d-block w-100 mt-2" type="button">
                    Change Code
                </button>
            </div>
            <div className="my-3">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Enter the code"
                    value={userInput}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>
    );
}