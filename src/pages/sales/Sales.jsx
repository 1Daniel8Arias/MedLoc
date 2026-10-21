import "./Sales.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import SearchBar from "../../components/searchbar/SearchBar";
import Modal from "../../components/modal/Modal";
import FormField from "../../components/formfield/FormField";
import { formatCurrency } from "../../services/formatters";
import useSales from "./UseSales";

function Sales() {
    const {
        search, setSearch, category, setCategory, categories, products,
        cart, addToCart, changeQuantity, removeItem, clearCart,
        totalItems, total, paymentMethod, setPaymentMethod, paymentMethods,
        receipt, closeReceipt, checkout,
        loading, error,
    } = useSales();

    return (
        <div className="sales">
            <Sidebar />

            <div className="sales__main">
                <Header titulo="Punto de ventas" />

                <main className="sales__content">
                    <section className="seller">
                        <div className="seller__header">
                            <h2>Nueva venta</h2>
                            <p>Selecciona productos para calcular el total del cliente.</p>
                        </div>

                        <SearchBar value={search} onChange={setSearch} placeholder="Buscar medicamento" />
                        {error && <p className="seller__empty">{error}</p>}
                        {!loading && !error && products.length === 0 && (
                            <p className="seller__empty">Esta farmacia aún no tiene productos en inventario.</p>
                        )}

                        <div className="seller__chips">
                            {categories.map((c) => (
                                <button
                                    key={c}
                                    className={c === category ? "seller__chip seller__chip--active" : "seller__chip"}
                                    onClick={() => setCategory(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>

                        <div className="seller__grid">
                            {products.map((p) => (
                                <article key={p.id} className="product">
                                    <div className="product__top">
                                        <h4>{p.nombre}</h4>
                                        {p.stock === 0 ? (
                                            <Badge tone="danger">Agotado</Badge>
                                        ) : p.stock <= 5 ? (
                                            <Badge tone="warning">Quedan {p.stock}</Badge>
                                        ) : null}
                                    </div>
                                    <p className="product__detail">{p.presentacion}</p>
                                    <p className="product__stock">Stock: {p.stock}</p>
                                    <div className="product__bottom">
                                        <strong>{formatCurrency(p.precio)}</strong>
                                        <Button size="sm" disabled={p.stock === 0} onClick={() => addToCart(p)}>
                                            Agregar
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {products.length === 0 && (
                            <p className="seller__empty">No encontramos productos con ese nombre o categoría.</p>
                        )}
                    </section>

                    <aside className="ticket">
                        <div className="ticket__header">
                            <div>
                                <span className="ticket__tag">Ticket del cliente</span>
                                <h2>Carrito de compra</h2>
                            </div>
                            <h3>{totalItems} {totalItems === 1 ? "producto" : "productos"}</h3>
                        </div>

                        <div className="ticket__items">
                            {cart.length === 0 ? (
                                <p className="ticket__empty">
                                    El carrito está vacío. Agrega productos desde el listado.
                                </p>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="ticket__item">
                                        <div className="ticket__item-info">
                                            <strong>{item.nombre}</strong>
                                            <span>{formatCurrency(item.precio)} c/u</span>
                                        </div>
                                        <div className="ticket__qty">
                                            <button onClick={() => changeQuantity(item.id, -1)} aria-label="Quitar una unidad">−</button>
                                            <span>{item.cantidad}</span>
                                            <button
                                                onClick={() => changeQuantity(item.id, 1)}
                                                disabled={item.cantidad >= item.stock}
                                                aria-label="Agregar una unidad"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <strong className="ticket__line">{formatCurrency(item.precio * item.cantidad)}</strong>
                                        <button className="ticket__remove" onClick={() => removeItem(item.id)} aria-label="Quitar producto">✕</button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="ticket__footer">
                            <FormField
                                id="pago"
                                label="Método de pago"
                                options={paymentMethods}
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <div className="ticket__total">
                                <span>Total a pagar</span>
                                <strong>{formatCurrency(total)}</strong>
                            </div>
                            <Button size="lg" fullWidth disabled={cart.length === 0} onClick={checkout}>
                                Cobrar venta
                            </Button>
                            <Button variant="ghost" fullWidth disabled={cart.length === 0} onClick={clearCart}>
                                Vaciar carrito
                            </Button>
                        </div>
                    </aside>
                </main>
            </div>

            <Modal open={Boolean(receipt)} title="Venta registrada" onClose={closeReceipt}>
                {receipt && (
                    <div className="receipt">
                        <p>{receipt.items} {receipt.items === 1 ? "producto" : "productos"} · {receipt.paymentMethod}</p>
                        <strong>{formatCurrency(receipt.total)}</strong>
                        <Button fullWidth onClick={closeReceipt}>Nueva venta</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Sales;
