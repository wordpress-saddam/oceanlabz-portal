export default function ServicePage({ params }) {
    return (
        <div>
            <h1>Service: {params.service}</h1>
            <p>Service details displayed here.</p>
        </div>
    );
}
