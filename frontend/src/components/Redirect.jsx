import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Redirect(direction) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(direction);
    }, [direction, navigate]);
    return null;
}