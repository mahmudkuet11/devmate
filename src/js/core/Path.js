const path = require('path');

let Path = {
    base_path: function(additional_path = './'){
        return path.join(__dirname, '../../../', additional_path);
    }
};

module.exports = Path;