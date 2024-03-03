import * as dotenv from 'dotenv';
import express, { urlencoded } from 'express'
import cors from 'cors'
import { connect } from 'mongoose'
import articleRouter from './routes/articles.js'
import Article from './models/article.js'
import methodOverride from 'method-override'
dotenv.config();
const app = express()
app.use(express.json())
app.use(cors());
app.use(urlencoded({extended: false}))
app.use(methodOverride('_method'))

const uri = process.env.MONGO_URI
connect(uri)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log("Database not connected", err))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async(req, res) => {

    const articles = await Article.find().sort({ createdAt: 'desc' });
   
    res.render('articles/index', { articles: articles })
})



app.get('/:key', async (req, res) => {
    try {
        const articles = await Article.find({
            "$or": [
                { 
                    // title: { $regex: req.params.key, $options: 'i' },
                    description: { $regex: req.params.key, $options: 'i' }
                    // markdown: { $regex: req.params.key, $options: 'i' }
             }, // Case-insensitive search
             {
                title: { $regex: req.params.key, $options: 'i' }
             },
             {
                markdown: { $regex: req.params.key, $options: 'i' }
             }
            ]
        });

        // res.send(articles)
        res.render('articles/search', { articles: articles, searchKey: req.params.key });
    } catch (error) {
        console.error('Error in search:', error);
        res.status(500).send('Internal Server Error');
    }
});


const port = process.env.PORT||5000;
app.use('/articles', articleRouter)
app.listen(port, () => console.log(`Server is running on port ${port}`))