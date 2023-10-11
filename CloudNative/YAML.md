- Key:Value Pairs: YAML is based on a `key:value` pair structure

  - Strings: with or without quotation("") marks, both work!!
    - if string contains special characters, use quotation("")
    - multi-line string with (|)
  - boolean: true, false
  - null: missing value
  - numeric

- Lists: lists using `hyphens (-)` followed by a space
- Map/Dictionary: nested key:value through `indention`

- Aliases: define `anchors (&)` for values and later reference those values using `aliases (*)`

- `---` signal the start of a new document, you can place multiple document inside a single yaml file

```yaml
# key:value
# strings
name: "John Doe"
name: John Doe
description: |
  This is a multi-line
  string with line breaks preserved |.
url: "https://example.com"
message: "This is a 'quoted' value."

boolVal: true
nullVal: null
age: 30


# List
fruits:
  - apple
  - banana
  - orange

# Map
person:
  name: Alice
  age: 25

# Anchor and Alias
# Define an anchor for common user properties
common_user: &common
  first_name: John
  last_name: Doe
  age: 30

# Define individual users using aliases for common properties
# The <<: *common syntax copies the properties from the common anchor.
user1:
  <<: *common  # Include common properties
  username: johndoe
  email: john@example.com
```
