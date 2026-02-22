import fs from 'fs';

const path = 'e:/Projects/saas-materials-hub-build/src/types/database.types.ts';
let content = fs.readFileSync(path, 'utf8');

const regex = /(        Update: {[^}]*}\n)      }/g;
content = content.replace(regex, '$1        Relationships: [\n          {\n            foreignKeyName: string\n            columns: string[]\n            isOneToOne: boolean\n            referencedRelation: string\n            referencedColumns: string[]\n          }\n        ]\n      }');

fs.writeFileSync(path, content, 'utf8');
console.log('Relationships added.');
