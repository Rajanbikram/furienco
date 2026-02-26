

const createUplaodsFolder = () => {
    const dr = "./uploads";
    if (!fs.existsSync(dr)) {
        fs.mkdirSync(dr);
    }
    console.log("Uploads folder is ready.");
};

exports = {
    createUplaodsFolder,
};