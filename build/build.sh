#!/usr/bin/env bash
# Rebuilds ../dist/leadership-course-demo.html from the five .docx files in ../source
# Needs: python3, python-docx (pip install python-docx)
set -e
cd "$(dirname "$0")"
python3 parse.py > /dev/null          # competencies + scenarios -> comps.json, scen.json
python3 normalize_weeks.py            # week labels / themes / phase on competencies
python3 dparse.py > /dev/null         # every block of every docx -> docs_raw.json
python3 build_docs.py > /dev/null     # sectioned, typed document model -> docs.json
python3 integrate.py                  # v2.html + docs_view.js + docs.css -> v3.html
python3 fx.py                         # v3.html + fx.css + fx.js -> ../dist/leadership-course-demo.html
echo "Built ../dist/leadership-course-demo.html"
