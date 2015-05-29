#!/bin/bash
rm -r ./output/
nunjucks-precompile src/common/templates > src/common/js/templates.js

cat "src/common/extension_info.json" | python -c 'import sys, re
for line in sys.stdin:
    m = re.match(r" *\"version\": \"(\d+\.\d+\.)(\d+)\", *", line)
    ret = "  \"version\": \"%s%s\", \n" % (m.group(1),int(m.group(2))+1) if m else line
    sys.stdout.write(ret)' > "src/common/extension_info.json.new"

mv src/common/extension_info.json.new src/common/extension_info.json
~/.bin/kango_lib/kango.py build .

