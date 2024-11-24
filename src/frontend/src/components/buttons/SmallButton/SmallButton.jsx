import './SmallButton.css';

const SmallButton = function({children, className, onClick, borderRadius}) {

    return (
        <button className={`${className} small-button`} 
                style={{borderRadius: borderRadius}}
                onClick={onClick}
        >
            {children}
        </button>
    )
}

export default SmallButton;