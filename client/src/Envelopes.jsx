import { useState, useEffect } from "react";
import { Link } from "react-router";

const Envelopes = () => {
	const [envelopes, setEnvelopes] = useState([]);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchEnvelopes = async () => {
			try {
				const response = await fetch("http://localhost:5000/envelopes");
				if (!response.ok)
					throw new Error("Failed to fetch envelopes from backend.");
				const data = await response.json();
				setEnvelopes(data.envelopes);
			} catch (error) {
				console.log(error.message);
				setError(error.message);
			}
		};

		fetchEnvelopes();
	}, []);

	if (error !== "") return <p>{error.message}</p>;

	if (envelopes.length === 0) return <p>Loading...</p>;

	return (
		<div>
			<h1>Envelopes List</h1>
			<ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
				{envelopes.map((envelope, envelopeIndex) => (
					<li key={envelopeIndex}>
						<Link to={`/${envelope.envelopeId}/documents`}>
							{envelope.emailSubject}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Envelopes;
