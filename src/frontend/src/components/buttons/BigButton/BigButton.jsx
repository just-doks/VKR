
import './css/BigButton.css';

const BigButton = function({className, onClick, borderRadius, disabled = false, children}) {

    return (
        <button className={`${className} big-button p-1`} 
                style={{borderRadius: borderRadius}} 
                onClick={onClick}
                disabled={disabled}>
            {children}
        </button>
    )
}

export default BigButton;