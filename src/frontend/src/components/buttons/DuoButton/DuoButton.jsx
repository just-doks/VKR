
import './DuoButton.css';


function DuoButton(props) {
    const { className, width, valueLeft, valueRight, 
        state, setState, labelLeft, labelRight } = props;
    const style = {
        width: width
    };
    return(
        <div className='duo-btn-wrapper' style={style}>
            <div    
                className={'duo-btn-group' + (className ? ` ${className}` : '')} 
                role='group'
            >
                <label className="duo-btn-left-label">
                    <input  type="radio" 
                            id="left-btn"
                            value={valueLeft}
                            autoComplete='off'
                            checked={state === valueLeft}
                            onChange={(e) => setState(e.currentTarget.value)}/>
                    <span>{labelLeft}</span>
                </label>
                <label className="duo-btn-right-label">
                    <input  type="radio" 
                            id="right-btn"
                            value={valueRight}
                            autoComplete='off'
                            checked={state === valueRight}
                            onChange={(e) => setState(e.currentTarget.value)}/>
                    <span>{labelRight}</span>
                </label>
            </div>
        </div>
    );
};

export default DuoButton;