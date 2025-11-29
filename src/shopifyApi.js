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
              collections(first: 10) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
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
              brand: metafield(namespace: "custom", key: "brand") {
                value
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

    // Helper to parse brand metafield
    const parseBrand = (brandMetafield) => {
      if (!brandMetafield || !brandMetafield.value) return '';
      
      let value = brandMetafield.value;
      
      // Try to parse if it's JSON string
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          
          // If parsed is an array, join with comma
          if (Array.isArray(parsed)) {
            return parsed.join(', ');
          }
          
          // If parsed is object with value property
          if (typeof parsed === 'object' && parsed.value) {
            return String(parsed.value);
          }
          
          // If parsed is just a string
          if (typeof parsed === 'string') {
            return parsed;
          }
          
          // Return stringified version if nothing else works
          return String(parsed);
        } catch (e) {
          // If not JSON, return as is
          return value;
        }
      }
      
      // If it's already an array
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Return as string
      return String(value);
    };

    return {
      products: edges.map(({ node }) => ({
        id: node.id,
        name: node.title,
        price: `${node.variants.edges[0].node.price.amount} ${node.variants.edges[0].node.price.currencyCode}`,
        priceAmount: node.variants.edges[0].node.price.amount,
        currencyCode: node.variants.edges[0].node.price.currencyCode,
        image: node.images.edges[0]?.node.url || "https://via.placeholder.com/200",
        brand: parseBrand(node.brand),
        collections: node.collections.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
        })),
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
          items {
            id
            title
            url
            type
            items {
              id
              title
              url
              type
              items {
                id
                title
                url
                type
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

    console.log('=== MENU FETCHED ===');
    console.log('Menu Handle:', handle);
    console.log('Menu Title:', menu.title);
    console.log('Top-level items:', menu.items.length);

    // Recursive function to process menu items at any depth
    const processMenuItem = (item) => {
      const hasChildren = item.items && item.items.length > 0;
      
      // Extract handle from URL for easier matching
      let itemHandle = null;
      if (item.url) {
        const match = item.url.match(/\/collections\/([^/?]+)/);
        if (match) {
          itemHandle = match[1];
        }
      }
      
      const processedItem = {
        id: item.id,
        title: item.title,
        url: item.url,
        type: item.type,
        handle: itemHandle, // Add extracted handle
        hasChildren: hasChildren,
        children: hasChildren ? item.items.map(child => processMenuItem(child)) : []
      };
      
      console.log(`Processed menu item: ${item.title}, handle: ${itemHandle}, children: ${processedItem.children.length}`);
      
      return processedItem;
    };

    // Process all top-level menu items recursively
    const processedMenu = menu.items.map(item => processMenuItem(item));
    
    console.log('=== MENU PROCESSED ===');
    return processedMenu;

  } catch (error) {
    console.error("Error fetching menu:", handle, error);
    return null;
  }
}

// New function to fetch menu items for filters
export async function fetchSidebarMenu() {
  return fetchMenuByHandle('sidebar-collection');
}

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
          return value;
        }
      }
      
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
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
      
      // If it has children, recursively extract text
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

export async function createCheckout(lineItems, email = null, customerAccessToken = null) {
  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  try {
    console.log('=== CREATING CART ===');
    console.log('Line Items:', JSON.stringify(lineItems, null, 2));
    console.log('Customer Access Token:', customerAccessToken ? 'Provided' : 'Not provided');
    
    // Transform line items to cart lines format
    const cartLines = lineItems.map(item => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    const input = {
      lines: cartLines,
    };

    // Add buyer identity with customer access token if user is logged in
    if (customerAccessToken) {
      input.buyerIdentity = {
        customerAccessToken: customerAccessToken
      };
      console.log('Cart will be associated with logged-in customer');
    } else if (email) {
      // If no access token but email provided, use email only
      input.buyerIdentity = {
        email: email
      };
      console.log(' Cart will use guest email:', email);
    } else {
      console.log('ℹ Creating guest cart (no customer association)');
    }

    console.log('Cart Input:', JSON.stringify(input, null, 2));

    const response = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables: { input }
      }),
    });

    console.log('Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Cart Response:', JSON.stringify(result, null, 2));

    // Check for errors
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      return null;
    }

    // Check for user errors
    if (result.data?.cartCreate?.userErrors?.length > 0) {
      console.error("Cart User Errors:", result.data.cartCreate.userErrors);
      return null;
    }

    const cart = result.data?.cartCreate?.cart;
    
    if (!cart || !cart.checkoutUrl) {
      console.error("No cart or checkoutUrl returned");
      return null;
    }

    console.log('Cart Created Successfully!');
    console.log('Cart ID:', cart.id);
    console.log('Checkout URL:', cart.checkoutUrl);
    console.log('=== END ===');

    return {
      id: cart.id,
      webUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.cost?.totalAmount
    };
    
  } catch (error) {
    console.error("=== CART CREATE ERROR ===");
    console.error("Error:", error.message);
    console.error("=== END ERROR ===");
    return null;
  }
}

