import re

with open(r'e:\\Projects\\saas-materials-hub-build\\src\\types\\database.types.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For every table in Tables block, it currently has Row, Insert, Update
# The last block of a table is Update: { ... } followed by `        }` (8 spaces, then closing bracket)

def replacer(match):
    return match.group(1) + "\n        Relationships: any[]\n      }"

# Match `        Update: { [anything] }\n      }`
# Be careful to match non-greedy inside Update
content = re.sub(r'(        Update: \{(?:[^{}]|\{[^{}]*\})*\}\n)      \}', replacer, content)

with open(r'e:\\Projects\\saas-materials-hub-build\\src\\types\\database.types.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
