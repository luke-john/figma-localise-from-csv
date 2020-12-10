# Transformation logic

## Explanation of how this works

Given a Figma File with the following structure

```
  Cover
  –
  badoo (common)
  blendr (overrides)
  fiesta (overrides)
  hotornot (overrides)
  ------
  DO NOT EDIT BELOW
  ------
  run info
  badoo (output)
  blendr (output)
  fiesta (output)
  hotornot (output)
```

For each of the inputs (common + overrides), this tool

-   combines the common and overrides (where needed, bumble doesn't have any),
-   whilt transforms any colors used to match the latest published for the brand
-   and outputs into the associated output page.

Alternatively, given a Figma File with the following structure

```
  Cover
  --
  bumble (common)
  ------
  DO NOT EDIT BELOW
  ------
  run info
  bumble (output)
```

For the input (common), this tool

-   transforms any colors used to match the latest published for the brand
-   and outputs into the associated output page.

### Logic per **product**

#### Entities

**Source Asset**

Figma Component

-   name - via component name
-   **source glyph** - figma node for this component
-   **last modified date** - via files published components

#### Input

-   **Last run info**:

    Details of the last run including;

    -   **date last run**
    -   **tokens version used in last run**

-   **Common Source Assets**: _All components in a page_

    -   **Source Asset**[]

-   **Override Source Assets**: _All components in a page, used to override **Common Source Assets**_

    -   **Source Asset**[]

#### Output

-   **Output Page**: Page containing set of assets to be published for a brand.

#### Logic

_if_ (**Override Source Assets** exists)

-   _for_ (each **Source Asset** in **Override Source Assets**)

    -   _where_ **Source Asset** has had _**changes\***_ since the last run

        copy to the **Output Page**

_for_ (each **Source Asset** in **Common Source Assets**)

-   _where_ there is no asset with the same name in **Override Source Assets**

    _where_ **Source Asset** has had _**changes\***_ since the last run

    copy to the **Output Page**

_**changes\***_: a **Source Asset** is considered to have had changes

-   _where_ its **last modified date** is after the **date last run**

-   _or_ for (any of the **color style**s inside it's **source glyph**)

    the token associated with the **color style** is different between **tokens version used in last run** and **tokens version used in current run**

---
