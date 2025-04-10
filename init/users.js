const sampleUsers = [
    {
        username: "classicMuncher",
        password: "password123", // This should be hashed before saving
        gmail: "classicMuncher@gmail.com",
        isVerified: false, // default value
        otp: "", // will be generated and set later
        kathiCartItems: [],
        kathiOrderedItems: [
            {
                itemId: "kathi1",
                itemName: "Chicken Kathi Roll",
                quantity: 2,
                price: 6.99,
                image: "link_to_kathi_image_1.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ],
        southernCartItems: [],
        southernOrderedItems: [
            {
                itemId: "southern1",
                itemName: "Fried Chicken",
                quantity: 1,
                price: 12.99,
                image: "link_to_southern_image_1.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ],
        quenchCartItems: [],
        quenchOrderedItems: [],
        hotspotCartItems: [],
        hotspotOrderedItems: []
    },
    {
        username: "cheesyNoodleFan",
        password: "mypassword", // This should be hashed before saving
        gmail: "cheesyNoodleFan@gmail.com",
        isVerified: false,
        otp: "",
        kathiCartItems: [],
        kathiOrderedItems: [],
        southernCartItems: [],
        southernOrderedItems: [],
        quenchCartItems: [],
        quenchOrderedItems: [
            {
                itemId: "quench1",
                itemName: "Mango Lassi",
                quantity: 3,
                price: 4.50,
                image: "link_to_quench_image_1.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ],
        hotspotCartItems: [],
        hotspotOrderedItems: []
    },
    {
        username: "veggieLover99",
        password: "veggies123", // This should be hashed before saving
        gmail: "veggieLover99@gmail.com",
        isVerified: false,
        otp: "",
        kathiCartItems: [
            {
                itemId: "kathi2",
                itemName: "Paneer Kathi Roll",
                quantity: 1,
                price: 5.49,
                image: "link_to_kathi_image_2.jpg"
            }
        ],
        kathiOrderedItems: [
            {
                itemId: "kathi2",
                itemName: "Paneer Kathi Roll",
                quantity: 1,
                price: 5.49,
                image: "link_to_kathi_image_2.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ],
        southernCartItems: [],
        southernOrderedItems: [],
        quenchCartItems: [],
        quenchOrderedItems: [],
        hotspotCartItems: [],
        hotspotOrderedItems: []
    },
    {
        username: "spicyAdventurer",
        password: "spicy123", // This should be hashed before saving
        gmail: "spicyAdventurer@gmail.com",
        isVerified: false,
        otp: "",
        kathiCartItems: [],
        kathiOrderedItems: [],
        southernCartItems: [
            {
                itemId: "southern2",
                itemName: "Spicy Shrimp",
                quantity: 2,
                price: 15.99,
                image: "link_to_southern_image_2.jpg"
            }
        ],
        southernOrderedItems: [
            {
                itemId: "southern2",
                itemName: "Spicy Shrimp",
                quantity: 2,
                price: 15.99,
                image: "link_to_southern_image_2.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ],
        quenchCartItems: [],
        quenchOrderedItems: [],
        hotspotCartItems: [],
        hotspotOrderedItems: []
    },
    {
        username: "bhelMaster",
        password: "bhelmaster", // This should be hashed before saving
        gmail: "bhelMaster@gmail.com",
        isVerified: false,
        otp: "",
        kathiCartItems: [],
        kathiOrderedItems: [],
        southernCartItems: [],
        southernOrderedItems: [],
        quenchCartItems: [],
        quenchOrderedItems: [],
        hotspotCartItems: [
            {
                itemId: "hotspot1",
                itemName: "Hot Chicken Wings",
                quantity: 10,
                price: 20.00,
                image: "link_to_hotspot_image_1.jpg"
            }
        ],
        hotspotOrderedItems: [
            {
                itemId: "hotspot1",
                itemName: "Hot Chicken Wings",
                quantity: 10,
                price: 20.00,
                image: "link_to_hotspot_image_1.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ]
    },
    {
        username: "comboEnthusiast",
        password: "combomeal123", // This should be hashed before saving
        gmail: "comboEnthusiast@gmail.com",
        isVerified: false,
        otp: "",
        kathiCartItems: [],
        kathiOrderedItems: [],
        southernCartItems: [],
        southernOrderedItems: [],
        quenchCartItems: [],
        quenchOrderedItems: [],
        hotspotCartItems: [],
        hotspotOrderedItems: [
            {
                itemId: "hotspot2",
                itemName: "Combo Meal",
                quantity: 1,
                price: 25.00,
                image: "link_to_hotspot_image_2.jpg",
                createdAt: new Date(),
                completedAt: null
            }
        ]
    }
];

module.exports = { data: sampleUsers };
