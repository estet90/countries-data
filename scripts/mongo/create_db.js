use countries_data

db.countries.insertMany([{"name":"Россия", "capital":"Москва", "area":1000000},
	{"name":"Страна Лимония", "capital":"Лимондон", "area":2000000},
	{"name":"Мордор", "capital":"Барад-Дур", "area":3000000},
	{"name":"Эфиопия", "capital":"Аддис-Абеба", "area":4000000}])

db.countries.createIndex({"name":1},{unique:true})
db.countiries.createIndex({"capital":1},{unique:true})
