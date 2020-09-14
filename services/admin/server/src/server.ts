import express, {Request, Response} from "express";

const app = express();
const port = parseInt(process.env.ADMIN_PORT, 10);

app.use(express.static('/app/client/build'));

app.get('/status', (req: Request, res: Response) => {
    return res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.sendFile('/app/client/build/index.html');
});

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));