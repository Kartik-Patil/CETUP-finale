# Updating Remaining Pages to Tailwind CSS

## Pattern to Follow

All remaining pages should follow this structure:

```jsx
import { /* your existing imports */ } from "...";
import Navbar from "../../components/Navbar";
import PageContainer from "../../components/PageContainer";

const YourComponent = () => {
  // Keep all existing state and logic unchanged
  
  return (
    <Navbar>
      <PageContainer
        title="Page Title"
        subtitle="Page description"
        actions={
          // Optional: Add action buttons here
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            Action Button
          </button>
        }
      >
        {/* Your page content with Tailwind classes */}
      </PageContainer>
    </Navbar>
  );
};

export default YourComponent;
```

## Common Tailwind Class Patterns

### Cards
```jsx
<div className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
  {/* Card content */}
</div>
```

### Buttons
```jsx
// Primary Button
<button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
  Button Text
</button>

// Success Button
<button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium">
  Success Action
</button>

// Secondary/Outline Button
<button className="px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors font-medium">
  Secondary Action
</button>
```

### Input Fields
```jsx
<input
  type="text"
  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
  placeholder="Enter text"
/>
```

### Tables
```jsx
<div className="overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b border-border">
        <th className="text-left py-3 px-4 text-sm font-medium text-text-muted">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-border last:border-0">
        <td className="py-3 px-4 text-sm text-text-primary">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Grid Layouts
```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Grid items */}
</div>

// Stat cards grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stat cards */}
</div>
```

### Loading States
```jsx
<div className="text-center py-8 text-text-muted">
  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
  Loading...
</div>
```

### Empty States
```jsx
<div className="text-center py-8 text-text-muted">
  No data available yet.
</div>
```

### Forms
```jsx
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-text-primary mb-2">
      Label
    </label>
    <input
      type="text"
      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
</form>
```

### Status Badges
```jsx
// Success badge
<span className="px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
  Success
</span>

// Error badge
<span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
  Failed
</span>

// Info badge
<span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
  Info
</span>
```

## Remaining Pages to Update

### Admin Pages
1. ✅ AdminDashboard.jsx - UPDATED
2. ✅ Subjects.jsx - UPDATED
3. ⏳ Chapters.jsx
4. ⏳ AddMCQ.jsx
5. ⏳ ViewMCQs.jsx
6. ⏳ ManageNotes.jsx
7. ⏳ TestConfiguration.jsx
8. ⏳ StudentManagement.jsx
9. ⏳ Analytics.jsx
10. ⏳ EnhancedAnalytics.jsx

### Student Pages
1. ✅ StudentDashboard.jsx - UPDATED
2. ⏳ AttemptMCQs.jsx
3. ⏳ Result.jsx
4. ⏳ ViewNotes.jsx

### Auth Pages
1. ✅ Home.jsx - UPDATED
2. ✅ Login.jsx - UPDATED

## Key Points

1. **Keep all backend logic intact** - Only update the JSX/UI layer
2. **Import Navbar and PageContainer** - Use them to wrap your content
3. **Replace inline styles** - Convert all style objects to Tailwind classes
4. **Use custom colors** - Use `bg-primary`, `text-success`, etc. from the theme
5. **Add transitions** - Use `transition-all`, `hover:` states for better UX
6. **Make it responsive** - Use `md:`, `lg:` breakpoints
7. **Icon consistency** - Use SVG icons from Heroicons (same style as examples)

## Example Before/After

### Before (Old Style)
```jsx
<div style={{ padding: "20px", backgroundColor: "#fff", border: "1px solid #ddd" }}>
  <button onClick={handleClick} style={{ backgroundColor: "#007bff", color: "white" }}>
    Click Me
  </button>
</div>
```

### After (Tailwind)
```jsx
<div className="bg-card p-6 rounded-xl border border-border shadow-sm">
  <button 
    onClick={handleClick} 
    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
  >
    Click Me
  </button>
</div>
```

## Need Help?

Check the updated files for reference:
- `src/pages/Admin/AdminDashboard.jsx`
- `src/pages/Admin/Subjects.jsx`
- `src/pages/Student/StudentDashboard.jsx`
- `src/pages/Login.jsx`
