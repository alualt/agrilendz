import { getToken } from "next-auth/jwt"
import axios from "axios"

export default async (req, res) => {
    var params = req.query
    const session = await getToken({ req })
    res.json((await axios.get(process.env.APIURL+"/login?email="+session.email)).data)
    res.end()
}