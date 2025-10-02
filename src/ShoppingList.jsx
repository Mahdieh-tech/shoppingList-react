import React, { useState, useEffect } from "react";
import "./ShoppingList.css";

const ShoppingList = () => {
  const [items, setItems] = useState([
    { name: "Milk", done: false },
    { name: "Bread", done: false },
    { name: "Eggs", done: false },
  ]);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions when typing
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    fetch(
      "https://world.openfoodfacts.org/cgi/search.pl?search_terms=" +
        query +
        "&search_simple=1&action=process&json=1&page_size=5"
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          const names = data.products
            .map((product) => product.product_name)
            .filter((name) => name);
          setSuggestions(names);
        }
      })
      .catch(() => setSuggestions([]));
  }, [query]);

  // Add item
  const addItem = (name) => {
    if (!name) return;
    setItems((prev) => [...prev, { name, done: false }]);
    setQuery("");
    setSuggestions([]);
  };

  // Remove item
  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle done
  const toggleDone = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { name: item.name, done: !item.done } : item
      )
    );
  };

  // Clear all
  const clearAll = () => setItems([]);

  // Count remaining
  const remaining = items.filter((item) => !item.done).length;

  return (
    <div className="shopping-container">
      <h2>🛒 Shopping List</h2>

      <div className="input-section">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter item name"
        />
        <button onClick={() => addItem(query)}>Add</button>
        <button className="clear-btn" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li key={i} onClick={() => addItem(s)}>
              {s}
            </li>
          ))}
        </ul>
      )}

      <ul className="shopping-list">
        {items.map((item, i) => (
          <li key={i} className={item.done ? "done" : ""}>
            <button
              className={"check-btn" + (item.done ? " checked" : "")}
              onClick={() => toggleDone(i)}
            >
              {item.done ? "✔" : "○"}
            </button>
            <span className="item-name">{item.name}</span>
            <span className="delete" onClick={() => removeItem(i)}>
              ✖
            </span>
          </li>
        ))}
      </ul>

      <p className="count">
        🧾 Items left to shop: <strong>{remaining}</strong>
      </p>
    </div>
  );
};

export default ShoppingList;
