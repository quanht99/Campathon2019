module.exports.success = (data) => {
    if(data) throw new Error("Missing data.");
    return {
        success: true,
        data: data
    }
};

module.exports.fail = (msg) => {
    if(!msg) throw new Error("Missing message.");
    return {
        success: false,
        message: msg
    }
};

