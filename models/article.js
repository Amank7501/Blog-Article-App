import { Schema, model } from 'mongoose'
// to write html inside the markdown
import {marked} from 'marked'
//to make url free of id and use title in the url
import slugify from 'slugify'
import createDomPurifier from 'dompurify'
import {JSDOM} from 'jsdom'
const dompurify = createDomPurifier(new JSDOM().window)

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml:{
        type:String,
        required: true
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true })
    }
  
    if (this.markdown) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
    }
  
    next()
  })

export default model('Article', articleSchema)