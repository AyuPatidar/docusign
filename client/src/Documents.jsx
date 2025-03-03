import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";

const Documents = () => {
	const params = useParams();
	const { envelopeId } = params;

	const [docs, setDocs] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchDocs = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/envelopes/${envelopeId}/documents`
				);
				if (!response.ok)
					throw new Error(
						"Failed to fetch documents of the envelope from backend."
					);
				const data = await response.json();
				setDocs(data.envelopeData.envelopeDocuments);
			} catch (error) {
				console.log(error.message);
				setError(error.message);
			}
		};

		fetchDocs();
	}, [envelopeId]);

	if (error !== "") return <p>{error.message}</p>;

	if (docs.length === 0) return <p>Loading...</p>;

	return (
		<div>
			<h1>Documents list for the envelope: {envelopeId}</h1>
			<ul>
				{docs.map((doc, docIndex) => (
					<li key={docIndex}>
						<Link to={`/${envelopeId}/documents/${doc.documentId}`}>
							{doc.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Documents;
