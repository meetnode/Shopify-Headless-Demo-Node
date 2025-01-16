const ALL_COLLECTION_QUERY = `
        query {
            collections(first: 10) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        image {
                            url
                            altText
                        }
                        products(first: 5) {
                            edges {
                                node {
                                    id
                                    title
                                    description
                                    handle
                                    images(first: 1) {
                                        edges {
                                            node {
                                                src
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
`

const PRODUCT_METAOBJECT_QUERY = `
        query getProductMetaobjects($id: ID!) {
            product(id: $id) {
                id
                metafield(namespace: "custom", key: "delivery_estimated") {
                    id
                    namespace
                    key
                    value
                }
            }
        }
`

const GET_HOMEPAGE_QUERY = `
        query {
            metaobject(id: "gid://shopify/Metaobject/98672902401") {
                id
                handle
                type
                fields {
                    key
                    value
                    type
                    references(first: 10) {
                        nodes {
                        ... on MediaImage {
                            id
                            image {
                                src
                                }
                            }
                        }
                    }
                }
            }
        }`

const CUSTOMER_CREATE_MUTATION = `
        mutation customerCreate($input: CustomerInput!) {
            customerCreate(input: $input) {
                customer {
                    id
                    displayName
                    email
                }
                userErrors {
                    field
                    message
                }
            }
        }
`

// const CUSTOMER_LOGIN = `
//         mutation SignInWithEmailAndPassword(
//             $email: String!, 
//             $password: String!,
//         ) {
//             customerAccessTokenCreate(input: { 
//                 email: $email, 
//                 password: $password,
//             }) {
//                 customerAccessToken {
//                     accessToken
//                     expiresAt
//                 }
//                 customerUserErrors {
//                     code
//                     message
//                 }
//             }
//         }
// `
const GET_MARKET_QUERY = `
    query Markets {
        markets(first: 4) {
            nodes {
                name
                enabled
                webPresence {
                    rootUrls {
                        locale
                        url
                    }
                }
            }
        }
    }
`
const GET_MARKET_QUERY_1 = `
    query Markets {
        backupRegion {
            id
            name
        }
    }
`
module.exports = {
    ALL_COLLECTION_QUERY,
    PRODUCT_METAOBJECT_QUERY,
    GET_HOMEPAGE_QUERY,
    CUSTOMER_CREATE_MUTATION,
    GET_MARKET_QUERY,
    GET_MARKET_QUERY_1
} 