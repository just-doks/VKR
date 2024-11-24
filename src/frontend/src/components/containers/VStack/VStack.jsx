
import './VStack.css';

export default function VStack(props) {
    const { className, justifyContent, alignItems, textAlign, gap, margin, 
        width, height, children } = props;
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
            className={"container-v-stack" + `${(className) ? (' ' + className) : ''}`}
            style={style}
        >
            {children}
        </div>
    );
}