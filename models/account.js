const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema({
	userId: String,
	userPW: String,
	salt: String,
	created: {type: Date, default: Date.now}
});

module.export = mongoose.model("account", Account);

