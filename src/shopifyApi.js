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
}

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

// Fetch single product by ID with VAT and metafields
export async function fetchProductById(productId) {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        descriptionHtml
        vendor
        productType
        tags
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
              selectedOptions {
                name
                value
              }
              taxable
            }
          }
        }
        shortDescription: metafield(namespace: "custom", key: "short_description") {
          value
        }
        brand: metafield(namespace: "custom", key: "brand") {
          value
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
        variables: { id: productId }
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
    
    const product = result.data?.product;
    if (!product) {
      console.log("Product not found:", productId);
      return null;
    }

    // Helper function to parse metafield value
    const parseMetafieldValue = (metafield) => {
      if (!metafield || !metafield.value) return '';
      
      let value = metafield.value;
      
      // If it's a string, try to parse it
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          // Not JSON, return as plain string
          return value;
        }
      }
      
      // Handle array (like ['fom'])
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Handle rich text object (Shopify's rich text format)
      if (value && typeof value === 'object') {
        // If it has a children array (rich text format)
        if (value.children && Array.isArray(value.children)) {
          return extractTextFromRichText(value);
        }
        
        // If it has a value property
        if (value.value) {
          return parseMetafieldValue({ value: value.value });
        }
      }
      
      // Return as string if nothing else works
      return String(value);
    };

    // Extract plain text from Shopify's rich text format
    const extractTextFromRichText = (node) => {
      if (!node) return '';
      
      // If it's a text node
      if (node.type === 'text' && node.value) {
        return node.value;
      }
      
      
      if (node.children && Array.isArray(node.children)) {
        return node.children
          .map(child => extractTextFromRichText(child))
          .filter(text => text)
          .join(' ');
      }
      
      return '';
    };
    
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      vendor: product.vendor,
      productType: product.productType,
      tags: product.tags,
      images: product.images.edges.map(edge => ({
        url: edge.node.url,
        altText: edge.node.altText,
      })),
      variants: product.variants.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.price,
        compareAtPrice: edge.node.compareAtPrice,
        availableForSale: edge.node.availableForSale,
        quantityAvailable: edge.node.quantityAvailable,
        selectedOptions: edge.node.selectedOptions,
        taxable: edge.node.taxable,
      })),
      shortDescription: parseMetafieldValue(product.shortDescription),
      brand: parseMetafieldValue(product.brand),
    };
    
  } catch (error) {
    console.error("Error fetching product:", productId, error);
    return null;
  }
}