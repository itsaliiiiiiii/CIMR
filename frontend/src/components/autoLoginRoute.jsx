import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/cimr';

const AutoLoginRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const autoLogin = async () => {
            const token = localStorage.getItem('tokenCIMR');
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/verify-token`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.isValid) {
                    setIsAuthenticated(true);
                    navigate('/rendezvous', { replace: true });
                } else {
                    localStorage.removeItem('tokenCIMR');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('tokenCIMR');
                setIsAuthenticated(false);
            }

            setIsLoading(false);
        };

        autoLogin();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        return null;
    }

    return children;
};

export default AutoLoginRoute;