import { useEffect, useMemo, useState } from "react";
import { getUser } from "../../services/session";
import { inventarioApi, medicamentosApi } from "../../services/api";

const paymentMethods = ["Efectivo", "Tarjeta", "Transferencia"];

function useSales() {
    const farmaciaId = getUser()?.farmacia_id || null;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        if (!farmaciaId) {
            setLoading(false); // eslint-disable-line react-hooks/set-state-in-effect
            return;
        }
        let cancelled = false;
        async function loadProducts() {
            try {
                const inventoryResponse = await inventarioApi.listarPorFarmacia(farmaciaId);
                const items = inventoryResponse.data || [];
                const loaded = await Promise.all(items.map(async (item) => {
                    const response = await medicamentosApi.obtener(item.id_medicamento);
                    const medicine = response.data;
                    return {
                        id: item.id_medicamento,
                        nombre: `${medicine.nombre_comercial}${medicine.concentracion ? ` ${medicine.concentracion}` : ""}`,
                        presentacion: medicine.presentacion || "Sin presentación",
                        laboratorio: medicine.laboratorio || "",
                        precio: Number(item.precio_unitario),
                        stock: item.stock_actual,
                    };
                }));
                if (!cancelled) setProducts(loaded);
            } catch (err) {
                if (!cancelled) setError(err.message || "No se pudo cargar el inventario.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadProducts();
        return () => { cancelled = true; };
    }, [farmaciaId]);

    const categories = useMemo(
        () => ["Todas", ...new Set(products.map((product) => product.presentacion))],
        [products]
    );

    const filteredProducts = useMemo(() => {
        const term = search.trim().toLowerCase();
        return products.filter(
            (p) =>
                p.nombre.toLowerCase().includes(term) &&
                (category === "Todas" || p.presentacion === category)
        );
    }, [products, search, category]);

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
        loading, error,
        cart, addToCart, changeQuantity, removeItem, clearCart,
        totalItems, total,
        paymentMethod, setPaymentMethod, paymentMethods,
        receipt, closeReceipt: () => setReceipt(null),
        checkout,
    };
}

export default useSales;
