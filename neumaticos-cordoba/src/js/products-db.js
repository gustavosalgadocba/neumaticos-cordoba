const productsDatabase = [
    {
        id: 1,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228.900,
        size: "205/55R16",
        image: "../images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 2,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205.150,
        size: "185/65R15",
        image: "../images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 3,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243.001,
        size: "195/55R16",
        image: "../images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    },
    {
        id: 4,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228.950,
        size: "205/55R16",
        image: "../images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 5,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205.151,
        size: "185/65R15",
        image: "../images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 6,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243.002,
        size: "195/55R16",
        image: "../images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    },
    {
        id: 7,
        name: "Pirelli P7",
        brand: "Pirelli",
        price: 228.960,
        size: "205/55R16",
        image: "../images/p7.webp",
        description: "Neumático de alta performance para vehículos deportivos",
        stock: 10
    },
    {
        id: 8,
        name: "Energy XM2+P",
        brand: "Michelin",
        price: 205.151,
        size: "185/65R15",
        image: "../images/energy.webp",
        description: "Excelente rendimiento y durabilidad",
        stock: 8
    },
    {
        id: 9,
        name: "Ecopia",
        brand: "Bridgestone",
        price: 243.003,
        size: "195/55R16",
        image: "../images/ecopia.webp",
        description: "Máximo confort y control",
        stock: 5
    },
    
];

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    return productsDatabase.filter(product => product.category === category);
}

// Función para obtener producto por ID
function getProductById(id) {
    return productsDatabase.find(product => product.id === id);
}

// Función para buscar productos por nombre o marca
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return productsDatabase.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.brand.toLowerCase().includes(searchTerm)
    );
}

// Exportar funciones y base de datos
export {
    productsDatabase,
    getProductsByCategory,
    getProductById,
    searchProducts
};