
const collegModel = require("../models/collegeModel")
const internModel = require("../models/internModel")


const nameValidator = function (value) {
    return /^[\s]*[a-zA-Z]+[\s]*$/.test(value)
}
const fullNameValidator = function (value) {
    return /^[\s]*[a-zA-z]+([\s\,\-]*[a-zA-z]+)*[\s]*$/.test(value)
}
const logoValidator = function (value) {
    return /(http|https):\/\/.+\.(jpg|jpeg|png)$/.test(value)
}

const createCollege = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        const requestBody = req.body
        const requestQuery = req.query
        if (Object.keys(requestQuery).length > 0)
            return res.
                status(400).
                send({ status: false, msg: "invalid entry " })

        if (Object.keys(requestBody).length == 0)
            return res.
                status(400).
                send({ status: false, msg: "data is required in request body" })

        if (Object.keys(requestBody).length > 4)
            return res.
                status(400).
                send({ status: false, msg: "invalid data entry inside request body" })

        const { name, fullName, logoLink, isDeleted } = requestBody
        if (!name)
            return res.
                status(400).
                send({ status: false, msg: "name is required" })
        if (!fullName)
            return res.
                status(400).
                send({ status: false, msg: "fullName is required" })
        if (!logoLink)
            return res.
                status(400).
                send({ status: false, msg: "logoLink is required" })

        /************************************* Name Validation ***********************************/
        if (!nameValidator(name))
            return res.
                status(400).
                send({ status: false, msg: "name is invalid" })
        /**************************************FullName Validation ***********************************/

        if (!fullNameValidator(fullName))
            return res.
                status(400).
                send({ status: false, msg: "fullName is invalid" })
        /************************************* logoLink Validation ***************************************/

        if (!logoValidator(logoLink))
            return res.
                status(400).
                send({ status: false, msg: "logoLink validation invalid" })
        if (isDeleted)
            if (isDeleted != false)
                return res.status(400).send({ status: false, msg: "invalid request" })

        /**************************************** Uniqueness Checking of collegeName *****************************************/
        let college = await collegModel.findOne({ name: name.trim() })
        if (college)
            return res.
                status(409).
                send({ status: false, msg: "college is already exist" })

        /****************************************** College Creation ***********************************************/
        let obj = {
            name: name.trim(),
            fullName: fullName.trim(),
            logoLink: logoLink.trim()
        }
        let result = await collegModel.create(obj)
        return res.
            status(201).
            send({ status: true, msg: "college is registerd", data: result })

    } catch (err) {
        res.
            status(500).
            send({ status: false, msg: err.message })
    }
}

const functionupInterns = async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*')
    try {
        let requestQuery = req.query
        let requestBody = req.body
        if (Object.keys(requestBody).length > 0)
            return res.
                status(400).
                send({ status: false, msg: "invalid data entry in requestBody" })
        if (!requestQuery || !requestQuery.collegeName)
            return res.
                status(400).
                send({ status: false, msg: "please enter the collegeName" })
        // if (Object.keys(requestQuery).length > 1)
        //     return res.
        //         status(400).
        //         send({ status: false, msg: "Please provide the college name only" })
        let data = await collegModel.findOne({ name: requestQuery.collegeName }).select({ name: 1, fullName: 1, logoLink: 1, _id: 1 })
        if (!data)
            return res.
                status(404).
                send({ status: false, msg: "college not found" })

        let saveData = await internModel.find({ collegeId: data._id }).select({ name: 1, mobile: 1, email: 1 })
        if (saveData.length == 0) {
            let obj = {
                name: data.name,
                fullName: data.fullName,
                logoLink: data.logoLink
            }
            return res.
                status(200).
                send({ status: true, msg: "User login has a correct successful response", data: obj })

        }
        let obj = {
            name: data.name,
            fullName: data.fullName,
            logoLink: data.logoLink,
            interns: saveData
        }


        return res.
            status(200).
            send({ status: true, msg: "User login has a correct successful response", data: obj })
    }
    catch (err) {
        res.
            status(500).
            send({ status: false, msg: err.message });
    }
}

module.exports.createCollege = createCollege
module.exports.functionupInterns = functionupInterns


