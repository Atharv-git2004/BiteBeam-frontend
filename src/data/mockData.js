// src/data/mockData.js

export const categories = [
  { id: 1, name: "Indian", icon: "🍛" },
  { id: 2, name: "Chinese", icon: "🍜" },
  { id: 3, name: "Italian", icon: "🍕" },
  { id: 4, name: "Burgers", icon: "🍔" },
  { id: 5, name: "Desserts", icon: "🍰" },
  { id: 6, name: "Healthy", icon: "🥗" },
  { id: 7, name: "Beverages", icon: "🧋" },
  { id: 8, name: "Biryani", icon: "🍗" },
];

export const offers = [
  {
    id: 1,
    title: "50% OFF up to ₹100",
    code: "BEAMFIRST",
    description: "Valid on your first order with BiteBeam",
    bgGradient: "from-[#003837] via-[#004B49] to-[#005C5E]",
  },
  {
    id: 2,
    title: "Free Delivery",
    code: "FREEDEL",
    description: "On orders above ₹299",
    bgGradient: "from-teal-500 to-emerald-600",
  },
  {
    id: 3,
    title: "Flat ₹75 Cashback",
    code: "BEAMPAY",
    description: "Using UPI payments",
    bgGradient: "from-purple-500 to-indigo-600",
  },
];

