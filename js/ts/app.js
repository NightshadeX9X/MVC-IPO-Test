import express from 'express';
import path from 'path';
const app = express();
const PORT = 4001;
const dirname = path.resolve();
app.get('/', (req, res) => res.sendFile(`${dirname}/public/index.html`));
app.use(express.static(`${dirname}/public`));
app.use('/js', express.static(`${dirname}/js/public`));
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
