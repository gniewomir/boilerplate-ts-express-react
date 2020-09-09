import express from "express";

export default async (app: express.Application) => {
    /**
     * Health Check endpoints
     */
    app.get("/api/status", (req, res) => {
        res.write("OK");
        res.status(200).end();
    });
    app.head("/api/status", (req, res) => {
        res.status(200).end();
    });
};
