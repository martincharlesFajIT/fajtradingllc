// src/shopifyApi.js

const SHOPIFY_URL = "https://fajtradingllc.com/api/2025-01/graphql.json";
const SHOPIFY_TOKEN = "24d1c3c4c083fec44504ded900915d3a";

export const fetchProductsByCollection = async (handle, first = 10, after = null) => {
  const query = `
    query getCollectionProducts($handle: String!, $first: Int!, $after: String) {
      collectionByHandle(handle: $handle) {
        products(first: $first, after: $after) {
          edges {
            cursor
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
          pageInfo {
            hasNextPage
            endCursor
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
        variables: { handle, first, after },
      }),
    });

    const json = await response.json();

    if (!json.data.collectionByHandle) {
      console.error("No collection found for handle:", handle);
      return { products: [], hasNextPage: false, endCursor: null };
    }

    const { edges, pageInfo } = json.data.collectionByHandle.products;

    return {
      products: edges.map(({ node }) => ({
        id: node.id,
        name: node.title,
        price: `${node.variants.edges[0].node.price.amount} ${node.variants.edges[0].node.price.currencyCode}`,
        image: node.images.edges[0]?.node.url || "https://via.placeholder.com/200",
      })),
      hasNextPage: pageInfo.hasNextPage,
      endCursor: pageInfo.endCursor,
    };
  } catch (err) {
    console.error("Shopify API Error:", err);
    return { products: [], hasNextPage: false, endCursor: null };
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
};

export async function fetchMenuByHandle(handle) {
  const query = `
    query getMenu($handle: String!) {
      menu(handle: $handle) {
        id
        title
        handle
        items {
          id
          title
          url
          type
          # You can add nested items if your menu has sub-menus
          # items {
          #   id
          #   title
          #   url
          # }
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

    const menu = result.data?.menu;
    if (!menu) {
      console.log("Menu not found for handle:", handle);
      return null;
    }

    // Return the menu items, or the whole menu object if you need more info
    return menu.items.map(item => ({
      id: item.id,
      title: item.title,
      url: item.url,
      type: item.type,
    }));

  } catch (error) {
    console.error("Error fetching menu:", handle, error);
    return null;
  }
}