// Customer Sign Up (Create Account)
export async function createCustomer(email, password, firstName, lastName) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
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
        variables: {
          input: {
            email,
            password,
            firstName,
            lastName,
            acceptsMarketing: false,
          }
        }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return { success: false, errors: result.errors };
    }

    if (result.data?.customerCreate?.customerUserErrors?.length > 0) {
      console.error("Customer creation errors:", result.data.customerCreate.customerUserErrors);
      return { 
        success: false, 
        errors: result.data.customerCreate.customerUserErrors 
      };
    }

    const customer = result.data?.customerCreate?.customer;
    
    if (!customer) {
      return { success: false, errors: [{ message: "Failed to create account" }] };
    }

    return {
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      }
    };

  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, errors: [{ message: error.message }] };
  }
}

// Customer Sign In (Access Token)
export async function customerSignIn(email, password) {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
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
        variables: {
          input: {
            email,
            password,
          }
        }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return { success: false, errors: result.errors };
    }

    if (result.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
      const errors = result.data.customerAccessTokenCreate.customerUserErrors;
      console.error("Sign in errors:", errors);
      return { success: false, errors };
    }

    const tokenData = result.data?.customerAccessTokenCreate?.customerAccessToken;
    
    if (!tokenData) {
      return { success: false, errors: [{ message: "Failed to sign in" }] };
    }

    // Now fetch customer details with the access token
    const customerData = await getCustomerData(tokenData.accessToken);

    return {
      success: true,
      accessToken: tokenData.accessToken,
      expiresAt: tokenData.expiresAt,
      customer: customerData,
    };

  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, errors: [{ message: error.message }] };
  }
}

// Get Customer Data
export async function getCustomerData(accessToken) {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        email
        firstName
        lastName
        phone
        defaultAddress {
          id
          address1
          address2
          city
          province
          country
          zip
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
        variables: { customerAccessToken: accessToken }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return null;
    }

    return result.data?.customer || null;

  } catch (error) {
    console.error("Error fetching customer data:", error);
    return null;
  }
}

// Customer Sign Out (Delete Access Token)
export async function customerSignOut(accessToken) {
  const query = `
    mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
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
        variables: { customerAccessToken: accessToken }
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return { success: false };
    }
    
    return { success: true };

  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false };
  }
}


// Customer Password Reset/Change
export async function customerUpdate(accessToken, firstName, lastName) {
  const query = `
    mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
        customer {
          id
          email
          firstName
          lastName
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  try {
    console.log('=== CUSTOMER UPDATE ===');
    console.log('Access Token Type:', typeof accessToken);
    console.log('Access Token exists:', !!accessToken);
    console.log('Access Token Length:', accessToken?.length);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);

    if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
      console.error(' Invalid access token');
      return { 
        success: false, 
        errors: [{ message: 'Invalid access token. Please sign in again.' }] 
      };
    }

    if (!firstName || !lastName) {
      console.error(' Missing name fields');
      return { 
        success: false, 
        errors: [{ message: 'First name and last name are required' }] 
      };
    }

    const variables = {
      customerAccessToken: accessToken,
      customer: {
        firstName: firstName,
        lastName: lastName
      }
    };

    console.log('Variables being sent:', JSON.stringify(variables, null, 2));

    const response = await fetch(SHOPIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
      },
      body: JSON.stringify({
        query,
        variables
      }),
    });

    if (!response.ok) {
      console.error(' HTTP Error:', response.status);
      return { 
        success: false, 
        errors: [{ message: `HTTP Error: ${response.status}` }] 
      };
    }

    const result = await response.json();
    console.log('=== API RESPONSE ===');
    console.log(JSON.stringify(result, null, 2));
    console.log('===================');

    if (result.errors) {
      console.error(" GraphQL errors:", result.errors);
      return { success: false, errors: result.errors };
    }

    if (result.data?.customerUpdate?.customerUserErrors?.length > 0) {
      const errors = result.data.customerUpdate.customerUserErrors;
      console.error(" Customer update errors:", errors);
      return { success: false, errors };
    }

    const customer = result.data?.customerUpdate?.customer;
    
    if (!customer) {
      console.error(' No customer data returned');
      return { 
        success: false, 
        errors: [{ message: "Failed to update profile" }] 
      };
    }

    console.log(' Customer updated successfully');
    console.log('Updated customer:', customer);
    console.log('=== END ===');

    return {
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      }
    };

  } catch (error) {
    console.error(" Exception in customerUpdate:", error);
    return { 
      success: false, 
      errors: [{ message: error.message || 'Unknown error occurred' }] 
    };
  }
}

// Autocomplete/Predictive Search
export async function predictiveSearch(query) {
  const searchQuery = `
    query predictiveSearch($query: String!) {
      predictiveSearch(query: $query, limit: 10, types: [PRODUCT]) {
        products {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
          vendor
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
        query: searchQuery,
        variables: { query }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return [];
    }

    const products = result.data?.predictiveSearch?.products || [];

    return products.map((product) => ({
      id: product.id,
      name: product.title,
      handle: product.handle,
      price: `${product.variants.edges[0]?.node.price.amount} ${product.variants.edges[0]?.node.price.currencyCode}`,
      image: product.images.edges[0]?.node.url || "https://via.placeholder.com/50",
      availableForSale: product.variants.edges[0]?.node.availableForSale || false,
      vendor: product.vendor,
    }));

  } catch (error) {
    console.error("Error in predictive search:", error);
    return [];
  }
}