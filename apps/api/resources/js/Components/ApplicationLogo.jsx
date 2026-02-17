export default function ApplicationLogo(props) {
    return (
        <div
            {...props}
            className={`inline-flex items-center justify-center rounded-md bg-orange-500 px-3 py-2 font-display text-sm font-bold text-white ${props.className ?? ''}`}
        >
            FF
        </div>
    );
}
