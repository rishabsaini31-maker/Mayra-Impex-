# ⚡ 19 FEATURES - INTEGRATION QUICK START (30 Minutes)

## 🎯 GOAL: Get Search & Sort working in Admin Dashboard

---

## STEP 1: Run Database Migrations (5 min)

### In Supabase:

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open file: `mayra-impex-backend/migrations-19-features.sql`
6. Copy ALL the SQL code
7. Paste into Supabase editor
8. Click blue **Run** button (bottom right)
9. Wait for "Success" ✅

**Result:** Tables created, views ready, security configured

---

## STEP 2: Verify Backend (2 min)

Make sure backend is running:

```bash
cd mayra-impex-backend
npm start
# Should see: 🚀 API Server running on port 5000
```

✅ If you see this, continue to STEP 3

---

## STEP 3: Add Search & Sort to Products (15 min)

### 3A. Open the admin dashboard file:

```
File: src/screens/admin/AdminDashboardScreen.js
```

### 3B. Add imports at TOP (after existing imports):

```javascript
import { SearchBar, SortOptions } from "../../components/AdminFeatures";
```

### 3C. Find `ProductsContent` function, add state after the query hooks:

```javascript
const ProductsContent = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const [showAddModal, setShowAddModal] = useState(false);
  // ... other existing state ...

  // ADD THESE 2 LINES:
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
```

### 3D. Add filtering function before `return` statement:

```javascript
const filteredProducts = products
  .filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categories?.name &&
        p.categories.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )
  .sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });
```

### 3E. In the return JSX, find this section:

```javascript
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.md,
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.border,
        }}
      >
        <Text
          style={[styles.productsTitle, { color: currentTheme.text, flex: 1 }]}
        >
          All Products ({products.length})   {/* CHANGE: products.length → filteredProducts.length */}
        </Text>
```

### 3F. Change line to:

```javascript
          All Products ({filteredProducts.length})
```

### 3G. Right after that header View closes, ADD:

```javascript
      </View>

      {/* ADD THESE 2 COMPONENTS */}
      <View style={{ paddingHorizontal: SPACING.lg }}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
          theme={currentTheme}
        />

        <SortOptions
          value={sortBy}
          onSelect={setSortBy}
          options={[
            { value: "recent", label: "📅 Recent" },
            { value: "price-asc", label: "💲 Low to High" },
            { value: "price-desc", label: "💲 High to Low" },
            { value: "name", label: "🔤 A to Z" },
          ]}
          theme={currentTheme}
        />
      </View>

      {products.length === 0 ? (
```

### 3H. Find the FlatList data prop:

```javascript
        <FlatList
          data={products}  {/* CHANGE TO: filteredProducts */}
```

Change to:

```javascript
        <FlatList
          data={filteredProducts}
```

---

## STEP 4: Test It Works (3 min)

1. Reload app (or reload browser if web)
2. Go to Admin → Manage Products
3. Type in search: "tea" or "gift"
4. **✅ Products should filter in real-time**
5. Click sort options
6. **✅ Products should reorder by price/name**

**SUCCESS! 2 features working!** 🎉

---

## STEP 5: Add to Orders (Same Pattern)

### 5A. Import in OrdersContent:

```javascript
const [searchQuery, setSearchQuery] = useState("");
const [filterStatus, setFilterStatus] = useState("all");
const [sortBy, setSortBy] = useState("recent");
```

### 5B. Filter function:

```javascript
const filteredOrders = orders
  .filter((order) => {
    const matchesSearch =
      order.users?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.includes(searchQuery);
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    if (sortBy === "recent")
      return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === "oldest")
      return new Date(a.created_at) - new Date(b.created_at);
    return 0;
  });
```

### 5C. Add components:

```javascript
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by customer name..."
        theme={currentTheme}
      />

      <FilterBar
        filters={[
          { id: "all", label: "All Orders" },
          { id: "pending", label: "⏳ Pending" },
          { id: "approved", label: "✅ Approved" },
          { id: "rejected", label: "❌ Rejected" },
        ]}
        activeFilter={filterStatus}
        onSelectFilter={setFilterStatus}
        theme={currentTheme}
      />

      <SortOptions
        value={sortBy}
        onSelect={setSortBy}
        options={[
          { value: "recent", label: "Recent First" },
          { value: "oldest", label: "Oldest First" },
        ]}
        theme={currentTheme}
      />
```

### 5D. Change FlatList:

```javascript
          data={filteredOrders}  {/* was: orders */}
```

---

## STEP 6: Add to Customers (Same Pattern)

### 6A. State:

```javascript
const [searchQuery, setSearchQuery] = useState("");
```

### 6B. Filter:

```javascript
const activeCustomers = customers
  .filter((c) => c.is_blocked !== true)
  .filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery),
  );

const blockedCustomers = customers
  .filter((c) => c.is_blocked === true)
  .filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery),
  );
```

### 6C. Add SearchBar:

```javascript
<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search customers..."
  theme={currentTheme}
/>;

{
  /* Then your existing Tab Bar */
}
```

### 6D. Update renderCustomerList calls:

```javascript
{
  customerTab === "active" ? (
    <View>{renderCustomerList(activeCustomers, false)}</View>
  ) : (
    <View>{renderCustomerList(blockedCustomers, true)}</View>
  );
}
```

---

## CONGRATS! 🎉

You now have:

- ✅ Search Products
- ✅ Sort Products
- ✅ Search Orders
- ✅ Filter Orders
- ✅ Sort Orders
- ✅ Search Customers

**6 out of 19 features in 30 minutes!**

---

## NEXT FEATURES (Easy Copy-Paste)

### 7️⃣ Add Inventory (10 min)

In product edit modal, add:

```javascript
<InventoryManager
  productId={editingProduct.id}
  theme={currentTheme}
  inventoryAPI={inventoryAPI}
/>
```

### 8️⃣ Add Customer Notes (10 min)

In customer modal, add:

```javascript
<TouchableOpacity onPress={() => setShowNotes(true)}>
  <Text>📝 View Notes</Text>
</TouchableOpacity>

<CustomerNotesModal
  visible={showNotes}
  customerId={selectedCustomer.id}
  onClose={() => setShowNotes(false)}
  theme={currentTheme}
  notesAPI={notesAPI}
/>
```

### 9️⃣ Add Bulk Delete (15 min)

Follow product selection pattern in IMPLEMENTATION_GUIDE.md

---

## 📚 DETAILED GUIDES

For more advanced features:

- 📖 **IMPLEMENTATION_GUIDE.md** - Full examples + code
- 📋 **19_FEATURES_CHECKLIST.md** - Testing procedures
- 📊 **DELIVERY_SUMMARY.md** - What's included

---

## ⏰ TIME TRACKING

```
✅ Step 1 (Database): 5 min
✅ Step 2 (Verify): 2 min
✅ Step 3 (Products): 5 min
✅ Step 4 (Test): 3 min
✅ Step 5 (Orders): 5 min
✅ Step 6 (Customers): 5 min

TOTAL: 25 minutes
```

---

## 🆘 TROUBLESHOOTING

**Search not working?**

- Check spelling: `searchQuery` case-sensitive
- Verify FlatList uses correct data array name
- Check import is there

**UI looks wrong?**

- Make sure `theme={currentTheme}` is passed
- Verify SPACING, FONTS imported

**Crashes?**

- Check missing closing `}` or `)`
- Verify all imports present
- Check component props match examples

**Can't find ProductsContent?**

- Search for: "All Products"
- That's your section

---

**START NOW! Follow STEP 1 above.** ⚡

Questions? Check IMPLEMENTATION_GUIDE.md

Let's go! 🚀
