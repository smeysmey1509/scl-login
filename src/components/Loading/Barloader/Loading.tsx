import {useEffect} from 'react';
import './Loading.css';

const BarLoader = () => {
    useEffect(() => {
        const duration = 5000;
        const interval = 50;
        const totalSteps = duration / interval;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            // const percent = Math.min(Math.round((step / totalSteps) * 100), 100);

            if (step >= totalSteps) {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="scl--barloader-container">
            <div className="scl--spinner-item"></div>
            {/*<span className="scl--percentage-text">{loadingPercent}%</span>*/}
        </div>
    );
};

export default BarLoader;
