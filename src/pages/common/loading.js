
export default function Loading({ message }) {
    return (
        <>
            <div className="wrapper">
                <h2 className="animate-charcter">{message ? message : "Loading.."}</h2>
            </div>
        </>
    );
}