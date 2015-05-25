# new
./bin/pybabel extract -F babel.cfg -o messages.pot .
./bin/pybabel init -i messages.pot -d src/infopub/translations -l zh_CN
./bin/pybabel compile -d src/infopub/translations

# update
./bin/pybabel extract -F babel.cfg -o messages.pot .
./bin/pybabel update -i messages.pot -d src/infopub/translations
./bin/pybabel compile -d src/infopub/translations