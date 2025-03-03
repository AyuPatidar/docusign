const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Load private and public keys
const privateKey = fs.readFileSync("./private.pem", "utf8");
const publicKey = fs.readFileSync("./public.pem", "utf8");

// Generate JWT
function getJWTToken() {
	const payload = {
		iss: process.env.DOCUSIGN_CLIENT_ID,
		sub: process.env.DOCUSIGN_USER_ID,
		aud: "account-d.docusign.com",
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 3600,
		scope: "signature impersonation",
	};

	const token = jwt.sign(payload, privateKey, {
		algorithm: "RS256",
		header: {
			typ: "JWT",
			alg: "RS256",
		},
	});

	return token;
}

async function getOauthAccessToken() {
	const token = getJWTToken();

	const data = {
		grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
		assertion: token,
	};
	// Convert the data object into an x-www-form-urlencoded string as specified by docusign
	const formData = new URLSearchParams(data).toString();

	try {
		const response = await fetch("https://account-d.docusign.com/oauth/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData,
		});

		const data = await response.json();

		return data;
	} catch (error) {
		console.log("getOauthToken ki error: ", error.message);
		return res.json({ error });
	}
}

app.get("/envelopes", async (req, res) => {
	const account_id = process.env.DOCUSIGN_ACCOUNT_ID;
	const envelope_id = "792a9827-8cad-4da5-b0fa-eb69abd88566";
	const oauthAccessTokenDetails = await getOauthAccessToken();
	const accessToken = oauthAccessTokenDetails.access_token;
	console.log("token: ", accessToken);
	try {
		const response = await fetch(
			`https://demo.docusign.net/restapi/v2.1/accounts/${account_id}/envelopes?from_date=2025-03-01T14:30:00Z`,
			{
				headers: {
					"Content-Type": "multipart/form-data; boundary=AAA",
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const envelopeData = await response.json();
		const envelopes = envelopeData.envelopes;
		return res.json({ envelopes });
	} catch (error) {
		return res.json({ error });
	}
});

app.get("/envelopes/:envelopeId/documents", async (req, res) => {
	const account_id = process.env.DOCUSIGN_ACCOUNT_ID;
	const envelope_id = req.params.envelopeId;
	const oauthAccessTokenDetails = await getOauthAccessToken();
	const accessToken = oauthAccessTokenDetails.access_token;
	console.log("token: ", accessToken);
	try {
		const response = await fetch(
			`https://demo.docusign.net/restapi/v2.1/accounts/${account_id}/envelopes/${envelope_id}/documents`,
			{
				headers: {
					"Content-Type": "multipart/form-data; boundary=AAA",
					Accept: "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const envelopeData = await response.json();
		return res.json({ envelopeData });
	} catch (error) {
		return res.json({ error });
	}
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
