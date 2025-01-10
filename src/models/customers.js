const { Schema, model } = require("mongoose");

const customersSchema = new Schema({
    customerShopifyId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String },
    addresses: [{
        address1: { type: String },
        city: { type: String },
        province: { type: String },
        country: { type: String },
        zip: { type: String },
    }],
})

const customers = model('customers', customersSchema)

module.exports = customers