const cloudinary = require("../config/cloudinary");
const FileFolderModel = require("../model/fileSchema");
const fsPromises = require("fs/promises");

const createFileDocumentInMongoDB = async (req, res) => {
    try {
        const data = req.file;
        const { parentId } = req.body;

        const { _id } = req.user;

        const file = await FileFolderModel.create({
            name: data.originalname,
            userId: _id,
            type: "file",
            parentId: parentId === "null" ? undefined : parentId,
            metaData: { multer: data },
        });

        res.status(201);
        res.json({
            status: "in-progress",
            data: {
                file: file,
            },
        });

        return file;
    } catch (err) {
        console.log("------------------------");
        console.log(err);
        console.log("------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
        return false;
    }
};

const uploadFileToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.metaData.multer.path, {
            folder: `Cloud-Home/${file.userId}/${file.parentId}`,
            timeout: 60000,
        });

        try {
            await FileFolderModel.findByIdAndUpdate(file._id, {
                link: result.secure_url || result.url,
                "metaData.cloudinary": result,
            });

            return true;
        } catch (err) {
            console.log("---------------------------------");
            console.log("❌❌❌❌ File UPDATE Error ❌❌❌❌");
            console.log(err);
            console.log("---------------------------------");
            return false;
        }
    } catch (err) {
        console.log("---------------------------------");
        console.log("❌❌❌❌ Cloudinary Error ❌❌❌❌");
        console.log(err);
        console.log("---------------------------------");
        return false;
    }
};

const deleteFileFromServer = async (file) => {
    try {
        await fsPromises.rm(file.metaData.multer.path);
        console.log("File deleted ✅");
    } catch (err) {
        console.log("---------------------------------");
        console.log("❌❌❌❌ File Deletion from Server Failed ❌❌❌❌");
        console.log(err);
        console.log("---------------------------------");
        return false;
    }
};

const createFile = async (req, res) => {
    try {
        const documentCreated = await createFileDocumentInMongoDB(req, res);
        if (documentCreated) {
            const isFileUploadedToCloudinary = await uploadFileToCloudinary(documentCreated);
            if (isFileUploadedToCloudinary) {
                deleteFileFromServer(documentCreated);
            }
        }
    } catch (err) {
        console.log("------------------------");
        console.log(err);
        console.log("------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};

const deleteFileFolder = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { _id: userId } = req.user;

        const item = await FileFolderModel.findOne({ _id: id, userId });

        if (!item) {
            return res.status(404).json({
                status: "fail",
                message: `${type} not found`,
            });
        }

        if (type === 'file') {
            // Delete file from Cloudinary if it exists
            if (item.metaData && item.metaData.cloudinary && item.metaData.cloudinary.public_id) {
                await cloudinary.uploader.destroy(item.metaData.cloudinary.public_id);
            }
            // Delete the file document from MongoDB
            await FileFolderModel.findByIdAndDelete(id);
        } else if (type === 'folder') {
            // If it's a folder, we need to delete all nested files and folders
            await deleteNestedItems(id, userId);
            // Delete the folder document from MongoDB
            await FileFolderModel.findByIdAndDelete(id);
        }

        res.status(200).json({
            status: "success",
            message: `${type} deleted successfully`,
        });
    } catch (err) {
        console.error("Error in deleteFileFolder:", err);
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};

const deleteNestedItems = async (folderId, userId) => {
    const items = await FileFolderModel.find({ parentId: folderId, userId });

    for (const item of items) {
        if (item.type === 'file') {
            if (item.metaData && item.metaData.cloudinary && item.metaData.cloudinary.public_id) {
                await cloudinary.uploader.destroy(item.metaData.cloudinary.public_id);
            }
            await FileFolderModel.findByIdAndDelete(item._id);
        } else if (item.type === 'folder') {
            await deleteNestedItems(item._id, userId);
            await FileFolderModel.findByIdAndDelete(item._id);
        }
    }
};

module.exports = { createFile,  deleteFileFolder};