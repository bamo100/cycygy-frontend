
# 🛠️ Debugging Report

**Project**: User Management Dashboard
**Date**: May 7, 2025
**Author**: Mutolib Olagoke
**Environment**: Next.js 15, Apollo Client, Tailwind CSS, TypeScript([GitHub][1])

---

## 1. Overview

During the development of the User Management Dashboard, several issues were identified and addressed. This report outlines the challenges faced, the steps taken to resolve them, and the outcomes achieved.

---

## 2. Issues Encountered & Resolutions

### Issue 1: Apollo `useQuery` Not Updating UI After Pagination

* **Description**: When implementing pagination with Apollo Client's `useQuery`, the UI did not reflect updated data upon page changes.

* **Steps to Reproduce**:

  1. Implement pagination using `useQuery`.
  2. Navigate to a different page.
  3. Observe that the UI does not update with new data.

* **Expected Result**: UI should display data corresponding to the selected page.

* **Actual Result**: UI remains unchanged despite page navigation.([Software Testing Co.][2])

* **Root Cause**: The `refetch` function was called with new variables, but the component did not re-render with the updated data.

* **Resolution**:

  * Ensured that the component's state (`page`) was correctly updated.
  * Verified that the `useQuery` hook's `variables` prop was reactive to state changes.
  * Considered using the `key` prop on the component to force re-rendering when necessary.

* **Outcome**: Pagination now functions as expected, with the UI updating to reflect the correct data for each page.

---

### Issue 2: ShadCN Components Displaying Transparent Backgrounds

* **Description**: UI components from ShadCN appeared with transparent backgrounds, affecting visibility and aesthetics.

* **Steps to Reproduce**:

  1. Render ShadCN components without specifying background classes.
  2. Observe the components' appearance.

* **Expected Result**: Components should have appropriate background colors for visibility.

* **Actual Result**: Components displayed with transparent backgrounds.

* **Root Cause**: Potential misconfiguration in Tailwind CSS or missing default styles.

* **Resolution**:

  * Reviewed Tailwind CSS configuration to ensure default styles were included.
  * Added necessary background color classes (e.g., `bg-white`) to components.
  * Ensured that the global CSS file imported Tailwind's base styles.

* **Outcome**: ShadCN components now display with appropriate background colors, enhancing UI clarity.

---

### Issue 3: TypeScript Error - `params` Not Assignable to Expected Type

* **Description**: Encountered a TypeScript error indicating that an object `{ id: string }` was not assignable to a `Promise<any>`.

* **Steps to Reproduce**:

  1. Define a component expecting `params` as `{ id: string }`.
  2. Use the component in a Next.js 15 dynamic route.
  3. Observe TypeScript error during compilation.

* **Expected Result**: Component compiles without type errors.

* **Actual Result**: TypeScript error due to type mismatch.

* **Root Cause**: In Next.js 15, dynamic route parameters (`params`) are asynchronous and should be handled as Promises.

* **Resolution**:

  * Modified the component to handle `params` asynchronously:

    ```tsx
    export default async function Page({ params }: { params: Promise<{ id: string }> }) {
      const { id } = await params;
      // ...
    }
    ```
  * Alternatively, used React's `use` hook in Client Components:

    ```tsx
    'use client';
    import { use } from 'react';

    export default function Page({ params }: { params: Promise<{ id: string }> }) {
      const { id } = use(params);
      // ...
    }
    ```

* **Outcome**: TypeScript errors resolved, and components now handle `params` correctly in Next.js 15.

---

## 3. Lessons Learned

* **Understanding Framework Updates**: Staying informed about updates in frameworks like Next.js is crucial, as changes (e.g., asynchronous `params`) can impact existing codebases.

* **Importance of Configuration**: Proper configuration of tools like Tailwind CSS ensures that UI components render as intended.

* **Type Safety**: Leveraging TypeScript's type system helps catch potential issues early in the development process.

---

## 4. Recommendations

* **Documentation**: Maintain up-to-date documentation on framework changes and their implications on the project.

* **Code Reviews**: Implement regular code reviews to catch configuration and type-related issues.

* **Continuous Learning**: Encourage the development team to stay abreast of updates in the tools and frameworks they use.


