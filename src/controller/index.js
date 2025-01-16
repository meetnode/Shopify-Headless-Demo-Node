const { hashSync, compareSync } = require('bcryptjs');
const shopify = require('../config/shopify');
const {
    ALL_COLLECTION_QUERY,
    PRODUCT_METAOBJECT_QUERY,
    GET_HOMEPAGE_QUERY,
    CUSTOMER_CREATE_MUTATION,
    GET_MARKET_QUERY
} = require('../constants/query');
const customers = require('../models/customers');

module.exports = {
    async index(req, res) {
        try {
            const data = await shopify.shop.get()
            res.status(200).json({ data })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async home(req, res) {
        try {
            const data = await shopify.graphql(GET_HOMEPAGE_QUERY);

            const mediaField = data.metaobject.fields.find(field => field.key === "media");
            const titleField = data.metaobject.fields.find(field => field.key === "title");
            const subTitleField = data.metaobject.fields.find(field => field.key === "subtitle");
            const media = mediaField.references.nodes

            console.log(media, "Parsed Media");

            const mediaDetails = await Promise.all(
                media.map(async (mediaItem) => {
                    const mediaId = mediaItem.id.split("/").pop();
                    console.log(mediaId, "Extracted Media ID");

                    return {
                        id: mediaId,
                        src: mediaItem.image.src,
                    };
                })
            );


            res.status(200).json({ data: { bannerImages: mediaDetails, titleField, subTitleField } });
        } catch (error) {
            console.error(error, "Error in home function");
            res.status(400).json({ error: error.message });
        }
    },
    async products(req, res) {
        try {
            const data = await shopify.product.list()
            res.status(200).json({ data })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async product(req, res) {
        try {
            const id = req.params.id
            const data = await shopify.product.get(id)
            const metaobjectQuery = await shopify.graphql(
                PRODUCT_METAOBJECT_QUERY,
                {
                    id: `gid://shopify/Product/${id}`
                }
            );
            res.status(200).json({ data: { ...data, metafield: metaobjectQuery?.product.metafield } })
        } catch (error) {
            console.log(error)
            res.status(400).json({ error: error.message })
        }
    },
    async collections(req, res) {
        try {
            const data = await shopify.graphql(ALL_COLLECTION_QUERY)
            res.status(200).json({ data })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async collection(req, res) {
        try {
            const id = req.params.id
            const data = await shopify.collection.list(id)
            res.status(200).json({ data })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async addToCart(req, res) {
        try {
            // const data = 
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async aboutus(req, res) {
        try {
            const data = await shopify.page.list()
            res.status(200).json({ data: data.find(item => item.handle == 'about-us') })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async customerCreate(req, res) {
        try {
            let variable = {
                input: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone,
                    addresses: [
                        {
                            address1: req.body.address1,
                            city: req.body.city,
                            province: req.body.province,
                            country: req.body.country,
                            zip: req.body.zip
                        }
                    ]
                }
            }

            const response = await shopify.graphql(CUSTOMER_CREATE_MUTATION, variable)

            if (response?.customerCreate?.userErrors?.length) throw new Error("Something went wrong")
            const data = {
                ...variable.input,
                customerShopifyId: response.customerCreate.customer.id,
                password: hashSync(req.body.password, 10)
            }

            await customers.create(data)
            res.status(200).json({ response })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async loginCustomer(req, res) {
        try {
            const data = {
                email: req.body.email,
                password: req.body.password
            }

            /* Get customer data from database */
            let userdata = await customers.findOne({ email: data.email }).select('-__v').lean()
            if (!userdata) throw new Error('Invalid email or password');

            /* Compare password */
            const compPassword = compareSync(data?.password, userdata?.password)
            if (!compPassword) throw new Error('Invalid email or password');
            if (userdata.password) delete userdata.password;

            /* Get customer data from shopify */
            const shopifyId = userdata.customerShopifyId.replace('gid://shopify/Customer/', '')
            const getUserData = await shopify.customer.get(shopifyId)
            if (!getUserData) throw new Error("Something went wrong")

            res.status(200).json({ response: getUserData })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    },
    async checkout(req, res) {
        try {
            const product = await shopify.product.get('8503763403009');

            if (!product || !product.variants.some(v => v.id === 45317564563713)) {
                return res.status(404).json({ error: "Product or variant not found" });
            }

            const params = {
                email: 'meetnode@gmail.com',
                line_items: [
                    {
                        variant_id: 45317564563713,
                        quantity: 1,
                    }
                ],
                shipping_address: {
                    first_name: "Meet",
                    last_name: "Suthar",
                    address1: "Vastral",
                    city: "Ahmedabad",
                    province: "Gujarat",
                    country: "India",
                    zip: "382418",
                    phone: null,
                }
            };

            // const checkout = await shopify.order.create(params);
            const checkout = await shopify.checkout.create(params);
            // const checkout = await shopify.payment.list()
            res.status(200).json({
                checkout
            });
        } catch (error) {
            console.error("Error creating checkout:", error);
            res.status(400).json({ error: error.message });
        }
    },
    async market(req, res) {
        try {
            const data = await shopify.graphql(GET_MARKET_QUERY);
            let lang = []
            const accessToken = await shopify.storefrontAccessToken.list()
            console.log(accessToken, "accessToken")
            const response = data.markets.nodes.filter(market => market.enabled).map((market) => {
                const rootUrls = market.webPresence
                const locale = rootUrls['rootUrls'].map(url => url.locale)
                lang = [...lang, ...locale]
                return {
                    name: market.name,
                    locale: locale.length > 1 ? locale : locale[0],
                }
            })
            console.log(JSON.stringify(data), "response")
            res.status(200).json({ message: response, languages: [...new Set(lang)] })
        } catch (error) {
            res.status(400).json({ error: error.message })
        }
    }
}