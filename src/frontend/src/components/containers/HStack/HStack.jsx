import './HStack.css';

export default function HStack(props) {
    const { className, justifyContent, alignItems, textAlign, width, height, 
        gap, margin, children } = props;
    const style = {
        justifyContent: justifyContent,
        alignItems: alignItems,
        textAlign: textAlign,
        width: width,
        height: height,
        gap: gap,
        margin: margin
    };
    return (
        <div 
            className={"container-h-stack" + `${(className) ? (' ' + className) : ''}`}
            style={style}
        >
            {children}
        </div>
    );
}