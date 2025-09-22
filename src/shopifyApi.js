// src/shopifyApi.js

const SHOPIFY_URL = "https://fajtradingllc.com/api/2025-01/graphql.json";
const SHOPIFY_TOKEN = "24d1c3c4c083fec44504ded900915d3a";

export const fetchProductsByCollection = async (handle) => {
  const query = `
    query getCollectionProducts($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 4) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle },
      }),
    });

    const json = await response.json();

    if (!json.data.collectionByHandle) {
      console.error("No collection found for handle:", handle);
      return [];
    }

    return json.data.collectionByHandle.products.edges.map(({ node }) => ({
      id: node.id,
      name: node.title,
      price: `${node.variants.edges[0].node.price.amount} ${node.variants.edges[0].node.price.currencyCode}`,
      image: node.images.edges[0]?.node.url || "https://via.placeholder.com/200",
    }));
  } catch (err) {
    console.error("Shopify API Error:", err);
    return [];
  }
};

export async function fetchCollectionByHandle(handle) {
  const query = `
    query getCollection($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        handle
        image {
          url
        }
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { handle }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }
    
    const collection = result.data?.collectionByHandle;
    if (!collection) {
      console.log("Collection not found:", handle);
      return null;
    }
    
    return {
      id: collection.id,
      title: collection.title,
      handle: collection.handle,
      image: collection.image?.url || null,
    };
    
  } catch (error) {
    console.error("Error fetching collection:", handle, error);
    return null;
  }
}