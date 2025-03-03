import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const DocumentViewer = () => {
	const params = useParams();
	const { envelopeId, documentId } = params;

	const [docUrl, setDocUrl] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchDocument = async () => {
			try {
				const response = await fetch(
					`http://localhost:5000/envelopes/${envelopeId}/documents/${documentId}`
				);
				if (!response.ok) throw new Error("Failed to fetch document");

				const blob = await response.blob();
				const url = URL.createObjectURL(blob);

				setDocUrl(url);
			} catch (error) {
				console.error("Error fetching document:", error);
				setError(error.message);
			}
		};

		fetchDocument();
	}, [envelopeId, documentId]);

	if (error !== "") return <p>{error.message}</p>;

	if (docUrl === null) return <p>Loading...</p>;

	return (
		<div style={{ height: "90vh" }}>
			{docUrl !== null && (
				<iframe
					src={docUrl}
					width="100%"
					height="600px"
					title="PDF Viewer"
					style={{ border: "none" }}
				></iframe>
			)}
		</div>
	);
};

export default DocumentViewer;
