

import './AllowDenyBtn.css';

const AllowDenyButton = ({className, state, setState}) => {

    return (
        <div    
            className={'allow-deny-btn-group' + (className ? ` ${className}` : '')} 
            role='group'
        >
            <input  type="radio" 
                    id="allow-btn"
                    value="ALLOW"
                    autoComplete='off'
                    checked={state === "ALLOW"}
                    onChange={(e) => setState(e.currentTarget.value)}/>
            <label  htmlFor="allow-btn"
                    className='allow-btn-label'
                    tabIndex={0}>
                        Разрешить
            </label>
            <input  type="radio" 
                    id="deny-btn"
                    value="DENY"
                    autoComplete='off'
                    checked={state === "DENY"}
                    onChange={(e) => setState(e.currentTarget.value)}/>
            <label  htmlFor="deny-btn"
                    className='deny-btn-label'
                    tabIndex={0}>
                        Запретить
            </label>
        </div>
    )
}

export default AllowDenyButton;