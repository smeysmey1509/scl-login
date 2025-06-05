import React, { useEffect, useRef, useState } from 'react';
import './Loading.css'; // include the CSS separately or use inline styles

const BarLoader = () => {
    const [loadingPercent, setLoadingPercent] = useState<number>(100);
    const duration = 5000
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        const animate = (timestamp: any) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const currentPercent = Math.round(100 - progress * 100);
            setLoadingPercent(currentPercent);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, []);

    return (
        <div className="scl--barloader-container">
            <div
                className="scl--spinner-item"
                style={{ width: `${loadingPercent}%` }}
            ></div>
            <span className="scl--percentage-text">{loadingPercent}%</span>
        </div>
    );
};

export default BarLoader;
