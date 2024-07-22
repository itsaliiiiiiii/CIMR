import React, { useState } from 'react';

export default function Captcha({ onValidate }) {
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [userInput, setUserInput] = useState('');
    const [bgColor, setBgColor] = useState(generateRandomColor());
    const [fontColor, setFontColor] = useState(generateRandomColor());

    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&()';
        let result = '';
        const length = 6;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const regenerateCaptcha = () => {
        setCaptcha(generateCaptcha());
        setUserInput('');
        setBgColor(generateRandomColor());
        setFontColor(generateRandomColor());
        onValidate(false);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setUserInput(value);
        onValidate(value === captcha);
    };

    const captchaStyle = {
        backgroundColor: bgColor,
        color: fontColor,
    };

    return (
        <>
            <div className='captcha'>
                <div className='code-captcha-form'>
                    <div className='code-captcha' style={captchaStyle}>{captcha}</div>
                    <button onClick={regenerateCaptcha} className="btn btn-primary d-block w-100" type="button">Change Code</button>
                </div>
                <div className="mb-3">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Saisir le code"
                        value={userInput}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </>
    );
}