export const restaurants = [
  {
    id: 101,
    name: "Ammachi's Kitchen",
    tags: ["Biryani", "Kerala Sadhya", "Seafood"],
    rating: 4.6,
    reviewCount: "1.2k+",
    time: "25-30 mins",
    priceForTwo: "₹350 for two",
    location: "Kannur Town",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1631515243349-e0cb75bfceb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 102,
    name: "Taco Town & Burgers",
    tags: ["Mexican", "Burgers", "Fast Food"],
    rating: 4.3,
    reviewCount: "850+",
    time: "20-25 mins",
    priceForTwo: "₹400 for two",
    location: "Thana, Kannur",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 103,
    name: "Pizza Planet",
    tags: ["Pizzas", "Pasta", "Italian"],
    rating: 4.7,
    reviewCount: "2k+",
    time: "35-40 mins",
    priceForTwo: "₹500 for two",
    location: "South Bazaar",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    featured: true,
  },
  {
    id: 104,
    name: "Green Leaf Pure Veg",
    tags: ["South Indian", "North Indian", "Meals"],
    rating: 4.5,
    reviewCount: "1.5k+",
    time: "15-20 mins",
    priceForTwo: "₹250 for two",
    location: "Payyambalam",
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    id: 105,
    name: "The Dragon Bowl",
    tags: ["Chinese", "Noodles", "Asian"],
    rating: 4.2,
    reviewCount: "600+",
    time: "30-35 mins",
    priceForTwo: "₹450 for two",
    location: "Calicut Road",
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
];

export const popularDishes = [
  {
    id: 1,
    restaurantId: 101,
    name: "Malabar Chicken Biryani",
    price: 180,
    category: "Indian",
    rating: 4.8,
    isVeg: false,
    description:
      "Authentic Kaima rice biryani with succulent chicken piece and whole spices.",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 2,
    restaurantId: 103,
    name: "Margherita Pizza (Medium)",
    price: 250,
    category: "Italian",
    rating: 4.6,
    isVeg: true,
    description:
      "Classic mozzarella cheese and fresh basil leaves on thin crust.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 3,
    restaurantId: 102,
    name: "Cheesy Zinger Burger",
    price: 160,
    category: "Burgers",
    rating: 4.5,
    isVeg: false,
    description:
      "Crispy fried chicken patty topped with melted cheddar cheese and lettuce.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 4,
    restaurantId: 105,
    name: "Chicken Schezwan Hakka Noodles",
    price: 210,
    category: "Chinese",
    rating: 4.4,
    isVeg: false,
    description:
      "Spicy stir-fried noodles cooked with shredded chicken and veggies.",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    restaurantId: 102,
    name: "Peri-Peri Crispy Fries",
    price: 120,
    category: "Burgers",
    rating: 4.3,
    isVeg: true,
    description:
      "Golden potato fries tossed in spicy peri-peri seasoning.",
    image:
      "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];

// Extended menu items for restaurant detail pages
export const menuItems = [
  // Ammachi's Kitchen (101)
  {
    id: 1,
    restaurantId: 101,
    name: "Malabar Chicken Biryani",
    price: 180,
    category: "Biryani",
    rating: 4.8,
    isVeg: false,
    isBestseller: true,
    description:
      "Authentic Kaima rice biryani with succulent chicken pieces and whole spices.",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93cb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 6,
    restaurantId: 101,
    name: "Kerala Fish Curry",
    price: 220,
    category: "Seafood",
    rating: 4.7,
    isVeg: false,
    isBestseller: true,
    description:
      "Tangy and spicy fish curry made with fresh coconut milk and kodampuli.",
    image:
      "https://images.unsplash.com/photo-1626777553635-be342a14d30b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 7,
    restaurantId: 101,
    name: "Appam with Stew",
    price: 140,
    category: "Kerala",
    rating: 4.5,
    isVeg: false,
    isBestseller: false,
    description:
      "Soft lace-edged appams served with creamy chicken stew.",
    image:
      "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 8,
    restaurantId: 101,
    name: "Beef Ularthiyathu",
    price: 260,
    category: "Kerala",
    rating: 4.9,
    isVeg: false,
    isBestseller: true,
    description:
      "Slow-roasted beef with coconut slices and aromatic spices. Kerala special.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },

  // Taco Town & Burgers (102)
  {
    id: 3,
    restaurantId: 102,
    name: "Cheesy Zinger Burger",
    price: 160,
    category: "Burgers",
    rating: 4.5,
    isVeg: false,
    isBestseller: true,
    description:
      "Crispy fried chicken patty topped with melted cheddar cheese and lettuce.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 5,
    restaurantId: 102,
    name: "Peri-Peri Crispy Fries",
    price: 120,
    category: "Sides",
    rating: 4.3,
    isVeg: true,
    isBestseller: false,
    description:
      "Golden potato fries tossed in spicy peri-peri seasoning.",
    image:
      "https://images.unsplash.com/photo-1534080564583-6be75777b70a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 9,
    restaurantId: 102,
    name: "Classic Chicken Taco (3 pcs)",
    price: 199,
    category: "Mexican",
    rating: 4.6,
    isVeg: false,
    isBestseller: true,
    description:
      "Soft tortillas loaded with seasoned chicken, salsa, and sour cream.",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 10,
    restaurantId: 102,
    name: "BBQ Pulled Pork Burger",
    price: 220,
    category: "Burgers",
    rating: 4.4,
    isVeg: false,
    isBestseller: false,
    description:
      "Smoky pulled pork with tangy BBQ sauce on a brioche bun.",
    image:
      "https://images.unsplash.com/photo-1551360159-0a3278e0c7a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },

  // Pizza Planet (103)
  {
    id: 2,
    restaurantId: 103,
    name: "Margherita Pizza (Medium)",
    price: 250,
    category: "Pizzas",
    rating: 4.6,
    isVeg: true,
    isBestseller: true,
    description:
      "Classic mozzarella cheese and fresh basil leaves on thin crust.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 11,
    restaurantId: 103,
    name: "Pepperoni Pizza (Large)",
    price: 399,
    category: "Pizzas",
    rating: 4.8,
    isVeg: false,
    isBestseller: true,
    description:
      "Loaded with spicy pepperoni slices and extra mozzarella on a crispy base.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 12,
    restaurantId: 103,
    name: "Creamy Alfredo Pasta",
    price: 280,
    category: "Pasta",
    rating: 4.5,
    isVeg: true,
    isBestseller: false,
    description:
      "Penne pasta in a rich and creamy white sauce with herbs and parmesan.",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 13,
    restaurantId: 103,
    name: "Garlic Bread with Cheese",
    price: 149,
    category: "Sides",
    rating: 4.4,
    isVeg: true,
    isBestseller: false,
    description:
      "Toasted garlic bread topped with melted mozzarella and herbs.",
    image:
      "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },

  // Green Leaf Pure Veg (104)
  {
    id: 14,
    restaurantId: 104,
    name: "South Indian Thali",
    price: 180,
    category: "Meals",
    rating: 4.6,
    isVeg: true,
    isBestseller: true,
    description:
      "Complete meal with rice, sambar, rasam, 2 curries, papad, and dessert.",
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 15,
    restaurantId: 104,
    name: "Masala Dosa",
    price: 90,
    category: "South Indian",
    rating: 4.7,
    isVeg: true,
    isBestseller: true,
    description:
      "Crispy golden dosa filled with spiced potato masala, served with chutneys.",
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 16,
    restaurantId: 104,
    name: "Paneer Butter Masala",
    price: 210,
    category: "North Indian",
    rating: 4.5,
    isVeg: true,
    isBestseller: false,
    description:
      "Soft paneer cubes in a rich buttery tomato gravy with cream.",
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 17,
    restaurantId: 104,
    name: "Curd Rice",
    price: 80,
    category: "South Indian",
    rating: 4.3,
    isVeg: true,
    isBestseller: false,
    description:
      "Comforting curd rice tempered with mustard seeds, curry leaves, and ginger.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },

  // The Dragon Bowl (105)
  {
    id: 4,
    restaurantId: 105,
    name: "Chicken Schezwan Hakka Noodles",
    price: 210,
    category: "Noodles",
    rating: 4.4,
    isVeg: false,
    isBestseller: true,
    description:
      "Spicy stir-fried noodles cooked with shredded chicken and veggies.",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 18,
    restaurantId: 105,
    name: "Veg Manchurian (Dry)",
    price: 170,
    category: "Chinese",
    rating: 4.3,
    isVeg: true,
    isBestseller: false,
    description:
      "Crispy vegetable balls tossed in a tangy soy-chilli-garlic sauce.",
    image:
      "https://images.unsplash.com/photo-1645696301019-35adcc0d1294?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 19,
    restaurantId: 105,
    name: "Dragon Chicken",
    price: 250,
    category: "Chinese",
    rating: 4.6,
    isVeg: false,
    isBestseller: true,
    description:
      "Crispy fried chicken tossed in fiery dragon sauce with spring onions.",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: 20,
    restaurantId: 105,
    name: "Prawn Fried Rice",
    price: 230,
    category: "Rice",
    rating: 4.5,
    isVeg: false,
    isBestseller: false,
    description:
      "Wok-tossed rice with juicy prawns, egg, and mixed vegetables.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  },
];
