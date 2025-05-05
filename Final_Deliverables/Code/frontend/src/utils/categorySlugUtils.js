const categoryNameToSlug = {
    "TrueBody": "truebody",
    "Hoodies & Sweatshirts": "hoodies-and-sweatshirts",
    "T-Shirt": "t-shirt",
    "Sweaters & Cardigans": "sweaters-and-cardigans",
    "Tops & Blouses": "tops-and-blouses",
    "Camisole & Bandeaus": "camisole-and-bandeaus",
    "Dresses & Skirts": "dresses-and-skirts",
    "Co-ords": "co-ords",
    "Fur & Fleece": "fur-and-fleece",
    "Polo": "polo",
    "Jeans": "jeans",
    "Shorts": "shorts",
    "Shirts": "shirts",
    "Jackets & Coats": "jackets-and-coats",
    "Blazers": "blazers",
    "Activewear": "activewear",
    "Bodysuits": "bodysuits",
    "Trousers": "trousers",
    "Studio": "studio"
  };
  
  const slugToCategoryName = Object.fromEntries(
    Object.entries(categoryNameToSlug).map(([key, value]) => [value, key])
  );
  
  export function getSlugFromCategoryName(name) {
    return categoryNameToSlug[name] || name
      .toLowerCase()
      .replace(/\s+&\s+/g, '-and-')  // " & " → "and"
      .replace(/\s+/g, '-')          // spaces → dashes
      .replace(/[^\w-]+/g, '');      // remove special characters
  }
  
  export function getCategoryNameFromSlug(slug) {
    return slugToCategoryName[slug] || slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  