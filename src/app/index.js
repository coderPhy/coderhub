const Koa = require("koa")
const bodyParser = require("koa-bodyparser")

const errorHandler = require("./error-hendle.js")
const useRouter = require("../router")

const app = new Koa()

app.useRouter = useRouter;
app.use(bodyParser())
app.useRouter()
// useRouter(app)
app.on("error", errorHandler)

module.exports = app

