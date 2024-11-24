
import './AccessBadge.css';

function AccessBadge({className, access, children}) {
    const classname = 'access-badge' + (className ? ` ${className}` : '');
    if (access) 
        return (
            <div className={classname + ' ab-allow'}>{
                children ? children : 'Разрешить'
            }</div>
        )
    else 
        return (
            <div className={classname + '  ab-deny'}>{
                children ? children : 'Запретить'
            }</div>
        )
};

export default AccessBadge;