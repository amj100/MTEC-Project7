const fs = require("fs").promises
const MongoClient = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectId

const url = "mongodb://localhost:27017"
const dbName = "usersdb"
const colName = "list"
const objName = "users_list"
const defaultUsers = require("./default_users.json")

let main = function() {
	let init = async function () {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url, { useUnifiedTopology: true })
			try {
				await client.connect()
				const db = client.db(dbName)
				const col = db.collection(colName)
				let arr
				if (await (await col.find().toArray()).length <= 0) {
					arr = await col.insertMany(defaultUsers)
				}
				resolve(arr)
			}
			catch(e) {
				reject(e)
			}
		})
	}
	let getUsers = async function (term) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url, { useUnifiedTopology: true })
			try {
				await client.connect()
				const db = client.db(dbName)
				const col = db.collection(colName)
				let arr = await col.find().toArray()
				resolve(arr)
			}
			catch(e) {
				reject(e)
			}
		})
	}
	let createUser = async function (obj) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url, { useUnifiedTopology: true })
			try {
				await client.connect()
				const db = client.db(dbName)
				const col = db.collection(colName)

				let inserted = await col.insertOne(obj)
				resolve(inserted)
			}
			catch(e) {
				reject(e)
			}
		})
	}
	let editUser = async function (_id, obj) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url, { useUnifiedTopology: true })
			try {
				await client.connect()
				const db = client.db(dbName)
				const col = db.collection(colName)

				let replaced = await col.findOneAndReplace({"_id": ObjectId(_id)}, obj)
				resolve(replaced)
			}
			catch(e) {
				reject(e)
			}
		})
	}
	let deleteUser = async function(id) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url, { useUnifiedTopology: true })
			try {
				await client.connect()
				const db = client.db(dbName)
				const col = db.collection(colName)

				let obj = await col.findOneAndDelete({"_id": ObjectId(id)})
				resolve(obj)
			}
			catch(e) {
				reject(e)
			}
		})
	}

	return { init, getUsers, deleteUser, createUser, editUser }
}

module.exports = main()