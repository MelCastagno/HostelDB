const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const opts = { toJSON: { virtuals : true } };

const HostelSchema = new Schema ({
    title: String,
    images: [{
        url: String,
        filename: String
    }],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    posted: {
        type: Date,
        default: Date.now,
        require: true,
      },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HostelSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    
    <a href="/hostels/${this._id}" style="text-decoration:none; color:black;">
    <h5>${this.title}</h5>
    <img src="${this.images[0].url}" class="d-block w-100" alt="">
    <h6 class="mt-2">$${this.price}/night</h6>
    </a>
    `
})

HostelSchema.post('findOneAndDelete', async function (doc) {
    if (doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    };
});

module.exports = mongoose.model('Hostel', HostelSchema);