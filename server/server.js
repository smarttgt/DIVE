const http = require("http");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    const url = new URL(req.url, "http://localhost:3000");

    try {
        // GENERAL NIGERIAN STOCK MARKET SUMMARY
        if (url.pathname === "/market") {
            const response = await fetch(
                "https://api.ngnmarket.com/v1/market/snapshot",
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NGN_MARKET_API_KEY}`
                    }
                }
            );

            const result = await response.json();

            res.writeHead(response.status);
            res.end(JSON.stringify(result));
            return;
        }

        // SEARCH FOR INDIVIDUAL COMPANIES
        if (url.pathname === "/companies") {
            const search = url.searchParams.get("search");

            if (!search || !search.trim()) {
                res.writeHead(400);
                res.end(JSON.stringify({
                    success: false,
                    error: "Enter a company name or ticker symbol."
                }));
                return;
            }

            const apiUrl = new URL(
                "https://api.ngnmarket.com/v1/companies"
            );

            apiUrl.searchParams.set("search", search.trim());
            apiUrl.searchParams.set("limit", "10");

            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${process.env.NGN_MARKET_API_KEY}`
                }
            });

            const result = await response.json();

            res.writeHead(response.status);
            res.end(JSON.stringify(result));
            return;
        }

        // DEFAULT BACKEND MESSAGE
        res.writeHead(200);
        res.end(JSON.stringify({
            message: "DIVE backend is working!",
            endpoints: [
                "/market",
                "/companies?search=DAN"
            ]
        }));

    } catch (error) {
        console.error("DIVE API error:", error.message);

        res.writeHead(500);
        res.end(JSON.stringify({
            success: false,
            error: "Unable to retrieve data. Check your backend and API connection."
        }));
    }
});

server.listen(3000, () => {
    console.log("DIVE server running on http://localhost:3000");
});