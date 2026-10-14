import { useMemo, useState } from "react";

const products = [
    { id: 1, nombre: "Acetaminofén 500mg", presentacion: "Caja x 20 tabletas", categoria: "Analgésico", precio: 3200, stock: 48 },
    { id: 2, nombre: "Ibuprofeno 400mg", presentacion: "Caja x 10 cápsulas", categoria: "Antiinflamatorio", precio: 5200, stock: 4 },
    { id: 3, nombre: "Losartán 50mg", presentacion: "Caja x 30 tabletas", categoria: "Cardiovascular", precio: 9200, stock: 8 },
    { id: 4, nombre: "Omeprazol 20mg", presentacion: "Caja x 14 cápsulas", categoria: "Gastrointestinal", precio: 4500, stock: 16 },
    { id: 5, nombre: "Amoxicilina 500mg", presentacion: "Caja x 12 cápsulas", categoria: "Antibiótico", precio: 12800, stock: 0 },
    { id: 6, nombre: "Loratadina 10mg", presentacion: "Caja x 10 tabletas", categoria: "Antialérgico", precio: 3900, stock: 30 },
    { id: 7, nombre: "Metformina 850mg", presentacion: "Caja x 30 tabletas", categoria: "Endocrino", precio: 7400, stock: 22 },
    { id: 8, nombre: "Suero oral", presentacion: "Sobre 27.5g", categoria: "Hidratación", precio: 2800, stock: 40 },
];

const categories = ["Todas", ...new Set(products.map((p) => p.categoria))];
const paymentMethods = ["Efectivo", "Tarjeta", "Transferencia"];

function useSales() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
    const [receipt, setReceipt] = useState(null);

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();
        return products.filter(
            (p) =>
                p.nombre.toLowerCase().includes(term) &&
                (category === "Todas" || p.categoria === category)
        );
    }, [search, category]);

    const addToCart = (product) => {
        setCart((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (!existing) return [...current, { ...product, cantidad: 1 }];
            if (existing.cantidad >= product.stock) return current;
            return current.map((item) =>
                item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
            );
        });
    };

    const changeQuantity = (id, delta) => {
        setCart((current) =>
            current
                .map((item) =>
                    item.id === id
                        ? { ...item, cantidad: Math.min(item.stock, item.cantidad + delta) }
                        : item
                )
                .filter((item) => item.cantidad > 0)
        );
    };

    const removeItem = (id) => setCart((current) => current.filter((item) => item.id !== id));
    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    const total = cart.reduce((sum, item) => sum + item.cantidad * item.precio, 0);

    const checkout = () => {
        setReceipt({ items: totalItems, total, paymentMethod });
        setCart([]);
    };

    return {
        search, setSearch,
        category, setCategory, categories,
        products: filteredProducts,
        cart, addToCart, changeQuantity, removeItem, clearCart,
        totalItems, total,
        paymentMethod, setPaymentMethod, paymentMethods,
        receipt, closeReceipt: () => setReceipt(null),
        checkout,
    };
}

export default useSales;
