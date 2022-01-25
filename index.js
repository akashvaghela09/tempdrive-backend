const express = require("express")
const app = express();
const router = express.Router()
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = 2244

app.use(express.json())

// connect express.js with mongoDB
const connect = async () => {
    return new mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
}


// Folder Schema
const folderSchema = new mongoose.Schema(
    {
        folderName: {type: String},
        links: {type: Array},
        folderSize: {type: Number}
    }, 
    { versionKey: false }
)

// Folder modal
const FolderModal = mongoose.model("drive", folderSchema);


// Get Endpoint
router.get("/", async (req, res) => {
    const folder = await FolderModal.find();
    return res.status(200).json({data: folder})
})


// Get by ID Endpoint
router.get("/:id", async (req, res) => {
    try {
        const folder = await FolderModal.findById(req.params.id);
        return res.status(200).json({data: folder})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})


// Post Endpoint
router.post("/", async (req, res) => {
    try {
        const newFolderBody = {
            "folderName": req.body.folderName,
            "links": req.body.links,
            "folderSize": req.body.folderSize
        }
        const newFolder = FolderModal.create(newFolderBody)
        return res.status(200).json({data: "Folder added successfully"})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})


// Patch Endpoint
router.patch("/:id", async (req, res) => {
    try {
        const allFolders = await FolderModal.findByIdAndUpdate(req.params.id, req.body, { new: true})
        return res.status(200).json({data: allFolders})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})


// Delete Endpoint
router.delete("/:id", async (req, res) => {
    try {
        const allFolders = await FolderModal.findByIdAndDelete(req.params.id)
        return res.status(200).json({data: "Folder deleted successfully"})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})


// "folders" collection connected with route
app.use("/drive", router)

app.listen(process.env.PORT || PORT, async () => {
    await connect()
    console.log(`Listening on port ${PORT}`);
})