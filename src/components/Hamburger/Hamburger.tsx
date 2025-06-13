import React, {useState} from 'react';
import './Hamburger.css';

const Hamburger = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className={`rs--hamburger-container ${isOpen ? 'open' : ''}`}
             onClick={() => setIsOpen(!isOpen)}>
            <div></div>
            <div></div>
        </div>
    )
}

export default Hamburger;