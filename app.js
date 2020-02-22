const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const port = process.env.PORT || 3000
const database = require("./db/database")

const app = express()
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))

let findObj = async function(list, id) {
	let obj = undefined
	list.forEach((e) => {
		if (String(e["_id"]) === id) {
			obj = e
		}
	})
	return obj
}

app.get("/", async (req, res) => {
	res.redirect("/users")
})
app.get("/users", async (req, res) => {
	let list = []
	try {
		list = await database.getUsers()
	}
	catch(e) {
		list = []
	}
	res.render("users", {list: list})
})
app.post("/users", async (req, res) => {
	let list = []
	5, 7, 3, 4, 8, 6
	try {
		list = await database.getUsers()
		if (req.body.sort === "ascend") {
			list = list.sort((a, b) => a.name.localeCompare(b.name))
		}
		else if (req.body.sort === "descend") {
			list = list.sort((a, b) => -a.name.localeCompare(b.name))
		}
		list = list.filter(obj => RegExp(req.body.search, "i").test(obj.name))
	}
	catch(e) {
		console.log(e)
	}
	res.render("users", {list: list})
})
app.get("/create_user", async (req, res) => {
	res.render("create_user")
})
app.post("/create_user", async (req, res) => {
	let id = String(req.body.id).replace(/[^A-Z0-9-_$]/ig, '')
	let name = req.body.name
	let email = req.body.email
	let age = req.body.age
	let obj = {}
	try {
		if (id && name && email && age && id !== "") {
			obj = {
				id: id,
				name: name,
				email: email,
				age: age
			}
			await database.createUser(obj)
		}
	}
	catch(e) {
		obj = {}
	}
	res.redirect("/users")
})
app.get("/edit_user/:_id", async (req, res) => {
	let obj = {}
	try {
		list = await database.getUsers()
		obj = await findObj(list, req.params._id)
		if (obj === undefined) {
			obj = {}
		}
	}
	catch(e) {
		obj = {}
	}
	res.render("edit_user", {_id: obj["_id"], id: obj["id"], name: obj["name"], email: obj["email"], age: obj["age"]})
})
app.post("/edit_user/:_id", async (req, res) => {
	let _id = req.params._id
	let id = String(req.body.id).replace(/[^A-Z0-9-_$]/ig, '')
	let name = req.body.name
	let email = req.body.email
	let age = req.body.age
	let obj = {}
	try {
		if (id && name && email && age && id !== "") {
			obj = {
				id: id,
				name: name,
				email: email,
				age: age
			}
			await database.editUser(_id, obj)
		}
	}
	catch(e) {
		obj = {}
	}
	res.redirect("/users")
})
app.post("/delete_user/:_id", async (req,res) => {
	let id = req.params._id
	try {
		await database.deleteUser(id)
	}
	catch(e) {}
	res.redirect("/users")
})

app.use(async (req, res) => {
	res.redirect("/")
})

app.listen(port, async () => {
	try {
		await database.init()
		console.log(`Listening on port ${port}!`)
	}
	catch(e) {
		console.log(e)
	}
})